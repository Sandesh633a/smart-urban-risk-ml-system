# import pandas as pd
# from config import DATA_PATH, PROCESSED_PATH

# def create_features():

#     df = pd.read_csv(DATA_PATH)
#     df['date'] = pd.to_datetime(df['date'])
#     df = df.sort_values(['zone_id', 'date'])

#     lag_features = ['pm25','risk_score','violations_last_7_days']

#     for feature in lag_features:
#         for lag in [1,2,3]:
#             df[f'{feature}_lag{lag}'] = df.groupby('zone_id')[feature].shift(lag)

#     df['pm25_7day_avg'] = df.groupby('zone_id')['pm25'].transform(
#         lambda x: x.rolling(7).mean()
#     )

#     # Multi-horizon targets
#     for horizon in [1,3,7]:
#         df[f'pm25_t{horizon}'] = df.groupby('zone_id')['pm25'].shift(-horizon)
#         df[f'risk_t{horizon}'] = df.groupby('zone_id')['risk_score'].shift(-horizon)

#     df['high_risk_zone'] = (df['risk_score'] > 70).astype(int)

#     df = df.dropna()
#     df.to_csv(PROCESSED_PATH, index=False)

#     print("Feature engineering completed.")


















import pandas as pd
from sqlalchemy import create_engine
from config import DATABASE_URL

def create_features():

    engine = create_engine(DATABASE_URL)

    # 🔹 Read raw data from MySQL
    df = pd.read_sql("SELECT * FROM environmental_data", engine)

    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values(['zone_id', 'date'])

    lag_features = ['pm25','risk_score','violations_last_7_days']

    for feature in lag_features:
        for lag in [1,2,3]:
            df[f'{feature}_lag{lag}'] = df.groupby('zone_id')[feature].shift(lag)

    df['pm25_7day_avg'] = df.groupby('zone_id')['pm25'].transform(
        lambda x: x.rolling(7).mean()
    )

    for horizon in [1,3,7]:
        df[f'pm25_t{horizon}'] = df.groupby('zone_id')['pm25'].shift(-horizon)
        df[f'risk_t{horizon}'] = df.groupby('zone_id')['risk_score'].shift(-horizon)

    df['high_risk_zone'] = (df['risk_score'] > 70).astype(int)

    df = df.dropna()

    print("Feature engineering completed from MySQL.")

    return df