from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from datetime import datetime
from models.schemas import UserInfo, AnalysisResponse
from services.auth import verify_clerk_token
from services.rate_limiter import check_rate_limit
from services.ai_service import analyze_food_image
from utils.helpers import encode_image, validate_file_type, validate_file_size
from config.settings import settings

router = APIRouter(tags=["analysis"])


@router.post("/analyze-image", response_model=AnalysisResponse)
async def analyze_image(
    file: UploadFile = File(...), user: UserInfo = Depends(verify_clerk_token)
):
    """Analyze food image with rate limiting"""

    # Rate limiting check (admin bypass)
    allowed, remaining = check_rate_limit(user.user_id, user.email)
    if not allowed:
        raise HTTPException(
            status_code=429,
            detail=f"Daily limit of {settings.DAILY_LIMIT} requests exceeded. Please try again tomorrow.",
        )

    # File validation
    if not validate_file_type(file.content_type):
        raise HTTPException(
            status_code=400, detail="Invalid file type. Only JPEG and PNG are allowed."
        )

    if file.size and not validate_file_size(file.size):
        raise HTTPException(
            status_code=400, detail="File size too large. Maximum size is 10MB."
        )

    try:
        contents = await file.read()
        image_base64 = encode_image(contents)

        # Analyze image using AI service
        analysis_result, analysis_id = await analyze_food_image(
            image_base64, user.user_id
        )

        is_admin = user.user_id == settings.ADMIN_USER_ID

        return AnalysisResponse(
            analysis=analysis_result,
            remaining_requests="Unlimited" if is_admin else remaining,
            analysis_id=analysis_id,
            is_admin=is_admin,
            timestamp=datetime.now().isoformat(),
        )

    except Exception as e:
        print(f"Error analyzing image: {e}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing the image. Please try again.",
        )
