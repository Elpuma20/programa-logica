import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'plataforma.settings')
django.setup()

from usuarios.models import Usuario

def recreate_users():
    # --- Eliminar usuarios existentes ---
    admin_email = 'admin@edulogica.com'
    docente_email = 'docente@edulogica.com'

    deleted_admin = Usuario.objects.filter(correo=admin_email).delete()
    print(f"Admin eliminado: {deleted_admin}")

    deleted_docente = Usuario.objects.filter(correo=docente_email).delete()
    print(f"Docente eliminado: {deleted_docente}")

    # --- Recrear Administrador ---
    admin_password = 'admin123'
    Usuario.objects.create_superuser(
        correo=admin_email,
        password=admin_password,
        cedula='ADMIN001',
        nombres='Admin',
        apellidos='System',
        semestre='N/A',
        area_estudios='Administración',
        telefono='0000000000',
        direccion='Admin HQ',
        rol='ADMIN',
        is_verified=True,
    )
    print(f"✅ Admin recreado -> correo: {admin_email} | password: {admin_password}")

    # --- Recrear Docente ---
    docente_password = 'docente123'
    Usuario.objects.create_user(
        correo=docente_email,
        password=docente_password,
        cedula='DOC001',
        nombres='Profesor',
        apellidos='Lógica',
        rol='DOCENTE',
        area_estudios='Ciencias Exactas',
        telefono='+584120000001',
        is_verified=True,
    )
    print(f"✅ Docente recreado -> correo: {docente_email} | password: {docente_password}")

    print("\n--- Resumen de credenciales ---")
    print(f"ADMIN   | correo: {admin_email}   | password: {admin_password}")
    print(f"DOCENTE | correo: {docente_email} | password: {docente_password}")

if __name__ == "__main__":
    recreate_users()
