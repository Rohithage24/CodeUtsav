import pandas as pd
import joblib

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.preprocessing import LabelEncoder

# 🔥 Real-world dataset
data = {
    "text": [

        # STRESS
        "I am stressed about exams",
        "bro I can't focus exams are killing me",
        "too much pressure from studies",
        "I feel overwhelmed with work",
        "my mind is not working before exam",

        # JOY
        "I feel amazing today",
        "this is the best day ever",
        "I'm so happy right now",
        "life feels great",
        "feeling awesome",

        # SADNESS
        "I feel really low today",
        "nothing feels right",
        "I'm feeling empty and sad",
        "I feel alone",
        "life is depressing",

        # ANGER
        "this makes me so angry",
        "I'm really frustrated right now",
        "I feel irritated",
        "why is everything so annoying",

        # FEAR
        "I'm scared about my future",
        "feeling anxious about interview",
        "I am nervous",
        "what if I fail",

        # CONFUSION
        "I don't understand anything",
        "I'm totally confused",
        "what is going on",
        "I'm lost",

        # BOREDOM
        "this is so boring",
        "I feel bored",
        "nothing interesting happening",
        "I'm just wasting time"
    ],

    "emotion": [
        "stress","stress","stress","stress","stress",
        "joy","joy","joy","joy","joy",
        "sadness","sadness","sadness","sadness","sadness",
        "anger","anger","anger","anger",
        "fear","fear","fear","fear",
        "confusion","confusion","confusion","confusion",
        "boredom","boredom","boredom","boredom"
    ]
}

df = pd.DataFrame(data)

# Encode labels
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(df['emotion'])

# 🔥 Improved vectorizer
vectorizer = TfidfVectorizer(
    ngram_range=(1,2),
    max_features=7000,
    sublinear_tf=True
)

X = vectorizer.fit_transform(df['text'])

# 🔥 Better for text
model = MultinomialNB()
model.fit(X, y)

# Save model
joblib.dump(model, "model/saved_model.pkl")
joblib.dump(vectorizer, "model/vectorizer.pkl")
joblib.dump(label_encoder, "utils/label_encoder.pkl")

print("✅ Model trained with real-world data!")