import sqlite3

conn = sqlite3.connect("cochef.db")
cursor = conn.cursor()

cursor.execute("""
ALTER TABLE supplements
ADD COLUMN image_url VARCHAR;
""")

conn.commit()
conn.close()

print("✅ image_url ajouté à supplements")
