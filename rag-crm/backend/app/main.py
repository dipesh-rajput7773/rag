import logging

from fastapi import FastAPI

from app.api import auth, dashboard, health, ingest, leads, search
from app.config import settings
from app.db import models
from app.db.database import Base, check_db_connection, engine
from app.middleware import setup_cors
from app.services.vectorstore import create_collection

logging.basicConfig(level=logging.INFO)
logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)

app = FastAPI(title=settings.APP_NAME)
setup_cors(app)

app.include_router(health.router, prefix="/api/v1")
app.include_router(search.router, prefix="/api/v1")
app.include_router(ingest.router, prefix="/api/v1")
app.include_router(leads.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")


@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine)
    if not check_db_connection():
        raise RuntimeError("Database connection failed")
    create_collection()


@app.get("/")
async def root():
    return {
        "message": "RAG CRM API is running",
        "app_name": settings.APP_NAME,
        "port": settings.PORT,
    }
