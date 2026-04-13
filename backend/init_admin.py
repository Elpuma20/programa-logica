import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'plataforma.settings')
django.setup()

from usuarios.models import Usuario

def create_admin():
    email = 'admin@edulogica.com'
    password = 'admin123'
    
    if not Usuario.objects.filter(correo=email).exists():
        Usuario.objects.create_superuser(
            correo=email,
            password=password,
            cedula='ADMIN001',
            nombres='Admin',
            apellidos='System',
            semestre='N/A',
            area_estudios='Administración',
            telefono='0000000000',
            direccion='Admin HQ'
        )
        print(f"Superusuario {email} creado exitosamente.")
    else:
        print(f"El usuario {email} ya existe.")

if __name__ == "__main__":
    create_admin()
