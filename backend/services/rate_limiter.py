from datetime import datetime
from config.database import get_db_connection
from config.settings import settings

def check_rate_limit(user_id: str, email: str) -> tuple[bool, int]:
    """Check if user has exceeded daily rate limit"""
    # Admin has unlimited access
    if user_id == settings.ADMIN_USER_ID:
        return True, 999

    conn = get_db_connection()
    cursor = conn.cursor()

    today = datetime.now().date()

    # Get or create user usage record
    cursor.execute(
        "SELECT daily_requests, last_request_date FROM user_usage WHERE user_id = ?",
        (user_id,),
    )
    result = cursor.fetchone()

    if not result:
        # Create new user record
        cursor.execute(
            "INSERT INTO user_usage (user_id, email, daily_requests, last_request_date) VALUES (?, ?, 0, ?)",
            (user_id, email, str(today)),
        )
        daily_requests = 0
        last_request_date = str(today)
    else:
        daily_requests, last_request_date = result

    # Reset counter if it's a new day
    if last_request_date != str(today):
        daily_requests = 0

    if daily_requests >= settings.DAILY_LIMIT:
        conn.close()
        return False, 0

    # Increment counter
    new_count = daily_requests + 1
    cursor.execute(
        "UPDATE user_usage SET daily_requests = ?, last_request_date = ?, total_requests = total_requests + 1 WHERE user_id = ?",
        (new_count, str(today), user_id),
    )
    conn.commit()
    conn.close()

    remaining = settings.DAILY_LIMIT - new_count
    return True, remaining