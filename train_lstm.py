import pandas as pd
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
import joblib
import matplotlib.pyplot as plt

# 1. Load processed data
data = pd.read_csv("processed_pricing_data.csv")

# 2. Create time-based features if they don't exist
if 'hour' not in data.columns:
    data['hour'] = pd.to_datetime(data['timestamp']).dt.hour
if 'day_of_week' not in data.columns:
    data['day_of_week'] = pd.to_datetime(data['timestamp']).dt.dayofweek

# Create feature columns
data['hour_sin'] = np.sin(2 * np.pi * data['hour'] / 23)
data['hour_cos'] = np.cos(2 * np.pi * data['hour'] / 23)
data['day_sin'] = np.sin(2 * np.pi * data['day_of_week'] / 6)
data['day_cos'] = np.cos(2 * np.pi * data['day_of_week'] / 6)
data['is_peak'] = data['hour'].apply(lambda x: 1 if (7 <= x <= 9) or (16 <= x <= 19) else 0)
data['is_weekend'] = data['day_of_week'].apply(lambda x: 1 if x >= 5 else 0)

# 3. Select features and target
features = ['hour_sin', 'hour_cos', 'day_sin', 'day_cos',
            'surge_lag_1', 'surge_lag_2', 'surge_lag_3',
            'is_peak', 'is_weekend']  # Now 9 features

X = data[features]
y = data['surge_multiplier']

# 4. Scale features
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)
joblib.dump(scaler, "scaler.pkl")

# 5. Reshape for LSTM
X_reshaped = X_scaled.reshape((X_scaled.shape[0], 1, len(features)))

# 6. Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X_reshaped, y, test_size=0.2, shuffle=False, random_state=42
)

# 7. Build LSTM model
model = Sequential([
    LSTM(64, input_shape=(1, len(features)), return_sequences=False),
    Dropout(0.2),
    Dense(1)
])
model.compile(optimizer='adam', loss='mse')

# 8. Train with EarlyStopping
history = model.fit(
    X_train, y_train,
    epochs=100,
    batch_size=32,
    validation_data=(X_test, y_test),
    callbacks=[EarlyStopping(patience=10, restore_best_weights=True)],
    verbose=1
)

# 9. Save model and plot training
model.save("surge_predictor.h5")
print(f"Model trained with {len(features)} features and saved successfully.")

