from fastapi import APIRouter, HTTPException, Depends
from models.schemas import UserInfo, AdminStats
from services.auth import verify_clerk_token
from config.database import get_db_connection
from config.settings import settings

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/stats", response_model=AdminStats)
async def get_admin_stats(user: UserInfo = Depends(verify_clerk_token)):
    """Admin-only route to get usage statistics"""
    if user.user_id != settings.ADMIN_USER_ID:
        raise HTTPException(status_code=403, detail="Admin access required")

    conn = get_db_connection()
    cursor = conn.cursor()

    # Get total users
    cursor.execute("SELECT COUNT(*) FROM user_usage")
    total_users = cursor.fetchone()[0]

    # Get total analyses
    cursor.execute("SELECT COUNT(*) FROM analyses")
    total_analyses = cursor.fetchone()[0]

    # Get today's analyses
    cursor.execute("SELECT COUNT(*) FROM analyses WHERE DATE(created_at) = DATE('now')")
    today_analyses = cursor.fetchone()[0]

    # Get top users
    cursor.execute("""
        SELECT email, total_requests 
        FROM user_usage 
        ORDER BY total_requests DESC 
        LIMIT 5
    """)
    top_users = cursor.fetchall()

    conn.close()

    return AdminStats(
        total_users=total_users,
        total_analyses=total_analyses,
        today_analyses=today_analyses,
        top_users=[{"email": user[0], "requests": user[1]} for user in top_users],
    )
