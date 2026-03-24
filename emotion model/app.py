from fastapi import FastAPI
import joblib
import os

from utils.clean_text import clean_text

app = FastAPI(title="Emotion + Intent API (Advanced)")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load models
model = joblib.load(os.path.join(BASE_DIR, "model", "saved_model.pkl"))
vectorizer = joblib.load(os.path.join(BASE_DIR, "model", "vectorizer.pkl"))
label_encoder = joblib.load(os.path.join(BASE_DIR, "utils", "label_encoder.pkl"))

# 🎯 Intent detection
def detect_intent(text):
    text = text.lower()

    if any(word in text for word in ["exam", "study", "school", "college"]):
        return "education"
    elif any(word in text for word in ["job", "career", "work", "interview"]):
        return "career"
    elif any(word in text for word in ["love", "relationship", "friend"]):
        return "relationship"
    else:
        return "general"


@app.post("/analyze")
def analyze(data: dict):
    user_input = data.get("text")

    if not user_input:
        return {"error": "No input provided"}

    # Clean input
    cleaned = clean_text(user_input)
    vector = vectorizer.transform([cleaned])

    # ML prediction
    prediction = model.predict(vector)
    emotion = label_encoder.inverse_transform(prediction)[0]

    # 🔥 HYBRID RULE BOOST (handles messy input)
    text_lower = user_input.lower()

    if any(word in text_lower for word in ["exam", "pressure", "overwhelmed", "can't focus"]):
        emotion = "stress"

    elif any(word in text_lower for word in ["happy", "awesome", "great", "best day"]):
        emotion = "joy"

    elif any(word in text_lower for word in ["sad", "empty", "alone", "depressed"]):
        emotion = "sadness"

    elif any(word in text_lower for word in ["angry", "frustrated", "annoying"]):
        emotion = "anger"

    elif any(word in text_lower for word in ["scared", "nervous", "anxious"]):
        emotion = "fear"

    elif any(word in text_lower for word in ["confused", "lost"]):
        emotion = "confusion"

    elif any(word in text_lower for word in ["bored", "boring"]):
        emotion = "boredom"

    # Intent
    intent = detect_intent(user_input)

    return {
        "emotion": emotion,
        "intent": intent,
        "user_input": user_input
    }


@app.get("/")
def home():
    return {"message": "Advanced Emotion API is running 🚀"}