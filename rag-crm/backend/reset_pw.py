import sys, hashlib, os
sys.path.insert(0, '.')
from app.db.database import SessionLocal
from app.db.models import User

PASSWORD_ITERATIONS = 260000
NEW_PASSWORD = "demo1234"

def hash_password(password):
    salt = os.urandom(16).hex()
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), PASSWORD_ITERATIONS)
    return "pbkdf2_sha256$" + str(PASSWORD_ITERATIONS) + "$" + salt + "$" + digest.hex()

db = SessionLocal()
u = db.query(User).filter(User.id == 1).first()
u.password_hash = hash_password(NEW_PASSWORD)
db.commit()
print("Password reset to:", NEW_PASSWORD, "for", u.email)
db.close()
