import hashlib
import secrets

def generate_api_key() -> str:
    return f"rag_{secrets.token_hex(24)}"

def hash_api_key(key: str) -> str:
    return hashlib.sha256(key.encode()).hexdigest()

def get_key_prefix(key: str) -> str:
    return key[:19] + "..."
