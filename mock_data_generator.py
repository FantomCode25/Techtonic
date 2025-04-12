import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import googlemaps
import os
from dotenv import load_dotenv

# Load Google Maps API Key (if available)
load_dotenv()
gmaps = googlemaps.Client(key=os.getenv('GOOGLE_MAPS_API_KEY')) if os.getenv('GOOGLE_MAPS_API_KEY') else None

# Fixed route details
PICKUP = "Whitefield, Bengaluru, India"
DROP = "Koramangala, Bengaluru, India"
BASE_FARE = 150  # INR

def get_route_details():
    """Fetch distance (km) & duration (mins) from Google Maps"""
    if not gmaps:
        return 20.0, 60  # Default mock values
    
    try:
        directions = gmaps.directions(PICKUP, DROP, mode="driving")
        distance_km = directions[0]['legs'][0]['distance']['value'] / 1000
        duration_mins = directions[0]['legs'][0]['duration']['value'] / 60
        return distance_km, duration_mins
    except:
        return 20.0, 60  # Fallback if API fails

def generate_mock_data(days=90):
    """Generate 3 months of hourly surge pricing data"""
    distance_km, avg_duration_mins = get_route_details()
    start_date = datetime.now() - timedelta(days=days)
    timestamps = pd.date_range(start=start_date, periods=days*24, freq='H')
    
    data = []
    for timestamp in timestamps:
        hour = timestamp.hour
        day = timestamp.weekday()
        is_weekend = day >= 5
        is_peak = (7 <= hour <= 10) or (17 <= hour <= 21)
        
        # Base surge logic
        surge = 1.0
        if is_peak:
            surge += np.random.uniform(0.3, 1.2)  # Higher in peak hours
        if is_weekend:
            surge += np.random.uniform(0.1, 0.5)  # Slightly higher on weekends
        
        # Random events (accidents, rain, protests)
        if np.random.random() < 0.05:
            surge += np.random.uniform(0.5, 2.0)
        
        surge = max(1.0, min(round(surge, 1), 5.0))  # Cap between 1.0x-5.0x
        price = round(BASE_FARE * surge)
        
        data.append({
            "pickup": PICKUP,
            "drop": DROP,
            "timestamp": timestamp,
            "hour": hour,
            "day_of_week": day,
            "is_weekend": is_weekend,
            "distance_km": distance_km,
            "avg_duration_mins": avg_duration_mins,
            "base_fare": BASE_FARE,
            "surge_multiplier": surge,
            "current_price": price,
            "is_peak_hour": is_peak,
            "is_rain": np.random.choice([0, 1], p=[0.8, 0.2]),  # 20% chance of rain
        })
    
    return pd.DataFrame(data)

# Generate and save data
mock_data = generate_mock_data(days=90)
mock_data.to_csv("whitefield_koramangala_pricing.csv", index=False)
print("Mock data generated successfully!")