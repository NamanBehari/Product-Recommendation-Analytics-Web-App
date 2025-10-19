# 1. SETUP:
# To run this file, you must first install the required libraries.
# Open your terminal in this project's folder and run:
# pip install scikit-learn==1.0.2 "fastapi[all]" pandas
#
# 2. RUN THE SERVER:
# With the libraries installed, run this command in your terminal:
# uvicorn main:app --reload

import pickle
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel # <-- CORRECTED THIS LINE
import ast # Used to safely parse string representations of lists

# --- 1. INITIALIZE THE FASTAPI APP ---
app = FastAPI(
    title="Product Recommendation API",
    description="API to get product recommendations and analytics with an autocomplete feature.",
    version="1.2.0"
)

# --- 2. CONFIGURE CORS ---
# Allows the frontend to make requests to this backend server.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all origins for simplicity.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. LOAD MODELS AND DATA AT STARTUP ---
try:
    print("Loading data and models...")
    with open('tfidf_vectorizer.pkl', 'rb') as f:
        tfidf_vectorizer = pickle.load(f)
    with open('cosine_similarity.pkl', 'rb') as f:
        cosine_sim = pickle.load(f)

    df = pd.read_csv('final_product_data.csv')
    
    # --- Data Cleaning ---
    df = df.fillna('') # Prevents JSON errors from NaN values.
    
    df['original_title'] = df['title'].str.strip()
    df['title'] = df['title'].str.strip().str.lower()

    df.dropna(subset=['title', 'uniq_id', 'price'], inplace=True)
    df['price'] = pd.to_numeric(df['price'], errors='coerce')
    df.dropna(subset=['price'], inplace=True)

    def parse_image_list(images_str):
        try:
            if not isinstance(images_str, str) or images_str == '': return []
            image_list = ast.literal_eval(images_str)
            return [img.strip() for img in image_list] if isinstance(image_list, list) else []
        except (ValueError, SyntaxError):
            return []
    df['images'] = df['images'].apply(parse_image_list)

    product_titles_for_autocomplete = df['original_title'].tolist()

    print("Data and models loaded successfully!")

except FileNotFoundError as e:
    print(f"FATAL ERROR: A required file was not found: {e.filename}. Make sure all .pkl and .csv files are in the same folder as main.py.")
    exit()
except Exception as e:
    print(f"An unexpected error occurred during model loading: {e}")
    exit()

# --- 4. DEFINE THE REQUEST MODEL ---
class RecommendationRequest(BaseModel):
    title: str
    num_recommendations: int = 10

# --- 5. DEFINE API ENDPOINTS ---

@app.get("/")
def read_root():
    return {"message": "Welcome to the Product Recommendation API."}

@app.get("/titles")
def get_titles():
    """Returns a list of all product titles for the search autocomplete feature."""
    return {"titles": product_titles_for_autocomplete}

@app.get("/products")
def get_products(limit: int = 2000):
    """Fetches a list of all products for the analytics page."""
    return df.head(limit).to_dict(orient='records')

@app.post("/recommendations")
def get_recommendations(request: RecommendationRequest):
    """
    Finds and returns product recommendations using a hybrid scoring model
    that considers both content and price similarity.
    """
    search_title = request.title.strip().lower()
    
    if search_title not in df['title'].values:
        raise HTTPException(status_code=404, detail=f"Product '{request.title}' not found.")

    # --- 1. GET INITIAL RECOMMENDATIONS (CONTENT-BASED) ---
    idx = df[df['title'] == search_title].index[0]
    original_product = df.iloc[idx]
    original_price = original_product['price']

    # Fetch a larger pool of candidates for more effective re-ranking
    initial_candidate_count = request.num_recommendations * 3
    sim_scores = sorted(list(enumerate(cosine_sim[idx])), key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:initial_candidate_count + 1]
    
    product_indices = [i[0] for i in sim_scores]
    content_scores = {index: score for index, score in sim_scores}
    initial_recommendations = df.iloc[product_indices].copy()

    # --- 2. RE-RANK BASED ON A HYBRID PRICE + CONTENT SCORE ---
    content_weight = 0.7
    price_weight = 0.3
    final_scores = []

    for index, row in initial_recommendations.iterrows():
        # Calculate price similarity score (higher is better)
        price_diff = abs(row['price'] - original_price)
        # Normalize the difference to prevent large prices from skewing the score
        normalized_price_diff = price_diff / (original_price + 1e-6) # Add epsilon to avoid division by zero
        price_score = 1 / (1 + normalized_price_diff)

        content_score = content_scores.get(index, 0)
        final_score = (content_weight * content_score) + (price_weight * price_score)
        final_scores.append((index, final_score))

    # Sort candidates by the new final hybrid score
    reranked_scores = sorted(final_scores, key=lambda x: x[1], reverse=True)

    # --- 3. SELECT TOP N RESULTS FROM RE-RANKED LIST ---
    top_product_indices = [i[0] for i in reranked_scores[:request.num_recommendations]]
    
    results_df = df.loc[top_product_indices].copy()
    results_df['title'] = results_df['original_title']

    return results_df.to_dict(orient='records')


