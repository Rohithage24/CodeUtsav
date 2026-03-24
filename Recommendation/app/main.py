from fastapi import FastAPI
from app.routes.recommend import router as recommend_router
from app.routes.future_recommend import router as future_router

app = FastAPI(title="AI Book Recommendation System")

app.include_router(recommend_router)
app.include_router(future_router)