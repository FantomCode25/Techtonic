import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score
import numpy as np

# Load the mock data
df = pd.read_csv("mock_data.csv", parse_dates=["timestamp"])

# Extract features from the timestamp
df['hour'] = df['timestamp'].dt.hour
df['day_of_week'] = df['timestamp'].dt.weekday

# We need to predict "surge" or "no surge" based on time
# Labeling surge if price > base price (random base price was between 100-200)
base_price = 150  # Average base price for calculation (can adjust)
df['surge'] = np.where(df['price'] > base_price, 1, 0)

# Feature columns: hour, day_of_week
X = df[['hour', 'day_of_week']]

# Target column: surge (1 if surge, 0 if no surge)
y = df['surge']

# Split data into train and test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train the model
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

# Test the model
y_pred = model.predict(X_test_scaled)
print(f"Accuracy: {accuracy_score(y_test, y_pred)}")

# Save the model
import joblib
joblib.dump(model, 'surge_model.pkl')
joblib.dump(scaler, 'scaler.pkl')

print("[✅] Model trained and saved successfully!")
