from models import Base, engine, SessionLocal, User, UserRole
from auth import get_password_hash

def create_superadmin():
    db = SessionLocal()
    try:
        # Check if superadmin already exists
        superadmin = db.query(User).filter(User.email == "superadmin@gmail.com").first()
        if superadmin:
            print("Superadmin already exists!")
            return
        
        # Create superadmin
        hashed_password = get_password_hash("Testeur2022")
        superadmin = User(
            name="Super Admin",
            first_name="Super",
            last_name="Admin",
            email="superadmin@gmail.com",
            password_hash=hashed_password,
            role=UserRole.SUPERADMIN
        )
        db.add(superadmin)
        db.commit()
        print("Superadmin created successfully!")
        print("Email: superadmin@gmail.com")
        print("Password: Testeur2022")
    except Exception as e:
        print(f"Error creating superadmin: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_superadmin()
