from pydantic import BaseModel
from typing import Optional, List, Union

class UserInfo(BaseModel):
    user_id: str
    email: str

class UserProfile(BaseModel):
    user_id: str
    email: str
    is_admin: bool
    daily_requests_used: int
    daily_limit: Union[str, int]
    remaining_requests: Union[str, int]
    total_requests: int
    today_analyses: int
    member_since: str

class AnalysisHistory(BaseModel):
    id: str
    preview: str
    created_at: str

class AnalysisResponse(BaseModel):
    analysis: str
    remaining_requests: Union[str, int]
    analysis_id: str
    is_admin: bool
    timestamp: str

class AdminStats(BaseModel):
    total_users: int
    total_analyses: int
    today_analyses: int
    top_users: List[dict]

class HealthResponse(BaseModel):
    status: str
    service: str
    timestamp: str

class RootResponse(BaseModel):
    message: str
    status: str
    authentication: str
    version: str