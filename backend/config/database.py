import sqlite3
from config.settings import settings

def init_db():
    """Initialize the database with required tables"""
    conn = sqlite3.connect(settings.DATABASE_URL)
    cursor = conn.cursor()
    
    # User usage table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_usage (
            user_id TEXT PRIMARY KEY,
            email TEXT,
            daily_requests INTEGER DEFAULT 0,
            last_request_date DATE,
            total_requests INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Analyses table (NO image_data column)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS analyses (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            analysis_result TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    conn.commit()
    conn.close()

def get_db_connection():
    """Get database connection"""
    return sqlite3.connect(settings.DATABASE_URL)