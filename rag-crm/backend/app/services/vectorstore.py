import logging
import uuid
from typing import Any

from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, FieldCondition, Filter, MatchValue, VectorParams

from app.config import settings
from app.services.embeddings import get_embeddings

logger = logging.getLogger(__name__)

COLLECTION_NAME = "crm_leads"


def _create_client():
    if settings.QDRANT_URL:
        client = QdrantClient(
            url=settings.QDRANT_URL,
            api_key=settings.QDRANT_API_KEY or None,
            check_compatibility=False,
        )
        try:
            client.get_collections()
            logger.info("Connected to Qdrant")
            return client
        except Exception as exc:
            logger.warning("Qdrant connection failed, using local storage: %s", exc)

    return QdrantClient(path="./qdrant_local")


client = _create_client()


def lead_vector_id(lead_id: int) -> str:
    return str(uuid.uuid5(uuid.NAMESPACE_DNS, f"lead:{lead_id}"))


def user_filter(user_id: int) -> Filter:
    return Filter(
        must=[
            FieldCondition(
                key="metadata.user_id",
                match=MatchValue(value=str(user_id)),
            )
        ]
    )


def create_collection():
    try:
        collection_names = {c.name for c in client.get_collections().collections}

        if COLLECTION_NAME not in collection_names:
            client.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=VectorParams(
                    size=settings.EMBEDDING_DIMENSION,
                    distance=Distance.COSINE,
                ),
            )
            logger.info("Created Qdrant collection %s", COLLECTION_NAME)
        else:
            logger.info("Qdrant collection %s is ready", COLLECTION_NAME)
    except Exception:
        logger.exception("Failed to prepare Qdrant collection")
        raise


def get_vectorstore():
    return QdrantVectorStore(
        client=client,
        collection_name=COLLECTION_NAME,
        embedding=get_embeddings(),
    )


def add_lead(lead_id: int, text: str, metadata: dict[str, Any]) -> None:
    vectorstore = get_vectorstore()
    try:
        vectorstore.add_texts(
            texts=[text],
            metadatas=[metadata],
            ids=[lead_vector_id(lead_id)],
        )
    except Exception:
        logger.exception("Failed to index lead %s", lead_id)
        raise


def search_leads(query: str, top_k: int = 5, user_id: int | None = None):
    vectorstore = get_vectorstore()
    qdrant_filter = user_filter(user_id) if user_id is not None else None
    return vectorstore.similarity_search_with_score(
        query=query,
        k=top_k,
        filter=qdrant_filter,
    )


def get_indexed_lead_ids(user_id: int | None = None) -> set[int]:
    indexed_ids = set()
    next_offset = None
    qdrant_filter = user_filter(user_id) if user_id is not None else None

    try:
        while True:
            points, next_offset = client.scroll(
                collection_name=COLLECTION_NAME,
                scroll_filter=qdrant_filter,
                offset=next_offset,
                limit=1000,
                with_payload=True,
                with_vectors=False,
            )

            for point in points:
                metadata = (point.payload or {}).get("metadata", {})
                lead_id = metadata.get("lead_id")
                if lead_id is not None:
                    indexed_ids.add(int(lead_id))

            if next_offset is None:
                break
    except Exception:
        logger.exception("Failed to read indexed lead ids")
        return set()

    return indexed_ids
