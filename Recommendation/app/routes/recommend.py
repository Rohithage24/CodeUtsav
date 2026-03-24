from fastapi import APIRouter
from app.services.recommender import get_recommendations

router = APIRouter()

@router.post("/recommend")
def recommend(data: dict):
    return get_recommendations(data)