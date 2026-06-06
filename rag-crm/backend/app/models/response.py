from datetime import datetime
from typing import List

from pydantic import BaseModel, Field, field_validator


class LeadResult(BaseModel):
    id: int
    name: str
    email: str
    status: str
    notes: str = ""
    relevance_score: float


class LeadResponse(BaseModel):
    id: int
    name: str
    email: str
    status: str
    notes: str = ""
    phone: str = ""
    company: str = ""
    source: str = "manual"
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = {"from_attributes": True}

    @field_validator("notes", "phone", "company", "source", mode="before")
    @classmethod
    def none_to_empty(cls, v):
        return v if v is not None else ""


class PaginatedLeads(BaseModel):
    leads: List[LeadResponse]
    total: int
    skip: int
    limit: int


class SearchResponse(BaseModel):
    query: str
    answer: str
    results: List[LeadResult]
    total_results: int


class IngestResponse(BaseModel):
    success: bool
    message: str
    lead_id: int


class BulkIngestResponse(BaseModel):
    success: bool
    message: str
    total_ingested: int
    failed: List[str] = Field(default_factory=list)
