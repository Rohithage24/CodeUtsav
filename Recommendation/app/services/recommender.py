import json
from sklearn.metrics.pairwise import cosine_similarity
from app.utils.embeddings import generate_embeddings

with open("app/data/books.json") as f:
    books = json.load(f)

# Combine multiple features
book_texts = [
    book["description"] + " " +
    " ".join(book.get("genre", [])) + " " +
    " ".join(book.get("emotion_tags", [])) + " " +
    " ".join(book.get("intent_tags", []))
    for book in books
]

book_embeddings = generate_embeddings(book_texts)


def get_recommendations(data):
    emotion = data.get("emotion")
    intent = data.get("intent")
    user_input = data.get("user_input", "")

    query = f"{emotion} {intent} {user_input}"
    query_embedding = generate_embeddings([query])

    scores = cosine_similarity(query_embedding, book_embeddings)[0]

    ranked = sorted(zip(books, scores), key=lambda x: x[1], reverse=True)

    return [
        {
            "title": book["title"],
            "reason": f"Matches your mood '{emotion}' and goal '{intent}'",
            "score": round(float(score), 2),
            "reviews": book.get("reviews", [])[:2]
        }
        for book, score in ranked[:3]
    ]