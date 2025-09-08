from fastapi import APIRouter
from datetime import datetime
from models.schemas import HealthResponse, RootResponse
from config.settings import settings

router = APIRouter()

@router.get("/", response_model=RootResponse)
async def root():
    return RootResponse(
        message=f"{settings.APP_NAME} API v{settings.APP_VERSION}",
        status="healthy",
        authentication="Clerk",
        version=settings.APP_VERSION,
    )

@router.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        service="ai-nutrition-analyzer",
        timestamp=datetime.now().isoformat(),
    )
