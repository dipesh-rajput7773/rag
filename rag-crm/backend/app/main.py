import logging
import time
from collections import defaultdict

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from sqlalchemy import inspect as sa_inspect, text

from app.api import auth, dashboard, health, ingest, leads, search
from app.config import settings
from app.db import models
from app.db.database import Base, check_db_connection, engine
from app.middleware import setup_cors
from app.services.vectorstore import create_collection

logging.basicConfig(level=logging.INFO)
logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)

logger = logging.getLogger(__name__)


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, calls_per_minute: int = 120):
        super().__init__(app)
        self.calls_per_minute = calls_per_minute
        self._calls: dict = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        if not request.url.path.startswith("/api"):
            return await call_next(request)
        ip = (request.client.host if request.client else "unknown")
        now = time.time()
        self._calls[ip] = [t for t in self._calls[ip] if now - t < 60.0]
        if len(self._calls[ip]) >= self.calls_per_minute:
            return JSONResponse(status_code=429, content={"detail": "Too many requests. Please slow down."})
        self._calls[ip].append(now)
        return await call_next(request)


app = FastAPI(title=settings.APP_NAME)
app.add_middleware(RateLimitMiddleware)
setup_cors(app)

app.include_router(health.router, prefix="/api/v1")
app.include_router(search.router, prefix="/api/v1")
app.include_router(ingest.router, prefix="/api/v1")
app.include_router(leads.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")


def _run_db_migrations():
    try:
        inspector = sa_inspect(engine)
        if not inspector.has_table("leads"):
            return
        existing = {col["name"] for col in inspector.get_columns("leads")}
        new_cols = [
            ("user_id", "INT NULL"),
            ("phone", "VARCHAR(20) NULL"),
            ("company", "VARCHAR(200) NULL"),
            ("source", "VARCHAR(100) NULL DEFAULT 'manual'"),
        ]
        with engine.begin() as conn:
            for col_name, col_def in new_cols:
                if col_name not in existing:
                    conn.execute(text(f"ALTER TABLE leads ADD COLUMN {col_name} {col_def}"))
                    logger.info("Added column %s to leads table", col_name)
    except Exception:
        logger.exception("DB migration failed")


@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine)
    if not check_db_connection():
        raise RuntimeError("Database connection failed")
    _run_db_migrations()
    create_collection()


@app.get("/")
async def root():
    return {
        "message": "DealGraph API is running",
        "app_name": settings.APP_NAME,
        "port": settings.PORT,
    }
