# CoChef - Guide d'Installation et Configuration

Ce projet est une application web complète avec un backend FastAPI et un frontend React (Vite).

## Prérequis

- Python 3.9+
- Node.js & npm
- Git

## Installation Initiale

### 1. Clonage du projet (si nécessaire)
```bash
git clone <url-du-repo>
cd p_01_cochef
```

### 2. Configuration du Backend

Le backend utilise FastAPI et SQLAlchemy.

```powershell
# Aller dans le dossier backend
cd backend

# Créer l'environnement virtuel (Windows)
python -m venv venv

# Activer l'environnement virtuel (Windows)
.\venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Créer le fichier .env
# Copiez les variables suivantes dans un nouveau fichier nommé .env
# SECRET_KEY=votre_cle_secrete_ici
# DATABASE_URL=sqlite:///./cochef.db
```

### 3. Configuration du Frontend

Le frontend utilise React avec Vite et Tailwind CSS.

```powershell
# Aller dans le dossier frontend
cd ../frontend

# Installer les dépendances npm
npm install
```

## Lancement de l'Application

Pour faire tourner l'application, vous devez lancer les deux serveurs simultanément.

### Lancer le Backend
1. Ouvrez un terminal.
2. Naviguez vers `backend`.
3. Activez l'environnement virtuel : `.\venv\Scripts\activate`.
4. Lancez le serveur :
   ```bash
   uvicorn main:app --reload
   ```
   - API : `http://localhost:8000`
   - Documentation (Swagger) : `http://localhost:8000/docs`

### Lancer le Frontend
1. Ouvrez un deuxième terminal.
2. Naviguez vers `frontend`.
3. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```
   - Application : `http://localhost:5173`

## Base de données

Par défaut, le projet utilise **SQLite** pour le développement (`cochef.db`).
Si vous souhaitez utiliser PostgreSQL en production, modifiez la variable `DATABASE_URL` dans le fichier `.env` :
`DATABASE_URL=postgresql://user:password@localhost/cochef_db`

## Scripts Utiles (Backend)
Dans le dossier `backend`, vous trouverez plusieurs scripts pour initialiser les données :
- `python create_superadmin.py` : Crée un compte super-administrateur.
- `python create_gerant.py` : Crée un compte gérant.
- `python create_caissier.py` : Crée un compte caissier.

