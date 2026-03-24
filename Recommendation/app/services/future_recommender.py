import json

with open("app/data/goals_books.json") as f:
    goals_data = json.load(f)


def normalize_goal(text):
    text = text.lower()

    if "ias" in text or "civil" in text:
        return "ias"
    elif "startup" in text or "business" in text:
        return "entrepreneur"
    else:
        return "general"


def get_future_recommendations(data):
    goal = data.get("goal", "")

    key = normalize_goal(goal)
    books = goals_data.get(key, [])

    return [
        {
            "title": book["title"],
            "reason": f"Helps you become a {key}"
        }
        for book in books[:3]
    ]