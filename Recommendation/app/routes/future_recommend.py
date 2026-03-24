from fastapi import APIRouter
from app.services.future_recommender import get_future_recommendations

router = APIRouter()

@router.post("/future-recommend")
def future_recommend(data: dict):
    return get_future_recommendations(data)