import pandas as pd
import numpy as np
from prophet import Prophet
import joblib

# Load and prepare data
data = pd.read_csv("processed_pricing_data.csv")
data['timestamp'] = pd.to_datetime(data['timestamp'])
data = data.set_index('timestamp').sort_index()

# Create all 9 features to match LSTM
data['hour'] = data.index.hour
data['day_of_week'] = data.index.dayofweek
data['hour_sin'] = np.sin(2 * np.pi * data['hour'] / 23)
data['hour_cos'] = np.cos(2 * np.pi * data['hour'] / 23) 
data['day_sin'] = np.sin(2 * np.pi * data['day_of_week'] / 6)
data['day_cos'] = np.cos(2 * np.pi * data['day_of_week'] / 6)
data['is_peak'] = data['hour'].apply(lambda x: 1 if (7 <= x <= 9) or (16 <= x <= 19) else 0)
data['is_weekend'] = data['day_of_week'].apply(lambda x: 1 if x >= 5 else 0)

# Add lag features
for i in [1, 2, 3]:
    data[f'surge_lag_{i}'] = data['surge_multiplier'].shift(i)
data = data.dropna()

# Prepare DataFrame with EXACTLY 9 features matching LSTM
df = data[['surge_multiplier', 'hour_sin', 'hour_cos', 'day_sin', 'day_cos',
           'is_peak', 'is_weekend', 'surge_lag_1', 'surge_lag_2', 'surge_lag_3']] \
        .reset_index() \
        .rename(columns={'timestamp': 'ds', 'surge_multiplier': 'y'})

# Initialize and configure Prophet
model = Prophet(
    daily_seasonality=False,
    weekly_seasonality=False, 
    yearly_seasonality=False,
    changepoint_prior_scale=0.05,
    seasonality_mode='multiplicative'
)

# Add only the 9 regressors that match LSTM features
model.add_regressor('hour_sin')
model.add_regressor('hour_cos')
model.add_regressor('day_sin') 
model.add_regressor('day_cos')
model.add_regressor('is_peak')
model.add_regressor('is_weekend')
model.add_regressor('surge_lag_1')
model.add_regressor('surge_lag_2')
model.add_regressor('surge_lag_3')

# Train and save
model.fit(df)
joblib.dump(model, "prophet_forecaster.pkl")
print("Prophet model trained with 9 matching features and saved.")