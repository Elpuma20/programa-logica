import MySQLdb
import sys

def create_db():
    params = [
        {'host': '127.0.0.1', 'user': 'root', 'passwd': ''},
        {'unix_socket': '/var/run/mysqld/mysqld.sock', 'user': 'root', 'passwd': ''},
        {'host': 'localhost', 'user': 'root', 'passwd': ''},
    ]
    
    for param in params:
        try:
            print(f"Intentando conectar con {param}...")
            db = MySQLdb.connect(**param)
            cursor = db.cursor()
            cursor.execute("CREATE DATABASE IF NOT EXISTS plataforma_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
            print("Base de datos 'plataforma_db' creada o ya existía.")
            db.close()
            return True
        except Exception as e:
            print(f"Fallo: {e}")
            
    return False

if __name__ == "__main__":
    if create_db():
        sys.exit(0)
    else:
        print("No se pudo crear la base de datos.")
        sys.exit(1)
