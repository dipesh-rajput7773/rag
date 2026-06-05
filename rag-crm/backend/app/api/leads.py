from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.crud import get_all_leads
from app.db.database import get_db
from app.db.models import User
from app.middleware.auth import get_current_user
from app.models.response import LeadResponse

router = APIRouter(prefix="/leads", tags=["leads"])


@router.get("", response_model=list[LeadResponse])
async def list_leads(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return get_all_leads(db, user_id=user.id)
