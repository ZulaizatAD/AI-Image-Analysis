import requests
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from models.schemas import UserInfo
from config.settings import settings
import jwt

security = HTTPBearer()


async def verify_clerk_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> UserInfo:
    """Verify Clerk JWT token and return user info"""
    try:
        token = credentials.credentials
        print(f"DEBUG: Received token: {token[:20]}...")
        print(f"DEBUG: Clerk Secret Key exists: {bool(settings.CLERK_SECRET_KEY)}")

        # Method 1: Decode JWT directly (simpler approach)
        try:
            # For development, we can decode without verification
            # In production, you should verify the signature
            decoded = jwt.decode(token, options={"verify_signature": False})
            user_id = decoded.get("sub")

            if not user_id:
                raise HTTPException(status_code=401, detail="Invalid token: no user ID")

            print(f"DEBUG: Decoded user_id: {user_id}")

            # Get user details from Clerk API
            headers = {
                "Authorization": f"Bearer {settings.CLERK_SECRET_KEY}",
                "Content-Type": "application/json",
            }

            user_response = requests.get(
                f"https://api.clerk.dev/v1/users/{user_id}", headers=headers
            )

            print(f"DEBUG: Clerk API response status: {user_response.status_code}")

            if user_response.status_code != 200:
                print(f"DEBUG: Clerk API error: {user_response.text}")
                # Fallback: use decoded token data
                email = decoded.get("email", "unknown@example.com")
                return UserInfo(user_id=user_id, email=email)

            user_data = user_response.json()
            email = user_data.get("email_addresses", [{}])[0].get("email_address", "")

            return UserInfo(user_id=user_id, email=email)

        except jwt.InvalidTokenError as e:
            print(f"DEBUG: JWT decode error: {e}")
            raise HTTPException(status_code=401, detail="Invalid token format")

    except HTTPException:
        raise
    except Exception as e:
        print(f"DEBUG: Token verification error: {e}")
        raise HTTPException(status_code=401, detail="Invalid authentication token")
