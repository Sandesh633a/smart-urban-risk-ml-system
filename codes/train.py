# import pandas as pd
# import numpy as np
# import joblib
# import os
# import json
# from datetime import datetime, timedelta
# from sklearn.model_selection import TimeSeriesSplit
# from sklearn.ensemble import RandomForestClassifier
# from xgboost import XGBRegressor
# from sklearn.cluster import KMeans
# from config import *

# LAST_TRAIN_FILE = os.path.join(LOG_DIR, "last_train.txt")

# def should_retrain():
#     if not os.path.exists(LAST_TRAIN_FILE):
#         return True

#     with open(LAST_TRAIN_FILE, "r") as f:
#         last_date = datetime.strptime(f.read().strip(), "%Y-%m-%d")

#     return datetime.now() - last_date >= timedelta(days=RETRAIN_DAYS)

# def update_train_date():
#     with open(LAST_TRAIN_FILE, "w") as f:
#         f.write(datetime.now().strftime("%Y-%m-%d"))

# def train_models():

#     df = pd.read_csv(PROCESSED_PATH)
#     df = df.sort_values(['zone_id','date'])

#     features = [
#         'pm25_lag1','pm25_lag2','pm25_lag3',
#         'risk_score_lag1',
#         'violations_last_7_days_lag1',
#         'humidity','wind_speed',
#         'industrial_density'
#     ]

#     X = df[features]
#     tscv = TimeSeriesSplit(n_splits=5)

#     # =========================
#     # Multi-Horizon Forecast Models
#     # =========================
#     horizons = [1,3,7]

#     for h in horizons:

#         # PM model
#         y_pm = df[f'pm25_t{h}']
#         model_pm = XGBRegressor(
#             n_estimators=400,
#             learning_rate=0.03,
#             max_depth=6,
#             subsample=0.8,
#             colsample_bytree=0.8,
#             random_state=42
#         )

#         for train_idx, test_idx in tscv.split(X):
#             model_pm.fit(X.iloc[train_idx], y_pm.iloc[train_idx])

#         joblib.dump(model_pm, os.path.join(MODEL_DIR,f"pm25_t{h}.pkl"))

#         # Residual stats for anomaly detection (only for t1)
#         if h == 1:
#             y_true = y_pm.iloc[test_idx]
#             y_pred = model_pm.predict(X.iloc[test_idx])
#             residuals = y_true - y_pred

#             residual_stats = {
#                 "mean": float(residuals.mean()),
#                 "std": float(residuals.std())
#             }

#             with open(os.path.join(MODEL_DIR,"residual_stats.json"),"w") as f:
#                 json.dump(residual_stats, f)

#         # Risk model
#         y_risk = df[f'risk_t{h}']
#         model_risk = XGBRegressor(
#             n_estimators=400,
#             learning_rate=0.03,
#             max_depth=6,
#             random_state=42
#         )

#         model_risk.fit(X, y_risk)
#         joblib.dump(model_risk, os.path.join(MODEL_DIR,f"risk_t{h}.pkl"))

#     # =========================
#     # High Risk Classifier
#     # =========================
#     clf = RandomForestClassifier(n_estimators=300)
#     clf.fit(X, df['high_risk_zone'])
#     joblib.dump(clf, os.path.join(MODEL_DIR,"highrisk_model.pkl"))

#     # =========================
#     # Hotspot Clustering
#     # =========================
#     cluster_features = ['pm25','risk_score','violations_last_7_days','industrial_density']
#     kmeans = KMeans(n_clusters=3, random_state=42)
#     kmeans.fit(df[cluster_features])
#     joblib.dump(kmeans, os.path.join(MODEL_DIR,"hotspot_model.pkl"))

#     update_train_date()
#     print("All upgraded models trained and saved.")
























import numpy as np
import joblib
import os
import json
from datetime import datetime, timedelta
from sklearn.model_selection import TimeSeriesSplit
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBRegressor
from sklearn.cluster import KMeans
from config import *
from feature_engineering import create_features

LAST_TRAIN_FILE = os.path.join(LOG_DIR, "last_train.txt")

def should_retrain():
    if not os.path.exists(LAST_TRAIN_FILE):
        return True

    with open(LAST_TRAIN_FILE, "r") as f:
        last_date = datetime.strptime(f.read().strip(), "%Y-%m-%d")

    return datetime.now() - last_date >= timedelta(days=RETRAIN_DAYS)

def update_train_date():
    with open(LAST_TRAIN_FILE, "w") as f:
        f.write(datetime.now().strftime("%Y-%m-%d"))

def train_models():

    df = create_features()
    df = df.sort_values(['zone_id','date'])

    features = [
        'pm25_lag1','pm25_lag2','pm25_lag3',
        'risk_score_lag1',
        'violations_last_7_days_lag1',
        'humidity','wind_speed',
        'industrial_density'
    ]

    X = df[features]
    tscv = TimeSeriesSplit(n_splits=5)

    horizons = [1,3,7]

    for h in horizons:

        y_pm = df[f'pm25_t{h}']

        model_pm = XGBRegressor(
            n_estimators=400,
            learning_rate=0.03,
            max_depth=6,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42
        )

        for train_idx, test_idx in tscv.split(X):
            model_pm.fit(X.iloc[train_idx], y_pm.iloc[train_idx])

        joblib.dump(model_pm, os.path.join(MODEL_DIR,f"pm25_t{h}.pkl"))

        if h == 1:
            y_true = y_pm.iloc[test_idx]
            y_pred = model_pm.predict(X.iloc[test_idx])
            residuals = y_true - y_pred

            residual_stats = {
                "mean": float(residuals.mean()),
                "std": float(residuals.std())
            }

            with open(os.path.join(MODEL_DIR,"residual_stats.json"),"w") as f:
                json.dump(residual_stats, f)

        y_risk = df[f'risk_t{h}']

        model_risk = XGBRegressor(
            n_estimators=400,
            learning_rate=0.03,
            max_depth=6,
            random_state=42
        )

        model_risk.fit(X, y_risk)
        joblib.dump(model_risk, os.path.join(MODEL_DIR,f"risk_t{h}.pkl"))

    clf = RandomForestClassifier(n_estimators=300)
    clf.fit(X, df['high_risk_zone'])
    joblib.dump(clf, os.path.join(MODEL_DIR,"highrisk_model.pkl"))

    cluster_features = ['pm25','risk_score','violations_last_7_days','industrial_density']
    kmeans = KMeans(n_clusters=3, random_state=42)
    kmeans.fit(df[cluster_features])
    joblib.dump(kmeans, os.path.join(MODEL_DIR,"hotspot_model.pkl"))

    update_train_date()
    print("All upgraded models trained and saved from MySQL.")