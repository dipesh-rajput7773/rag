import csv
import io
import logging

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.db.crud import (
    delete_lead_scoped,
    get_all_leads,
    get_lead_by_id_scoped,
    get_leads_paginated,
    update_lead,
)
from app.db.database import get_db
from app.db.models import User
from app.middleware.auth import get_current_user
from app.models.request import UpdateLeadRequest
from app.models.response import LeadResponse, PaginatedLeads
from app.services.vectorstore import add_lead, remove_lead

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/leads", tags=["leads"])


def _lead_search_text(lead) -> str:
    return " ".join(
        v for v in [lead.name, lead.company or "", lead.email, lead.status, lead.notes or ""] if v
    )


def _lead_metadata(lead, user_id: int) -> dict:
    return {
        "lead_id": lead.id,
        "user_id": str(user_id),
        "name": lead.name,
        "email": lead.email,
        "company": lead.company or "",
        "status": lead.status,
        "notes": lead.notes or "",
        "phone": lead.phone or "",
    }


@router.get("/export")
async def export_leads(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    leads = get_all_leads(db, user_id=user.id)

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["name", "email", "status", "company", "phone", "source", "notes", "created_at"])
    for lead in leads:
        writer.writerow([
            lead.name, lead.email, lead.status,
            lead.company or "", lead.phone or "", lead.source or "manual",
            lead.notes or "", str(lead.created_at or ""),
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=leads.csv"},
    )


@router.get("", response_model=PaginatedLeads)
async def list_leads(
    skip: int = 0,
    limit: int = 20,
    status: str | None = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    leads, total = get_leads_paginated(db, user_id=user.id, skip=skip, limit=limit, status=status)
    return PaginatedLeads(leads=leads, total=total, skip=skip, limit=limit)


@router.get("/{lead_id}", response_model=LeadResponse)
async def get_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    lead = get_lead_by_id_scoped(db, lead_id, user.id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead


@router.put("/{lead_id}", response_model=LeadResponse)
async def update_lead_endpoint(
    lead_id: int,
    request: UpdateLeadRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    lead = update_lead(db, lead_id, request, user.id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    try:
        add_lead(lead.id, _lead_search_text(lead), _lead_metadata(lead, user.id))
    except Exception:
        logger.warning("Failed to re-index lead %s after update", lead_id)

    return lead


@router.delete("/{lead_id}", status_code=204)
async def delete_lead_endpoint(
    lead_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    deleted = delete_lead_scoped(db, lead_id, user.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Lead not found")

    try:
        remove_lead(lead_id)
    except Exception:
        logger.warning("Failed to remove lead %s from vector index", lead_id)
