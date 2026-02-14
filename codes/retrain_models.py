# from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
# import pandas as pd
# import joblib
# from sqlalchemy import create_engine
# from sklearn.ensemble import RandomForestRegressor
# from sklearn.cluster import KMeans
# from datetime import datetime
# import os

# # ========================
# # PATH SETUP
# # ========================
# BASE_DIR = os.path.dirname(__file__)
# MODEL_DIR = os.path.join(BASE_DIR, "models")
# LOG_DIR = os.path.join(BASE_DIR, "logs")

# os.makedirs(MODEL_DIR, exist_ok=True)
# os.makedirs(LOG_DIR, exist_ok=True)

# # ========================
# # DATABASE
# # ========================
# engine = create_engine(
#     "mysql+pymysql://root:Sandesh%40599@localhost/delhi_env"
# )

# df = pd.read_sql("SELECT * FROM ml_features_daily ORDER BY date", engine)

# # ========================
# # MODEL A — POLLUTION
# # ========================
# features_A = [
#     'pm25','pm10','no2',
#     'humidity','wind_speed',
#     'rainfall_last_3_days',
#     'violations_last_7_days',
#     'industrial_density'
# ]

# X_A = df[features_A]
# y_A = df['pm25'].shift(-1)

# X_A = X_A[:-1]
# y_A = y_A[:-1]

# pollution_model = RandomForestRegressor(
#     n_estimators=300,
#     max_depth=12,
#     min_samples_split=5,
#     random_state=42
# )

# pollution_model.fit(X_A, y_A)

# joblib.dump(
#     pollution_model,
#     os.path.join(MODEL_DIR, "pollution_model.pkl")
# )


# # ========================
# # MODEL B — RISK SCORE
# # ========================
# X_B = df.drop(columns=['id','city_id','zone_id','date','risk_score'])
# y_B = df['risk_score']

# risk_model = RandomForestRegressor(
#     n_estimators=300,
#     random_state=42
# )

# risk_model.fit(X_B, y_B)

# joblib.dump(
#     risk_model,
#     os.path.join(MODEL_DIR, "risk_model.pkl")
# )


# # ========================
# # MODEL C — HOTSPOTS
# # ========================
# hotspot_model = KMeans(n_clusters=3, random_state=42)
# hotspot_model.fit(X_B)

# joblib.dump(
#     hotspot_model,
#     os.path.join(MODEL_DIR, "hotspot_model.pkl")
# )


# # ========================
# # LOG
# # ========================
# with open(os.path.join(LOG_DIR, "train_log.txt"), "a") as f:
#     f.write(f"Retrained at {datetime.now()}\n")

# print(" All models retrained and saved successfully")














import pandas as pd
import joblib
from sqlalchemy import create_engine
from sklearn.ensemble import RandomForestRegressor
from sklearn.cluster import KMeans
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from datetime import datetime
import os

# ========================
# PATH SETUP
# ========================
BASE_DIR = os.path.dirname(__file__)
MODEL_DIR = os.path.join(BASE_DIR, "models")
LOG_DIR = os.path.join(BASE_DIR, "logs")

os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(LOG_DIR, exist_ok=True)

# ========================
# DATABASE
# ========================
engine = create_engine(
    "mysql+pymysql://root:Sandesh%40599@localhost/delhi_env"
)

df = pd.read_sql("SELECT * FROM ml_features_daily ORDER BY date", engine)

# ========================
# MODEL A — POLLUTION
# ========================
features_A = [
    'pm25','pm10','no2',
    'humidity','wind_speed',
    'rainfall_last_3_days',
    'violations_last_7_days',
    'industrial_density'
]

X_A = df[features_A]
y_A = df['pm25'].shift(-1)

X_A = X_A[:-1]
y_A = y_A[:-1]

pollution_model = RandomForestRegressor(
    n_estimators=300,
    max_depth=12,
    min_samples_split=5,
    random_state=42
)

pollution_model.fit(X_A, y_A)

pred_A = pollution_model.predict(X_A)

rmse_A = mean_squared_error(y_A, pred_A) ** 0.5

mae_A = mean_absolute_error(y_A, pred_A)
r2_A = r2_score(y_A, pred_A)

joblib.dump(
    pollution_model,
    os.path.join(MODEL_DIR, "pollution_model.pkl")
)

# ========================
# MODEL B — RISK SCORE
# ========================
X_B = df.drop(columns=['id','city_id','zone_id','date','risk_score'])
y_B = df['risk_score']

risk_model = RandomForestRegressor(
    n_estimators=300,
    random_state=42
)

risk_model.fit(X_B, y_B)

pred_B = risk_model.predict(X_B)

rmse_B = mean_squared_error(y_B, pred_B) ** 0.5

mae_B = mean_absolute_error(y_B, pred_B)
r2_B = r2_score(y_B, pred_B)

joblib.dump(
    risk_model,
    os.path.join(MODEL_DIR, "risk_model.pkl")
)

# ========================
# MODEL C — HOTSPOTS
# ========================
hotspot_model = KMeans(n_clusters=3, random_state=42)
hotspot_model.fit(X_B)

joblib.dump(
    hotspot_model,
    os.path.join(MODEL_DIR, "hotspot_model.pkl")
)

# ========================
# SAVE METRICS TO SQL
# ========================
conn = engine.raw_connection()
cursor = conn.cursor()

cursor.execute("""
INSERT INTO model_metrics (model_name, rmse, mae, r2, trained_at)
VALUES (%s,%s,%s,%s,%s)
""", ("pollution_model", rmse_A, mae_A, r2_A, datetime.now()))

cursor.execute("""
INSERT INTO model_metrics (model_name, rmse, mae, r2, trained_at)
VALUES (%s,%s,%s,%s,%s)
""", ("risk_model", rmse_B, mae_B, r2_B, datetime.now()))

conn.commit()
cursor.close()
conn.close()

# ========================
# LOG
# ========================
with open(os.path.join(LOG_DIR, "train_log.txt"), "a") as f:
    f.write(f"Retrained at {datetime.now()} | RMSE_Pollution={rmse_A:.2f} | RMSE_Risk={rmse_B:.2f}\n")

print("All models retrained, evaluated, and metrics saved")
