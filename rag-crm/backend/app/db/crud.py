from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException

from app.db.models import Lead
from app.models.request import IngestRequest, UpdateLeadRequest


def create_lead(db: Session, request: IngestRequest, user_id: int | None = None):
    try:
        lead = Lead(
            name=request.name,
            email=request.email,
            status=request.status,
            notes=request.notes,
            phone=request.phone or None,
            company=request.company or None,
            source=request.source or "manual",
            user_id=user_id,
        )
        db.add(lead)
        db.commit()
        db.refresh(lead)
        return lead
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail=f"Lead with email {request.email} already exists")


def get_all_leads(db: Session, user_id: int | None = None):
    query = db.query(Lead)
    if user_id is not None:
        query = query.filter(Lead.user_id == user_id)
    return query.all()


def get_leads_paginated(
    db: Session,
    user_id: int | None = None,
    skip: int = 0,
    limit: int = 20,
    status: str | None = None,
):
    query = db.query(Lead)
    if user_id is not None:
        query = query.filter(Lead.user_id == user_id)
    if status and status != "all":
        query = query.filter(Lead.status == status)
    total = query.count()
    leads = query.order_by(Lead.created_at.desc()).offset(skip).limit(limit).all()
    return leads, total


def get_all_lead_ids(db: Session, user_id: int | None = None):
    query = db.query(Lead)
    if user_id is not None:
        query = query.filter(Lead.user_id == user_id)
    return query.all()


def get_lead_by_id_scoped(db: Session, lead_id: int, user_id: int) -> Lead | None:
    return db.query(Lead).filter(Lead.id == lead_id, Lead.user_id == user_id).first()


def get_leads_by_status(db: Session, status: str, user_id: int | None = None):
    query = db.query(Lead).filter(Lead.status == status)
    if user_id is not None:
        query = query.filter(Lead.user_id == user_id)
    return query.all()


def search_leads(db: Session, query: str, user_id: int | None = None):
    q = db.query(Lead).filter(
        Lead.name.ilike(f"%{query}%")
        | Lead.notes.ilike(f"%{query}%")
        | Lead.status.ilike(f"%{query}%")
        | Lead.company.ilike(f"%{query}%")
    )
    if user_id is not None:
        q = q.filter(Lead.user_id == user_id)
    return q.all()


def get_lead_by_id(db: Session, lead_id: int):
    return db.query(Lead).filter(Lead.id == lead_id).first()


def update_lead(db: Session, lead_id: int, request: UpdateLeadRequest, user_id: int) -> Lead | None:
    lead = get_lead_by_id_scoped(db, lead_id, user_id)
    if not lead:
        return None
    for field, value in request.model_dump(exclude_none=True).items():
        setattr(lead, field, value)
    db.commit()
    db.refresh(lead)
    return lead


def delete_lead(db: Session, lead_id: int):
    lead = get_lead_by_id(db, lead_id)
    if lead:
        db.delete(lead)
        db.commit()
        return True
    return False


def delete_lead_scoped(db: Session, lead_id: int, user_id: int) -> bool:
    lead = get_lead_by_id_scoped(db, lead_id, user_id)
    if not lead:
        return False
    db.delete(lead)
    db.commit()
    return True


def count_leads(db: Session, filters: dict | None = None, user_id: int | None = None):
    filters = filters or {}
    query = db.query(Lead)
    if user_id is not None:
        query = query.filter(Lead.user_id == user_id)
    if "status" in filters:
        query = query.filter(Lead.status == filters["status"])
    return query.count()


def filter_leads(db: Session, filters: dict | None = None, user_id: int | None = None):
    filters = filters or {}
    query = db.query(Lead)
    if user_id is not None:
        query = query.filter(Lead.user_id == user_id)
    if "status" in filters:
        query = query.filter(Lead.status == filters["status"])
    if "location" in filters:
        query = query.filter(Lead.notes.ilike(f"%{filters['location']}%"))
    return query.all()
