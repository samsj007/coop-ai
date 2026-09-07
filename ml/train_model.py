import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import joblib

np.random.seed(42)
n = 4000

seats = np.random.randint(800, 2201, n)
applications = (seats * np.random.uniform(1.1, 2.2, n)).round().astype(int)
applications = np.clip(applications, 1000, 3000)

placements_pct = np.clip(np.random.normal(78, 8, n), 55, 98).round(1)
ad_budget = np.random.uniform(80000, 800000, n).round().astype(int)
courses = np.random.randint(5, 13, n)
annual_fees = np.random.uniform(75000, 250000, n).round().astype(int)
last_year_admissions = (seats * np.random.uniform(0.65, 0.95, n)).round().astype(int)

# Build a realistic admission ratio driven by the features, capped by seats
admission_ratio = (
    0.55
    + 0.15 * (placements_pct / 100)
    + 0.10 * (ad_budget / 800000)
    + 0.05 * (courses / 12)
    + 0.07 * np.clip(applications / seats, None, 2) / 2
    + np.random.normal(0, 0.05, n)
)
admission_ratio = np.clip(admission_ratio, 0.4, 0.98)

admissions = (seats * admission_ratio).round().astype(int)
admissions = np.minimum(admissions, seats)  # hard real-world constraint

df = pd.DataFrame({
    "applications": applications,
    "seats": seats,
    "placements_pct": placements_pct,
    "ad_budget": ad_budget,
    "courses": courses,
    "annual_fees": annual_fees,
    "last_year_admissions": last_year_admissions,
    "admissions": admissions
})

df.to_csv("../data/admissions_data.csv", index=False)
print(df.head(10))
print(f"\nTotal rows: {len(df)}")

X = df.drop("admissions", axis=1)
y = df["admissions"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)

score = model.score(X_test, y_test)
print(f"\nModel R² score: {score:.3f}")

joblib.dump(model, "../models/predictor.pkl")
print("Model saved to models/predictor.pkl")