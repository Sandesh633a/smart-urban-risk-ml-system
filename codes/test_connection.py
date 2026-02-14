import pandas as pd
from sqlalchemy import create_engine

engine = create_engine(
    "mysql+pymysql://root:Sandesh%40599@localhost/delhi_env"
)

df = pd.read_sql("SELECT * FROM ml_features_daily LIMIT 5", engine)

print(df)
