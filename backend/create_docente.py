import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'plataforma.settings')
django.setup()

from usuarios.models import Usuario

def create_teacher():
    email = 'docente@edulogica.com'
    password = 'docente123'
    
    if not Usuario.objects.filter(correo=email).exists():
        Usuario.objects.create_user(
            correo=email,
            password=password,
            cedula='DOC001',
            nombres='Profesor',
            apellidos='Lógica',
            rol='DOCENTE',
            area_estudios='Ciencias Exactas',
            is_verified=True
        )
        print(f"Usuario Docente {email} creado exitosamente con password: {password}")
    else:
        # Update existing user to be DOCENTE just in case
        u = Usuario.objects.get(correo=email)
        u.rol = 'DOCENTE'
        u.set_password(password)
        u.save()
        print(f"Usuario {email} actualizado a rol DOCENTE.")

if __name__ == "__main__":
    create_teacher()
