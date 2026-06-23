import os
import sys

# Agrega la ruta de la carpeta actual al sistema de archivos de Python
sys.path.insert(0, os.path.dirname(__file__))

# Configura la variable de entorno de Django para que apunte a tus settings
os.environ['DJANGO_SETTINGS_MODULE'] = 'plataforma.settings'

# Inicializa la aplicación WSGI de Django
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
