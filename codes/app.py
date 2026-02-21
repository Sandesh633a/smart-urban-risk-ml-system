# from fastapi import FastAPI
# import pandas as pd
# import joblib
# import shap
# import json
# import numpy as np
# import os
# from config import *
# from train import train_models, should_retrain
# from feature_engineering import create_features

# app = FastAPI()

# @app.on_event("startup")
# def startup_event():
#     create_features()
#     if should_retrain():
#         train_models()

# @app.get("/")
# def root():
#     return {"message": "Smart City Environmental Risk AI Running"}

# # =========================
# # Multi-Day Prediction
# # =========================
# @app.get("/predict")
# def predict():

#     df = pd.read_csv(PROCESSED_PATH)
#     df = df.sort_values(['zone_id','date'])
#     latest = df.groupby('zone_id').tail(1)

#     features = [
#         'pm25_lag1','pm25_lag2','pm25_lag3',
#         'risk_score_lag1',
#         'violations_last_7_days_lag1',
#         'humidity','wind_speed',
#         'industrial_density'
#     ]

#     X = latest[features]

#     result = []

#     for horizon in [1,3,7]:

#         model_pm = joblib.load(os.path.join(MODEL_DIR,f"pm25_t{horizon}.pkl"))
#         model_risk = joblib.load(os.path.join(MODEL_DIR,f"risk_t{horizon}.pkl"))

#         pm_pred = model_pm.predict(X)
#         risk_pred = model_risk.predict(X)

#         for i, zone in enumerate(latest['zone_id']):
#             result.append({
#                 "zone_id": zone,
#                 "horizon_days": horizon,
#                 "pm25_prediction": float(pm_pred[i]),
#                 "risk_prediction": float(risk_pred[i])
#             })

#     return result

# # =========================
# # Residual Anomaly Detection
# # =========================
# @app.get("/residual-anomaly")
# def residual_anomaly():

#     df = pd.read_csv(PROCESSED_PATH)
#     df = df.sort_values(['zone_id','date'])
#     latest = df.groupby('zone_id').tail(1)

#     features = [
#         'pm25_lag1','pm25_lag2','pm25_lag3',
#         'risk_score_lag1',
#         'violations_last_7_days_lag1',
#         'humidity','wind_speed',
#         'industrial_density'
#     ]

#     X = latest[features]

#     model_pm = joblib.load(os.path.join(MODEL_DIR,"pm25_t1.pkl"))

#     expected_pm = model_pm.predict(X)
#     actual_pm = latest['pm25'].values
#     residuals = actual_pm - expected_pm

#     with open(os.path.join(MODEL_DIR,"residual_stats.json"),"r") as f:
#         stats = json.load(f)

#     threshold = 3 * stats["std"]
#     anomaly_flag = (np.abs(residuals) > threshold).astype(int)

#     output = []

#     for i, zone in enumerate(latest['zone_id']):
#         output.append({
#             "zone_id": zone,
#             "expected_pm25": float(expected_pm[i]),
#             "actual_pm25": float(actual_pm[i]),
#             "residual": float(residuals[i]),
#             "anomaly_flag": int(anomaly_flag[i])
#         })

#     return output

# # =========================
# # Risk Decomposition (SHAP)
# # =========================
# @app.get("/risk-explain")
# def risk_explain():

#     df = pd.read_csv(PROCESSED_PATH)
#     df = df.sort_values(['zone_id', 'date'])
#     latest = df.groupby('zone_id').tail(1)

#     features = [
#         'pm25_lag1','pm25_lag2','pm25_lag3',
#         'risk_score_lag1',
#         'violations_last_7_days_lag1',
#         'humidity','wind_speed',
#         'industrial_density'
#     ]

#     X = latest[features]

#     model = joblib.load(os.path.join(MODEL_DIR, "risk_t1.pkl"))

#     # ✅ SAFE SHAP (works with XGBoost without version errors)
#     explainer = shap.Explainer(model.predict, X)
#     shap_values = explainer(X)

#     explanation = []

#     for i, zone in enumerate(latest['zone_id']):
#         contributions = dict(
#             zip(features, shap_values.values[i].tolist())
#         )

#         explanation.append({
#             "zone_id": zone,
#             "risk_feature_contributions": contributions
#         })

#     return explanation




































# from fastapi import FastAPI, Header, HTTPException
# import joblib
# import shap
# import json
# import numpy as np
# import os
# import threading
# import time
# from datetime import datetime
# from config import *
# from train import train_models, should_retrain
# from feature_engineering import create_features

# app = FastAPI()

# training_status = {
#     "training_status": "idle",
#     "started_at": None,
#     "completed_at": None,
#     "last_success": None,
#     "error": None
# }

# def run_training():
#     global training_status
#     try:
#         training_status["training_status"] = "running"
#         training_status["started_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
#         training_status["error"] = None

#         train_models()

#         training_status["training_status"] = "idle"
#         training_status["completed_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
#         training_status["last_success"] = training_status["completed_at"]

#     except Exception as e:
#         training_status["training_status"] = "failed"
#         training_status["error"] = str(e)
#         training_status["completed_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")




# def background_retrain_checker():
#     while True:
#         if should_retrain():
#             run_training()
#         time.sleep(60 * 60 * 24)





# @app.on_event("startup")
# def startup_event():
#     if should_retrain():
#         run_training()
#     thread = threading.Thread(target=background_retrain_checker)
#     thread.daemon = True
#     thread.start()





# @app.get("/")
# def root():
#     return {"message": "Smart City Environmental Risk AI Running (MySQL Version)"}






# @app.post("/retrain")
# def manual_retrain(x_api_key: str = Header(None)):
#     if x_api_key != "SUPER_SECRET_KEY":
#         raise HTTPException(status_code=403, detail="Unauthorized")
#     thread = threading.Thread(target=run_training)
#     thread.start()
#     return {"message": "Retraining started"}





# @app.get("/retrain-status")
# def get_retrain_status():
#     return training_status






# @app.get("/predict")
# def predict():

#     df = create_features()
#     latest = df.groupby('zone_id').tail(1)

#     features = [
#         'pm25_lag1','pm25_lag2','pm25_lag3',
#         'risk_score_lag1',
#         'violations_last_7_days_lag1',
#         'humidity','wind_speed',
#         'industrial_density'
#     ]

#     X = latest[features]

#     result = []

#     for horizon in [1,3,7]:
#         model_pm = joblib.load(os.path.join(MODEL_DIR,f"pm25_t{horizon}.pkl"))
#         model_risk = joblib.load(os.path.join(MODEL_DIR,f"risk_t{horizon}.pkl"))

#         pm_pred = model_pm.predict(X)
#         risk_pred = model_risk.predict(X)

#         for i, zone in enumerate(latest['zone_id']):
#             result.append({
#                 "zone_id": zone,
#                 "horizon_days": horizon,
#                 "pm25_prediction": float(pm_pred[i]),
#                 "risk_prediction": float(risk_pred[i])
#             })

#     return result







































from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
import shap
import json
import numpy as np
import os
import threading
import time
from datetime import datetime
from config import *
from train import train_models, should_retrain
from feature_engineering import create_features

app = FastAPI()

# =====================================================
# CORS (Allow frontend connection)
# =====================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For hackathon demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# GLOBAL TRAINING STATUS
# =====================================================
training_status = {
    "training_status": "idle",
    "started_at": None,
    "completed_at": None,
    "last_success": None,
    "error": None
}

# =====================================================
# TRAINING WRAPPER
# =====================================================
def run_training():
    global training_status
    try:
        training_status["training_status"] = "running"
        training_status["started_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        training_status["error"] = None

        train_models()

        training_status["training_status"] = "idle"
        training_status["completed_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        training_status["last_success"] = training_status["completed_at"]

    except Exception as e:
        training_status["training_status"] = "failed"
        training_status["error"] = str(e)
        training_status["completed_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# =====================================================
# WEEKLY BACKGROUND RETRAIN
# =====================================================
def background_retrain_checker():
    while True:
        if should_retrain():
            run_training()
        time.sleep(60 * 60 * 24)

# =====================================================
# STARTUP EVENT
# =====================================================
@app.on_event("startup")
def startup_event():
    if should_retrain():
        run_training()

    thread = threading.Thread(target=background_retrain_checker)
    thread.daemon = True
    thread.start()

# =====================================================
# ROOT
# =====================================================
@app.get("/")
def root():
    return {"message": "Smart City Environmental Risk AI Running (MySQL Version)"}

# =====================================================
# MANUAL RETRAIN
# =====================================================
@app.post("/retrain")
def manual_retrain(x_api_key: str = Header(None)):
    if x_api_key != "SUPER_SECRET_KEY":
        raise HTTPException(status_code=403, detail="Unauthorized")

    thread = threading.Thread(target=run_training)
    thread.start()

    return {
        "message": "Retraining started",
        "started_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

# =====================================================
# RETRAIN STATUS
# =====================================================
@app.get("/retrain-status")
def get_retrain_status():
    return training_status

# =====================================================
# MULTI-DAY PREDICTION
# =====================================================
@app.get("/predict")
def predict():

    df = create_features()
    latest = df.groupby('zone_id').tail(1)

    features = [
        'pm25_lag1','pm25_lag2','pm25_lag3',
        'risk_score_lag1',
        'violations_last_7_days_lag1',
        'humidity','wind_speed',
        'industrial_density'
    ]

    X = latest[features]

    result = []

    for horizon in [1,3,7]:

        model_pm = joblib.load(os.path.join(MODEL_DIR,f"pm25_t{horizon}.pkl"))
        model_risk = joblib.load(os.path.join(MODEL_DIR,f"risk_t{horizon}.pkl"))

        pm_pred = model_pm.predict(X)
        risk_pred = model_risk.predict(X)

        for i, zone in enumerate(latest['zone_id']):
            result.append({
                "zone_id": zone,
                "horizon_days": horizon,
                "pm25_prediction": float(pm_pred[i]),
                "risk_prediction": float(risk_pred[i])
            })

    return result

# =====================================================
# RESIDUAL ANOMALY DETECTION
# =====================================================
@app.get("/residual-anomaly")
def residual_anomaly():

    df = create_features()
    latest = df.groupby('zone_id').tail(1)

    features = [
        'pm25_lag1','pm25_lag2','pm25_lag3',
        'risk_score_lag1',
        'violations_last_7_days_lag1',
        'humidity','wind_speed',
        'industrial_density'
    ]

    X = latest[features]

    model_pm = joblib.load(os.path.join(MODEL_DIR,"pm25_t1.pkl"))

    expected_pm = model_pm.predict(X)
    actual_pm = latest['pm25'].values
    residuals = actual_pm - expected_pm

    with open(os.path.join(MODEL_DIR,"residual_stats.json"),"r") as f:
        stats = json.load(f)

    threshold = 3 * stats["std"]
    anomaly_flag = (np.abs(residuals) > threshold).astype(int)

    output = []

    for i, zone in enumerate(latest['zone_id']):
        output.append({
            "zone_id": zone,
            "expected_pm25": float(expected_pm[i]),
            "actual_pm25": float(actual_pm[i]),
            "residual": float(residuals[i]),
            "anomaly_flag": int(anomaly_flag[i])
        })

    return output

# =====================================================
# RISK EXPLANATION (SHAP)
# =====================================================
@app.get("/risk-explain")
def risk_explain():

    df = create_features()
    latest = df.groupby('zone_id').tail(1)

    features = [
        'pm25_lag1','pm25_lag2','pm25_lag3',
        'risk_score_lag1',
        'violations_last_7_days_lag1',
        'humidity','wind_speed',
        'industrial_density'
    ]

    X = latest[features]

    model = joblib.load(os.path.join(MODEL_DIR,"risk_t1.pkl"))

    explainer = shap.Explainer(model.predict, X)
    shap_values = explainer(X)

    explanation = []

    for i, zone in enumerate(latest['zone_id']):
        contributions = dict(
            zip(features, shap_values.values[i].tolist())
        )

        explanation.append({
            "zone_id": zone,
            "risk_feature_contributions": contributions
        })

    return explanation