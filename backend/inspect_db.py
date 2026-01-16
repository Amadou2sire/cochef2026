import sqlite3

conn = sqlite3.connect("cochef.db")
cursor = conn.cursor()

def inspect_table(table_name):
    print(f"\n--- {table_name} ---")
    cursor.execute(f"PRAGMA table_info({table_name})")
    columns = cursor.fetchall()
    for col in columns:
        print(col)
    
    cursor.execute(f"SELECT * FROM {table_name} LIMIT 5")
    rows = cursor.fetchall()
    for row in rows:
        print(row)

inspect_table("users")
inspect_table("orders")
inspect_table("order_details")

conn.close()
