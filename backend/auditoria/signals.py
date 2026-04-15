from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Bitacora
from logica.models import ContenidoLogico
from usuarios.models import Usuario
from .middleware import get_current_user

@receiver(post_save, sender=ContenidoLogico)
def log_contenido_save(sender, instance, created, **kwargs):
    user = get_current_user()
    if user and user.is_authenticated:
        accion = 'CREAR' if created else 'EDITAR'
        Bitacora.objects.create(
            usuario=user,
            accion=accion,
            nivel='INFO',
            modelo='Contenido Lógico',
            objeto_id=str(instance.id),
            detalle=f"{accion} de {instance.tipo}: {instance.titulo}"
        )

@receiver(post_delete, sender=ContenidoLogico)
def log_contenido_delete(sender, instance, **kwargs):
    user = get_current_user()
    if user and user.is_authenticated:
        Bitacora.objects.create(
            usuario=user,
            accion='ELIMINAR',
            nivel='WARNING',
            modelo='Contenido Lógico',
            objeto_id=str(instance.id),
            detalle=f"ELIMINAR de {instance.tipo}: {instance.titulo}"
        )

@receiver(post_save, sender=Usuario)
def log_usuario_save(sender, instance, created, **kwargs):
    user = get_current_user()
    if user and user.is_authenticated:
        accion = 'CREAR' if created else 'EDITAR'
        Bitacora.objects.create(
            usuario=user,
            accion=accion,
            nivel='WARNING' if accion == 'EDITAR' else 'INFO',
            modelo='Usuario',
            objeto_id=str(instance.id),
            detalle=f"{accion} de perfil: {instance.correo}"
        )
