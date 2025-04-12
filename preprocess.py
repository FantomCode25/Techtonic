import pandas as pd
import numpy as np

# Load your generated data
df = pd.read_csv("whitefield_koramangala_pricing.csv", parse_dates=["timestamp"])

def engineer_features(df):
    # Cyclical time features (helps AI understand 11PM and 1AM are close)
    df['hour_sin'] = np.sin(2 * np.pi * df['hour']/23)
    df['hour_cos'] = np.cos(2 * np.pi * df['hour']/23)
    df['day_sin'] = np.sin(2 * np.pi * df['day_of_week']/6)
    df['day_cos'] = np.cos(2 * np.pi * df['day_of_week']/6)
    
    # Lag features (past 3 hours' surge values)
    for lag in [1, 2, 3]:
        df[f'surge_lag_{lag}'] = df['surge_multiplier'].shift(lag)
    
    # Rolling averages
    df['surge_rolling_3h'] = df['surge_multiplier'].rolling(3).mean()
    df['surge_rolling_12h'] = df['surge_multiplier'].rolling(12).max()
    
    # Drop rows with missing values (from lag features)
    return df.dropna()

processed_data = engineer_features(df)
processed_data.to_csv("processed_pricing_data.csv", index=False)