"""
WSGI config for plataforma project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'plataforma.settings')

application = get_wsgi_application()

# Ejecutar migraciones y crear usuarios base automáticamente en el inicio del servidor
try:
    from django.core.management import call_command
    print("Django iniciado. Ejecutando migraciones automáticas...")
    call_command('migrate', interactive=False)
    print("Migraciones ejecutadas exitosamente.")

    from usuarios.models import Usuario
    admin_email = 'admin@edulogica.com'
    if not Usuario.objects.filter(correo=admin_email).exists():
        Usuario.objects.create_superuser(
            correo=admin_email,
            password='admin123',
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
        print("Superusuario admin@edulogica.com creado.")
    else:
        # Asegurar contraseña
        u = Usuario.objects.get(correo=admin_email)
        u.set_password('admin123')
        u.save()

    docente_email = 'docente@edulogica.com'
    if not Usuario.objects.filter(correo=docente_email).exists():
        Usuario.objects.create_user(
            correo=docente_email,
            password='docente123',
            cedula='DOC001',
            nombres='Profesor',
            apellidos='Lógica',
            rol='DOCENTE',
            area_estudios='Ciencias Exactas',
            telefono='+584120000001',
            is_verified=True,
        )
        print("Usuario docente@edulogica.com creado.")
    else:
        # Asegurar contraseña
        u = Usuario.objects.get(correo=docente_email)
        u.set_password('docente123')
        u.save()

except Exception as e:
    import sys
    sys.stderr.write(f"Error en inicialización del servidor: {str(e)}\n")
