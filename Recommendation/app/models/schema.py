from pydantic import BaseModel

class EmotionRequest(BaseModel):
    emotion: str
    intent: str
    user_input: str

class GoalRequest(BaseModel):
    goal: str