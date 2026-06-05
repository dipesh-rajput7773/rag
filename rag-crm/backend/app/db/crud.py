from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException

from app.db.models import Lead
from app.models.request import IngestRequest

def create_lead(db: Session, request: IngestRequest, user_id: int | None = None):
    try:
        lead = Lead(
            name=request.name,
            email=request.email,
            status=request.status,
            notes=request.notes,
            user_id=user_id,
        )
        db.add(lead)
        db.commit()
        db.refresh(lead)
        return lead
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail=f"Lead with email {request.email} already exists",
        )

def get_all_leads(db: Session, user_id: int | None = None):
    query = db.query(Lead)
    if user_id is not None:
        query = query.filter(Lead.user_id == user_id)
    return query.all()

def get_all_lead_ids(db: Session, user_id: int | None = None):
    query = db.query(Lead)
    if user_id is not None:
        query = query.filter(Lead.user_id == user_id)
    return query.all()

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
    )
    if user_id is not None:
        q = q.filter(Lead.user_id == user_id)
    return q.all()

def get_lead_by_id(db: Session, lead_id: int):
    return db.query(Lead).filter(Lead.id == lead_id).first()

def delete_lead(db: Session, lead_id: int):
    lead = get_lead_by_id(db, lead_id)
    if lead:
        db.delete(lead)
        db.commit()
        return True
    return False

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
