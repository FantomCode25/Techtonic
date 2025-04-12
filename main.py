from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional, List
import numpy as np
from tensorflow.keras.models import load_model
from prophet import Prophet
import joblib
import pandas as pd
import logging
import math
from collections import deque

app = FastAPI(title="Dynamic Surge Pricing API")

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Configuration
PEAK_HOURS = [(7, 9), (16, 19)]  # Morning and evening rush hours
BASE_PRICE = 150.0
SURGE_THRESHOLD = 0.15  # 15% threshold for significant changes

# Load models
try:
    lstm_model = load_model("surge_predictor.h5", compile=False)
    lstm_model.compile(optimizer='adam', loss='mse')
    prophet_model = joblib.load("prophet_forecaster.pkl")
    scaler = joblib.load("scaler.pkl")
    logger.info("All models loaded successfully")
    logger.info(f"LSTM input shape: {lstm_model.input_shape}")
    logger.info(f"Prophet regressors: {list(prophet_model.extra_regressors.keys())}")
except Exception as e:
    logger.error(f"Model loading failed: {str(e)}")
    exit(1)

# Request and Response schemas
class PredictionRequest(BaseModel):
    hour: int
    day_of_week: int  # 0=Monday, 6=Sunday
    surge_lag_1: float
    surge_lag_2: float
    surge_lag_3: float

class ForecastPoint(BaseModel):
    timestamp: str
    predicted_surge: float

class PredictionResponse(BaseModel):
    current_surge: float
    base_price: float = BASE_PRICE
    current_price: float
    next_price_drop: Optional[str]
    forecast: List[ForecastPoint]
    message: Optional[str]

def is_peak_hour(hour: int) -> bool:
    """Check if current hour is within peak hours"""
    return any(start <= hour <= end for start, end in PEAK_HOURS)

def prepare_lstm_input(request: PredictionRequest) -> np.ndarray:
    """Prepare input features with enhanced time encoding"""
    # Enhanced cyclical time features
    hour_rad = 2 * np.pi * request.hour / 23
    day_rad = 2 * np.pi * request.day_of_week / 6
    
    features = np.array([[
        np.sin(hour_rad), np.cos(hour_rad),  # Hour encoding
        np.sin(day_rad), np.cos(day_rad),    # Day encoding
        request.surge_lag_1 ** 0.5,          # Square root transform for lags
        request.surge_lag_2 ** 0.5,
        request.surge_lag_3 ** 0.5,
        float(is_peak_hour(request.hour)),    # Peak hour flag
        float(request.day_of_week >= 5)       # Weekend flag
    ]])
    
    return scaler.transform(features).reshape(1, 1, -1)

def generate_forecast(current_time: datetime, current_surge: float, request: PredictionRequest) -> pd.DataFrame:
    """Generate dynamic forecast with trend analysis"""
    future = prophet_model.make_future_dataframe(periods=24, freq='H', include_history=False)
    
    # Time features with enhanced encoding
    future['hour'] = future['ds'].dt.hour
    future['hour_sin'] = np.sin(2 * np.pi * future['hour'] / 23)
    future['hour_cos'] = np.cos(2 * np.pi * future['hour'] / 23)
    future['day_sin'] = np.sin(2 * np.pi * future['ds'].dt.dayofweek / 6)
    future['day_cos'] = np.cos(2 * np.pi * future['ds'].dt.dayofweek / 6)
    
    # Business features
    future['is_peak'] = future['hour'].apply(is_peak_hour).astype(float)
    future['is_weekend'] = (future['ds'].dt.dayofweek >= 5).astype(float)
    
    # Lag features with smoothing
    future['surge_lag_1'] = current_surge ** 0.5
    future['surge_lag_2'] = request.surge_lag_1 ** 0.5
    future['surge_lag_3'] = request.surge_lag_2 ** 0.5
    
    forecast = prophet_model.predict(future)
    return forecast[['ds', 'yhat']].rename(columns={'ds': 'timestamp', 'yhat': 'predicted_surge'})

def analyze_drop_pattern(current_surge: float, forecast: pd.DataFrame, now: datetime) -> tuple:
    """Enhanced drop analysis with trend detection"""
    # Dynamic threshold based on current surge and volatility
    volatility = abs(forecast['predicted_surge'].diff().mean())
    threshold = max(SURGE_THRESHOLD, current_surge * 0.1 + volatility * 2)
    
    # Find all potential drops in next 6 hours
    candidates = []
    for _, row in forecast[forecast['timestamp'] <= now + timedelta(hours=6)].iterrows():
        drop_amount = current_surge - row['predicted_surge']
        if drop_amount > threshold:
            candidates.append({
                'time': row['timestamp'],
                'drop': drop_amount,
                'new_surge': row['predicted_surge']
            })
    
    if not candidates:
        return None, "No significant price drops expected in the next 6 hours"
    
    # Select the most significant drop
    best_drop = max(candidates, key=lambda x: x['drop'])
    return best_drop['time'], best_drop

@app.post("/predict", response_model=PredictionResponse)
async def predict_surge(request: PredictionRequest):
    try:
        now = datetime.now()
        logger.info(f"Prediction request at {now} for hour {request.hour}, day {request.day_of_week}")

        # LSTM prediction with enhanced features
        lstm_input = prepare_lstm_input(request)
        current_surge = max(1.0, float(lstm_model.predict(lstm_input)[0][0]))  # Ensure surge ≥ 1.0
        current_price = round(BASE_PRICE * current_surge, 2)

        # Prophet forecast with trend analysis
        forecast_df = generate_forecast(now, current_surge, request)
        forecast_df['timestamp'] = pd.to_datetime(forecast_df['timestamp'])
        
        # Dynamic drop detection
        drop_time, drop_info = analyze_drop_pattern(current_surge, forecast_df, now)
        
        # Generate contextual message
        if drop_time:
            wait_min = max(1, int((drop_time - now).total_seconds() / 60))
            savings = round((current_surge - drop_info['new_surge']) * BASE_PRICE, 2)
            
            if wait_min < 30:
                urgency = f"soon at {drop_time.strftime('%H:%M')}"
            else:
                urgency = f"in about {wait_min//60}h {wait_min%60}m"
                
            message = (f"Best price drop expected {urgency}. "
                      f"Estimated savings: ₹{savings} "
                      f"(surge {current_surge:.2f} → {drop_info['new_surge']:.2f})")
        else:
            message = ("High demand continues. " 
                      f"Next lowest surge: {forecast_df['predicted_surge'].min():.2f} "
                      f"expected at {forecast_df.loc[forecast_df['predicted_surge'].idxmin(), 'timestamp'].strftime('%H:%M')}")

        return PredictionResponse(
            current_surge=round(current_surge, 2),
            current_price=current_price,
            next_price_drop=drop_time.strftime("%Y-%m-%d %H:%M") if drop_time else None,
            forecast=[
                ForecastPoint(
                    timestamp=row['timestamp'].strftime("%Y-%m-%d %H:%M"),
                    predicted_surge=round(row['predicted_surge'], 2)
                ) for _, row in forecast_df.head(6).iterrows()
            ],
            message=message
        )

    except Exception as e:
        logger.error(f"Prediction error: {str(e)}", exc_info=True)
        return PredictionResponse(
            current_surge=1.0,
            current_price=BASE_PRICE,
            next_price_drop=None,
            forecast=[],
            message=f"System error: {str(e)}"
        )

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "models_loaded": True,
        "feature_alignment": {
            "expected_features": 9,
            "lstm_features": lstm_model.input_shape[2],
            "prophet_regressors": len(prophet_model.extra_regressors)
        },
        "configuration": {
            "peak_hours": PEAK_HOURS,
            "base_price": BASE_PRICE,
            "surge_threshold": SURGE_THRESHOLD
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)