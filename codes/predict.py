import pandas as pd
import joblib
from sqlalchemy import create_engine
import os

# ========================
# PATH SETUP
# ========================
BASE_DIR = os.path.dirname(__file__)
MODEL_DIR = os.path.join(BASE_DIR, "models")

# ========================
# DATABASE
# ========================
engine = create_engine(
    "mysql+pymysql://root:Sandesh%40599@localhost/delhi_env"
)

df = pd.read_sql("SELECT * FROM ml_features_daily ORDER BY date", engine)

latest = df.tail(1)

# ========================
# LOAD MODELS
# ========================
pollution_model = joblib.load(
    os.path.join(MODEL_DIR, "pollution_model.pkl")
)

risk_model = joblib.load(
    os.path.join(MODEL_DIR, "risk_model.pkl")
)

hotspot_model = joblib.load(
    os.path.join(MODEL_DIR, "hotspot_model.pkl")
)

# ========================
# FEATURES
# ========================
features_A = [
    'pm25','pm10','no2',
    'humidity','wind_speed',
    'rainfall_last_3_days',
    'violations_last_7_days',
    'industrial_density'
]

pm25_tomorrow = pollution_model.predict(latest[features_A])[0]

X_B = latest.drop(columns=['id','city_id','zone_id','date','risk_score'])

risk_score = risk_model.predict(X_B)[0]
hotspot = hotspot_model.predict(X_B)[0]

# ========================
# OUTPUT
# ========================
print({
    "tomorrow_pm25": round(pm25_tomorrow, 2),
    "risk_score": round(risk_score, 2),
    "hotspot_cluster": int(hotspot)
})
