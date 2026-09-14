"""
Real ML-based email classifier using TF-IDF + Logistic Regression.
Trains on startup from an embedded seed dataset and caches to disk.
This replaces keyword-only matching with an actual trained model.
"""
import os
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

MODEL_PATH = os.path.join(os.path.dirname(__file__), "phishing_model.joblib")

# Seed training data — phishing/BEC/legitimate examples.
# In production you'd expand this with a real labeled dataset (Kaggle phishing corpus etc.)
TRAINING_DATA = [
    ("Urgent: your account will be suspended, verify immediately by clicking here", "phishing"),
    ("Wire transfer required today, CEO needs this payment processed urgently confidential", "bec"),
    ("Your password has expired, reset now to avoid unauthorized login lockout", "phishing"),
    ("Invoice attached, payment overdue, please process immediately to avoid penalty", "bec"),
    ("Security alert: unusual sign-in activity detected, verify your identity now", "phishing"),
    ("Please review the attached quarterly report at your convenience", "legitimate"),
    ("Team meeting scheduled for Thursday 3pm, agenda attached", "legitimate"),
    ("Thanks for your email, I'll get back to you next week", "legitimate"),
    ("Confirm your bank details to receive the pending refund", "phishing"),
    ("You have won a prize, claim it now before it expires", "phishing"),
    ("Executive requesting gift cards purchased urgently for client, keep this confidential", "bec"),
    ("Lunch tomorrow? Let me know what time works", "legitimate"),
    ("Update your payment method or your subscription will be cancelled", "phishing"),
    ("Here is the project timeline we discussed in the call", "legitimate"),
    ("New vendor payment details attached, update the account before next transfer", "bec"),
    ("Your document has been shared with you, click to view", "phishing"),
    ("Reminder: submit your timesheet by Friday", "legitimate"),
    ("Immediate action required: your mailbox is full, verify to continue", "phishing"),
    ("Can you approve this wire transfer to the new supplier account today", "bec"),
    ("Happy to schedule a call whenever suits you best", "legitimate"),
]

_model = None


def _train_model():
    texts = [t for t, _ in TRAINING_DATA]
    labels = [l for _, l in TRAINING_DATA]
    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1, 2), min_df=1)),
        ("clf", LogisticRegression(max_iter=1000))
    ])
    pipeline.fit(texts, labels)
    joblib.dump(pipeline, MODEL_PATH)
    return pipeline


def get_model():
    global _model
    if _model is not None:
        return _model
    if os.path.exists(MODEL_PATH):
        _model = joblib.load(MODEL_PATH)
    else:
        _model = _train_model()
    return _model


def classify_email(subject: str, body: str):
    """Returns (predicted_label, confidence, all_class_probabilities)"""
    model = get_model()
    text = f"{subject} {body}"
    pred = model.predict([text])[0]
    proba = model.predict_proba([text])[0]
    classes = model.classes_
    prob_map = {cls: round(float(p) * 100, 1) for cls, p in zip(classes, proba)}
    confidence = round(float(max(proba)) * 100, 1)
    return pred, confidence, prob_map