import logging

from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.config import settings

logger = logging.getLogger(__name__)

engine = create_engine(
    settings.MYSQL_URL,
    echo=False,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def check_db_connection() -> bool:
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        logger.info("Database connected successfully")
        return True
    except Exception as exc:
        logger.error("Database connection failed: %s", exc)
        return False


def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception:
        logger.exception("Database session failed")
        db.rollback()
        raise
    finally:
        db.close()
