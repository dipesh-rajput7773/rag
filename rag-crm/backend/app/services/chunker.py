from sentence_transformers import SentenceTransformer

# modal load
model = SentenceTransformer("all-MiniLM-L6-v2")

def get_embedding(text: str) -> list:
    embedding = model.encode(text)
    return embedding.tolist()

def get_embeddings_batch(texts: list) -> list:
    embeddings = model.encode(texts)
    return embeddings.tolist()
