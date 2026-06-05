from datetime import datetime
from typing import List

from pydantic import BaseModel, Field


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
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = {"from_attributes": True}

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
