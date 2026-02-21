import pandas as pd
from sqlalchemy import create_engine
from urllib.parse import quote_plus

password = quote_plus("Sandesh@599")

engine = create_engine(
    f"mysql+pymysql://root:{password}@localhost/env_risk_ai"
)

df = pd.read_csv("data/dataset.csv")

# Let pandas auto-detect date format
df["date"] = pd.to_datetime(df["date"])

df.to_sql("environmental_data", engine, if_exists="replace", index=False)

print("Data successfully inserted into MySQL.")