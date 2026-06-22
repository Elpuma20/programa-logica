import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'logica.settings')
django.setup()

from usuarios.models import Usuario

for i, user in enumerate(Usuario.objects.all()):
    if not user.telefono or user.telefono == "":
        user.telefono = f"+000000{i}"
        user.save()

