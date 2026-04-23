import os
import django
import sys

# Añadir el path al sistema
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'plataforma.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

print(f"Probando envío desde: {settings.EMAIL_HOST_USER}")

try:
    send_mail(
        'Prueba Técnica EduLógica',
        'Este es un correo de prueba para verificar la conexión SMTP.',
        settings.EMAIL_HOST_USER,
        [settings.EMAIL_HOST_USER], # Enviarse a sí mismo
        fail_silently=False,
    )
    print("¡ÉXITO! El correo se envió correctamente.")
except Exception as e:
    print(f"FALLO: {str(e)}")
