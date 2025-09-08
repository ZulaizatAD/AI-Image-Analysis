import requests
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from models.schemas import UserInfo
from config.settings import settings

security = HTTPBearer()

async def verify_clerk_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> UserInfo:
    """Verify Clerk JWT token and return user info"""
    try:
        # Verify token with Clerk
        headers = {
            "Authorization": f"Bearer {settings.CLERK_SECRET_KEY}",
            "Content-Type": "application/json",
        }

        # Verify session
        response = requests.get(
            "https://api.clerk.dev/v1/sessions/verify",
            headers={
                "Authorization": f"Bearer {credentials.credentials}",
                "Content-Type": "application/json",
            },
        )

        if response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid token")

        session_data = response.json()
        user_id = session_data.get("user_id")

        # Get user details from Clerk
        user_response = requests.get(
            f"https://api.clerk.dev/v1/users/{user_id}", 
            headers=headers
        )

        if user_response.status_code != 200:
            raise HTTPException(status_code=401, detail="Could not fetch user data")

        user_data = user_response.json()
        email = user_data.get("email_addresses", [{}])[0].get("email_address", "")

        return UserInfo(user_id=user_id, email=email)

    except Exception as e:
        print(f"Token verification error: {e}")
        raise HTTPException(status_code=401, detail="Invalid authentication token")