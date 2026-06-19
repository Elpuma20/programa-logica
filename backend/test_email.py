import os
import django
import sys

# Añadir el path al sistema
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'plataforma.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

print(f"Probando envío desde: {settings.DEFAULT_FROM_EMAIL}")
print(f"Usando backend: {settings.EMAIL_BACKEND}")

# Reemplaza con tu correo personal para probar si te llega el correo de prueba:
DESTINATARIO = 'joseluisrodri540@gmail.com'

try:
    send_mail(
        'Prueba de API Resend - EduLógica',
        'Este es un correo de prueba enviado usando la API de Resend (Puerto 443 HTTP) para evadir bloqueos de puertos SMTP.',
        settings.DEFAULT_FROM_EMAIL,
        [DESTINATARIO],
        fail_silently=False,
    )
    print(f"¡ÉXITO! Petición a la API de Resend enviada correctamente hacia: {DESTINATARIO}.")
except Exception as e:
    print(f"FALLO: {str(e)}")
