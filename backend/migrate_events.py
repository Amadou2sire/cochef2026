from sqlalchemy import create_engine, text
import os

# Database URL
DATABASE_URL = "sqlite:///./cochef.db"

def migrate():
    print("Starting migration...")
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        # Check if column exists
        try:
            # SQLite doesn't have a simple way to check columns like 'information_schema'
            # We fail safely if add column fails
            connection.execute(text("ALTER TABLE events ADD COLUMN tables_required INTEGER DEFAULT 0"))
            print("Successfully added 'tables_required' column to 'events' table.")
        except Exception as e:
            if "duplicate column name" in str(e):
                print("Column 'tables_required' already exists.")
            else:
                print(f"Error adding column: {e}")

if __name__ == "__main__":
    migrate()
