from models import SessionLocal, User
from auth import verify_password

db = SessionLocal()
user = db.query(User).filter(User.email == 'superadmin@gmail.com').first()

if user:
    print(f'Utilisateur trouvé: {user.email}')
    print(f'Rôle: {user.role}')
    print(f'Hash du mot de passe: {user.password_hash}')
    
    # Tester le mot de passe
    test_password = 'Testeur2022'
    is_valid = verify_password(test_password, user.password_hash)
    print(f'Vérification du mot de passe "{test_password}": {is_valid}')
else:
    print('Utilisateur non trouvé')
    
db.close()
