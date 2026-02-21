import os

BASE_DIR = os.path.dirname(__file__)

# 🔹 MySQL Connection (LOCAL)
from urllib.parse import quote_plus

DB_USER = "root"
DB_PASSWORD = quote_plus("Sandesh@599")   # handles @ symbol
DB_HOST = "localhost"
DB_PORT = "3306"
DB_NAME = "env_risk_ai"

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

MODEL_DIR = os.path.join(BASE_DIR, "models")
LOG_DIR = os.path.join(BASE_DIR, "logs")

os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(LOG_DIR, exist_ok=True)

RETRAIN_DAYS = 7