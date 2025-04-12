import csv
import random
from datetime import datetime, timedelta

filename = "mock_data.csv"

# Time definitions
WEEKDAYS = list(range(0, 5))  # Monday to Friday
WEEKENDS = [5, 6]  # Saturday, Sunday

# Start date and time
start_time = datetime(2025, 4, 1, 0, 0, 0)
total_minutes = 7 * 24 * 60  # 1 week worth of data (1-minute intervals)

data = []

for i in range(total_minutes):
    current_time = start_time + timedelta(minutes=i)
    hour = current_time.hour
    day = current_time.weekday()

    # Random base price (between 100-200)
    base_price = random.randint(100, 200)
    surge = 1.0

    # Surge rules based on time of the day and day of the week
    if day in WEEKDAYS and (8 <= hour <= 10 or 18 <= hour <= 21):  # Weekday rush hours (8-10 AM, 6-9 PM)
        surge = random.uniform(1.5, 2.5)
    elif day in WEEKENDS and (9 <= hour <= 11):  # Weekend mornings (9-11 AM)
        surge = random.uniform(1.4, 2.0)
    elif 23 <= hour <= 23 or hour == 0:  # Late night/early morning (11 PM - 1 AM)
        surge = random.uniform(1.3, 1.9)
    elif random.random() < 0.05:  # 5% chance of rain/special surge
        surge = random.uniform(1.2, 1.8)

    # Calculate price with surge
    price = int(base_price * surge)
    data.append([current_time, price])

# Save the data to a CSV file
with open(filename, mode='w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['timestamp', 'price'])
    writer.writerows(data)

print(f"[✅] Data generated successfully and saved in {filename}")
