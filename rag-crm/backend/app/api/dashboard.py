from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
from app.db.models import Lead, UsageLog, User
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/stats")
async def dashboard_stats(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    total_leads = db.query(Lead).filter(Lead.user_id == user.id).count()
    hot_leads = db.query(Lead).filter(Lead.user_id == user.id, Lead.status == "hot").count()
    warm_leads = db.query(Lead).filter(Lead.user_id == user.id, Lead.status == "warm").count()
    cold_leads = db.query(Lead).filter(Lead.user_id == user.id, Lead.status == "cold").count()

    total_searches = db.query(UsageLog).filter(
        UsageLog.user_id == user.id,
        UsageLog.action == "search",
    ).count()

    recent_searches = (
        db.query(UsageLog)
        .filter(UsageLog.user_id == user.id, UsageLog.action == "search")
        .order_by(UsageLog.created_at.desc())
        .limit(5)
        .all()
    )

    lead_trend = (
        db.query(
            func.date(Lead.created_at).label("date"),
            func.count(Lead.id).label("count"),
        )
        .filter(Lead.user_id == user.id)
        .group_by(func.date(Lead.created_at))
        .order_by(func.date(Lead.created_at).desc())
        .limit(30)
        .all()
    )

    return {
        "total_leads": total_leads,
        "hot_leads": hot_leads,
        "warm_leads": warm_leads,
        "cold_leads": cold_leads,
        "total_searches": total_searches,
        "recent_searches": [
            {"query": s.details, "timestamp": s.created_at.isoformat()}
            for s in recent_searches
        ],
        "lead_trend": [
            {"date": str(row.date), "count": row.count}
            for row in reversed(lead_trend)
        ],
    }
