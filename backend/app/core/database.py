import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

logger = logging.getLogger(__name__)

db_url = settings.DATABASE_URL
engine = None

# Attempt to connect to PostgreSQL
if "postgresql" in db_url:
    try:
        # Create temp engine to test connection
        temp_engine = create_engine(
            db_url,
            pool_pre_ping=True,
            connect_args={"connect_timeout": 3}
        )
        with temp_engine.connect() as conn:
            pass
        engine = temp_engine
        logger.info("Successfully connected to PostgreSQL database.")
    except Exception as e:
        logger.warning(f"PostgreSQL connection failed ({e}). Falling back to local SQLite database.")
        db_url = "sqlite:///./charity.db"

if engine is None:
    # Use SQLite fallback
    connect_args = {"check_same_thread": False} if "sqlite" in db_url else {}
    engine = create_engine(
        db_url,
        echo=False,
        connect_args=connect_args
    )
    logger.info("Initialized local SQLite database.")

# Sessionmaker for DB operations
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative base class for models
Base = declarative_base()

# DB dependency for routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
