import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    # API Configuration
    APP_NAME = "AI Nutrition Analyser"
    APP_VERSION = "2.0.0"
    APP_DESCRIPTION = "AI-powered food analysis with Clerk authentication"

    # Database
    DATABASE_URL = "nutrition_app.db"

    # Rate Limiting
    DAILY_LIMIT = 3

    # Authentication
    CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")
    ADMIN_USER_ID = os.getenv("ADMIN_USER_ID", "admin_user_id_here")

    # AI Service
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    GEMINI_MODEL = "gemini-2.0-flash"

    # CORS
    ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]

    # File Upload
    MAX_FILE_SIZE = 10_000_000  # 10MB
    ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg"]


settings = Settings()
