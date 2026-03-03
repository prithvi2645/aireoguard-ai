import pandas as pd
import numpy as np
from xgboost import XGBRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os

# Column names for the dataset
index_names = ['unit_nr', 'time_cycles']
setting_names = ['setting_1', 'setting_2', 'setting_3']
sensor_names = ['s_{}'.format(i) for i in range(1, 22)] 
col_names = index_names + setting_names + sensor_names

def prepare_data(df):
    # Calculate RUL (Remaining Useful Life)
    # RUL = Max Cycle of that unit - Current Cycle
    
    # Group by unit_nr to get max cycles per unit
    max_cycle = df.groupby('unit_nr')['time_cycles'].max().reset_index()
    max_cycle.columns = ['unit_nr', 'max_cycle']
    
    # Merge back
    df = df.merge(max_cycle, on='unit_nr', how='left')
    
    # Calculate RUL
    df['RUL'] = df['max_cycle'] - df['time_cycles']
    
    # Drop max_cycle as it's not a feature
    df = df.drop(columns=['max_cycle'])
    
    return df

def train():
    print("Loading data...")
    # Load training data (using FD001 as the example subset)
    train_path = 'data/train_FD001.txt'
    if not os.path.exists(train_path):
        print(f"Error: {train_path} not found.")
        return

    train_df = pd.read_csv(train_path, sep=r'\s+', header=None, names=col_names)
    train_df = prepare_data(train_df)
    
    # Features to use (exclude unit_nr, time_cycles for simple model, keep sensors)
    # Actually time_cycles is important context, but RUL is directly correlated.
    # We want to predict RUL based on sensor readings and current cycle.
    features = setting_names + sensor_names
    target = 'RUL'
    
    X_train = train_df[features]
    y_train = train_df[target]
    
    print(f"Training XGBoost Regressor on {len(X_train)} samples...")
    model = XGBRegressor(n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate (simple in-sample check, real eval should use test set)
    predictions = model.predict(X_train)
    mse = mean_squared_error(y_train, predictions)
    r2 = r2_score(y_train, predictions)
    
    print(f"Training R2: {r2:.4f}")
    print(f"Training RMSE: {np.sqrt(mse):.4f}")
    
    # Save model
    if not os.path.exists('backend/model'):
        os.makedirs('backend/model')
        
    joblib.dump(model, 'backend/model/rul_model.pkl')
    print("Model saved to backend/model/rul_model.pkl")

if __name__ == "__main__":
    train()
