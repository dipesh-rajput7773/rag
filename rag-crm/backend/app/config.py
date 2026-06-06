from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    APP_NAME: str = "DealGraph"
    PORT: int = 8000
    MYSQL_URL: str
    QDRANT_URL: str = ""
    QDRANT_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    JWT_SECRET: str = "rag-crm-super-secret-key-change-in-production"
    EMBEDDING_MODEL: str = "sentence-transformers/all-mpnet-base-v2"
    EMBEDDING_DIMENSION: int = 768

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
