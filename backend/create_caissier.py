import models
import auth
from sqlalchemy.orm import Session
from models import SessionLocal, init_db

def create_caissier():
    # Ensure tables exist
    init_db()
    
    db = SessionLocal()
    try:
        # Check if user already exists
        email = "caissier@gmail.com"
        db_user = db.query(models.User).filter(models.User.email == email).first()
        if db_user:
            print(f"User {email} already exists.")
            return

        # Create new caissier user
        password = "Testeur2022"
        hashed_password = auth.get_password_hash(password)
        new_user = models.User(
            email=email,
            name="Caissier",
            first_name="Employe",
            last_name="Caisse",
            password_hash=hashed_password,
            role=models.UserRole.CAISSIER
        )
        db.add(new_user)
        db.commit()
        print(f"Caissier user {email} created successfully.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_caissier()
