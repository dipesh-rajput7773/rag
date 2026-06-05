from typing import List

from pydantic import BaseModel, field_validator

class SearchRequest(BaseModel):
    query: str
    top_k: int = 5

    @field_validator("query")
    @classmethod
    def validate_query(cls, v):
        if len(v.strip()) < 3:
            raise ValueError("Query must be at least 3 characters")
        return v.strip()

    @field_validator("top_k")
    @classmethod
    def validate_top_k(cls, v):
        if v < 1:
            raise ValueError("top_k must be at least 1")
        if v > 20:
            raise ValueError("top_k cannot exceed 20")
        return v

class IngestRequest(BaseModel):
    name: str
    email: str
    status: str
    notes: str

    @field_validator("name", "email", "notes")
    @classmethod
    def strip_text(cls, value: str):
        return value.strip()

    @field_validator("status")
    @classmethod
    def validate_status(cls, value: str):
        status = value.strip().lower()
        if status not in {"hot", "warm", "cold"}:
            raise ValueError("status must be hot, warm, or cold")
        return status

class BulkIngestRequest(BaseModel):
    leads: List[IngestRequest]    
