# CoChef - Configuration

## Database Setup

For development, you can use SQLite. Update `backend/models.py`:

```python
DATABASE_URL = "sqlite:///./cochef.db"
```

For production with PostgreSQL:

```python
DATABASE_URL = "postgresql://user:password@localhost/cochef_db"
```

## Running the Application

### Backend

```cmd
cd backend
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`
API documentation (Swagger): `http://localhost:8000/docs`

### Frontend

```cmd
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Environment Variables

Create a `.env` file in the backend directory:

```
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./cochef.db
```

## Initial Setup

1. Install backend dependencies:
   ```cmd
   cd backend
   pip install -r requirements.txt
   ```

2. Install frontend dependencies:
   ```cmd
   cd frontend
   npm install
   ```

3. Run both servers and access the application!
