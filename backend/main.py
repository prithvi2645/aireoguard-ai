from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import os

app = FastAPI()

# Trigger reload


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
model = None
try:
    current_dir = os.getcwd()
    model_path = os.path.join(current_dir, 'backend', 'model', 'rul_model.pkl')
    print(f"DIAGNOSTIC: Current working directory: {current_dir}")
    print(f"DIAGNOSTIC: Attempting to load model from: {model_path}")
    
    if os.path.exists(model_path):
        model = joblib.load(model_path)
        print("DIAGNOSTIC: Model loaded successfully into global variable.")
        print(f"DIAGNOSTIC: Model type: {type(model)}")
    else:
        print(f"DIAGNOSTIC: Warning: Model file not found at {model_path}")
except Exception as e:
    print(f"DIAGNOSTIC: Error loading model: {e}")
    import traceback
    traceback.print_exc()

class SensorData(BaseModel):
    setting_1: float
    setting_2: float
    setting_3: float
    s_1: float
    s_2: float
    s_3: float
    s_4: float
    s_5: float
    s_6: float
    s_7: float
    s_8: float
    s_9: float
    s_10: float
    s_11: float
    s_12: float
    s_13: float
    s_14: float
    s_15: float
    s_16: float
    s_17: float
    s_18: float
    s_19: float
    s_20: float
    s_21: float

@app.post("/predict")
async def predict(data: SensorData):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    # Convert input to DataFrame
    input_dict = data.model_dump()
    df = pd.DataFrame([input_dict])
    
    # Predict RUL
    rul_pred = model.predict(df)[0]
    
    # Calculate Health Score
    # Assuming max RUL is around 130-150 based on typical CMAPSS data for new engines (this is a simplification)
    # Ideally we'd know the initial life. Let's assume prediction > 130 is 100%, 0 is 0%.
    max_rul = 130.0
    health_score = (rul_pred / max_rul) * 100.0
    health_score = max(0, min(100, health_score)) # Clamp
    
    return {
        "predicted_rul": float(rul_pred),
        "health_score": float(health_score)
    }

# Serve static files (Frontend)
app.mount("/", StaticFiles(directory="backend/frontend", html=True), name="static")
