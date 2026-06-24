import os
import sys

# Agrega la ruta de la carpeta actual al sistema de archivos de Python
sys.path.insert(0, os.path.dirname(__file__))

# Configura la variable de entorno de Django para que apunte a tus settings
os.environ['DJANGO_SETTINGS_MODULE'] = 'plataforma.settings'

# Inicializa la aplicación WSGI de Django
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()

try:
    from django.core.management import call_command
    call_command('migrate', interactive=False)
    
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
    else:
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
    else:
        u = Usuario.objects.get(correo=docente_email)
        u.set_password('docente123')
        u.save()
except Exception as e:
    import sys
    sys.stderr.write(f"Error en passenger_wsgi startup: {str(e)}\n")
