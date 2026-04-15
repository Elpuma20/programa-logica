import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'plataforma.settings')
django.setup()

from usuarios.models import Usuario
from logica.models import ContenidoLogico, Resolucion

def seed_resolutions():
    estudiantes = Usuario.objects.filter(rol='ESTUDIANTE')
    contenidos = ContenidoLogico.objects.all()
    
    if not contenidos.exists():
        print("No hay contenidos para generar resoluciones.")
        return

    for est in estudiantes:
        # Generar entre 1 y 3 resoluciones por estudiante
        to_solve = random.sample(list(contenidos), k=random.randint(1, min(3, contenidos.count())))
        for c in to_solve:
            if not Resolucion.objects.filter(usuario=est, contenido=c).exists():
                r = Resolucion.objects.create(
                    usuario=est,
                    contenido=c,
                    completado=True
                )
                print(f"Resolución creada para {est.correo} en {c.titulo}")

if __name__ == "__main__":
    seed_resolutions()
