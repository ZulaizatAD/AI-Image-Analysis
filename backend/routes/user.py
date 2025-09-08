from fastapi import APIRouter, Depends
from datetime import datetime
from models.schemas import UserInfo, UserProfile, AnalysisHistory
from services.auth import verify_clerk_token
from config.database import get_db_connection
from config.settings import settings

router = APIRouter(prefix="/user", tags=["user"])


@router.get("/profile", response_model=UserProfile)
async def get_user_profile(user: UserInfo = Depends(verify_clerk_token)):
    """Get user profile and usage statistics"""
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

    return UserProfile(
        user_id=user.user_id,
        email=user.email,
        is_admin=is_admin,
        daily_requests_used=daily_requests,
        daily_limit="Unlimited" if is_admin else settings.DAILY_LIMIT,
        remaining_requests="Unlimited"
        if is_admin
        else settings.DAILY_LIMIT - daily_requests,
        total_requests=total_requests,
        today_analyses=today_analyses,
        member_since=created_at,
    )


@router.get("/history")
async def get_analysis_history(user: UserInfo = Depends(verify_clerk_token)):
    """Get user's analysis history"""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id, analysis_result, created_at FROM analyses WHERE user_id = ? ORDER BY created_at DESC LIMIT 10",
        (user.user_id,),
    )
    results = cursor.fetchall()
    conn.close()

    history = [
        AnalysisHistory(
            id=row[0],
            preview=row[1][:200] + "..." if len(row[1]) > 200 else row[1],
            created_at=row[2],
        )
        for row in results
    ]

    return {"history": history}
