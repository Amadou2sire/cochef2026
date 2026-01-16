import sqlite3

conn = sqlite3.connect("cochef.db")
cursor = conn.cursor()

try:
    cursor.execute("ALTER TABLE users ADD COLUMN first_name VARCHAR")
    print("Added first_name column to users table")
except sqlite3.OperationalError:
    print("first_name column already exists")

try:
    cursor.execute("ALTER TABLE users ADD COLUMN last_name VARCHAR")
    print("Added last_name column to users table")
except sqlite3.OperationalError:
    print("last_name column already exists")

conn.commit()
conn.close()
