# from fastapi import FastAPI
# from pydantic import BaseModel
# import joblib
# import numpy as np
# import random  # <-- Add this import

# # Load the pre-trained model and scaler
# model = joblib.load('surge_model.pkl')
# scaler = joblib.load('scaler.pkl')

# # Create FastAPI app
# app = FastAPI()

# # Define request body
# class PredictionRequest(BaseModel):
#     hour: int
#     day_of_week: int

# @app.post("/predict/")
# async def predict_surge(request: PredictionRequest):
#     # Get the hour and day_of_week from the request
#     hour = request.hour
#     day_of_week = request.day_of_week
    
#     # Prepare the input data
#     input_data = np.array([[hour, day_of_week]])
#     input_data_scaled = scaler.transform(input_data)

#     # Make prediction
#     surge_prediction = model.predict(input_data_scaled)
    
#     # If surge, predict when surge will happen in minutes
#     if surge_prediction[0] == 1:
#         time_to_surge = random.randint(1, 10)  # Random surge prediction (between 1-10 minutes)
#         return {"prediction": "Surge Period", "minutes_until_drop": time_to_surge}
#     else:
#         return {"prediction": "No Surge", "minutes_until_drop": None}


from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
import random
from fastapi.middleware.cors import CORSMiddleware  # Import CORS middleware

# Load the pre-trained model and scaler
model = joblib.load('surge_model.pkl')
scaler = joblib.load('scaler.pkl')

# Create FastAPI app
app = FastAPI()

# Add CORS middleware to allow requests from your frontend
origins = [
    "http://localhost",  # Allow frontend from localhost
    "http://localhost:5173",  # Your React frontend URL (adjust as needed)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow specified origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Define request body
class PredictionRequest(BaseModel):
    hour: int
    day_of_week: int

@app.post("/predict/")
async def predict_surge(request: PredictionRequest):
    # Get the hour and day_of_week from the request
    hour = request.hour
    day_of_week = request.day_of_week

    # Prepare the input data
    input_data = np.array([[hour, day_of_week]])
    input_data_scaled = scaler.transform(input_data)

    # Make prediction
    surge_prediction = model.predict(input_data_scaled)

    # If surge, predict when surge will happen in minutes
    if surge_prediction[0] == 1:
        time_to_surge = random.randint(1, 10)  # Random surge prediction (between 1-10 minutes)
        return {"prediction": "Surge Period", "minutes_until_drop": time_to_surge}
    else:
        return {"prediction": "No Surge", "minutes_until_drop": None}

