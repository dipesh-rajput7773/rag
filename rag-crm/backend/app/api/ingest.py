import logging

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.crud import create_lead, get_all_lead_ids
from app.db.database import get_db
from app.db.models import User
from app.middleware.auth import get_current_user
from app.models.request import BulkIngestRequest, IngestRequest
from app.models.response import BulkIngestResponse, IngestResponse
from app.services.vectorstore import add_lead, get_indexed_lead_ids

router = APIRouter(tags=["ingest"])
logger = logging.getLogger(__name__)


def lead_search_text(lead) -> str:
    return " ".join(
        value for value in [lead.name, lead.email, lead.status, lead.notes or ""] if value
    )


def lead_metadata(lead, user_id: int) -> dict:
    return {
        "lead_id": lead.id,
        "user_id": str(user_id),
        "name": lead.name,
        "email": lead.email,
        "status": lead.status,
        "notes": lead.notes or "",
    }


@router.post("/ingest", response_model=IngestResponse)
async def ingest_lead(
    request: IngestRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    lead = create_lead(db, request, user_id=user.id)
    add_lead(lead.id, lead_search_text(lead), lead_metadata(lead, user.id))

    return IngestResponse(
        success=True,
        message=f"Lead {lead.name} ingested successfully",
        lead_id=lead.id,
    )


@router.post("/ingest/bulk", response_model=BulkIngestResponse)
async def bulk_ingest(
    request: BulkIngestRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    total = 0
    failed: list[str] = []

    for lead_data in request.leads:
        try:
            lead = create_lead(db, lead_data, user_id=user.id)
            add_lead(lead.id, lead_search_text(lead), lead_metadata(lead, user.id))
            total += 1
        except Exception as exc:
            db.rollback()
            logger.warning("Failed to ingest lead %s: %s", lead_data.email, exc)
            failed.append(lead_data.email)

    return BulkIngestResponse(
        success=True,
        message=f"{total} leads ingested successfully",
        total_ingested=total,
        failed=failed,
    )


@router.post("/ingest/sync")
async def sync_leads(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    leads = get_all_lead_ids(db, user_id=user.id)
    indexed_ids = get_indexed_lead_ids(user_id=user.id)

    synced = 0
    for lead in leads:
        if lead.id not in indexed_ids:
            add_lead(lead.id, lead_search_text(lead), lead_metadata(lead, user.id))
            synced += 1

    return {
        "message": f"{synced} leads synced to Qdrant",
        "total_mysql": len(leads),
        "total_qdrant": len(indexed_ids),
    }
