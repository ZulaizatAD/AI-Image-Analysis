from fastapi import APIRouter, Depends
from datetime import datetime
from models.schemas import UserInfo, UserProfile
from services.auth import verify_clerk_token
from config.database import get_db_connection
from config.settings import settings

router = APIRouter(prefix="/user", tags=["user"])

@router.get("/profile", response_model=UserProfile)
async def get_user_profile(user: UserInfo = Depends(verify_clerk_token)):
    """Get user profile and usage statistics"""
    print(f"DEBUG: Getting profile for user: {user.user_id}")
    print(f"DEBUG: Admin user ID: {settings.ADMIN_USER_ID}")
    print(f"DEBUG: Is admin: {user.user_id == settings.ADMIN_USER_ID}")
    
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT daily_requests, last_request_date, total_requests, created_at FROM user_usage WHERE user_id = ?",
        (user.user_id,),
    )
    result = cursor.fetchone()

    if result:
        daily_requests, last_request_date, total_requests, created_at = result
        today = datetime.now().date()
        if last_request_date != str(today):
            daily_requests = 0
    else:
        daily_requests = 0
        total_requests = 0
        created_at = datetime.now().isoformat()

    # Get recent analyses count
    cursor.execute(
        "SELECT COUNT(*) FROM analyses WHERE user_id = ? AND DATE(created_at) = DATE('now')",
        (user.user_id,),
    )
    today_analyses = cursor.fetchone()[0]

    conn.close()

    is_admin = user.user_id == settings.ADMIN_USER_ID
    print(f"DEBUG: Final is_admin value: {is_admin}")

    return UserProfile(
        user_id=user.user_id,
        email=user.email,
        is_admin=is_admin,
        daily_requests_used=daily_requests,
        daily_limit="Unlimited" if is_admin else settings.DAILY_LIMIT,
        remaining_requests="Unlimited" if is_admin else settings.DAILY_LIMIT - daily_requests,
        total_requests=total_requests,
        today_analyses=today_analyses,
        member_since=created_at,
    )