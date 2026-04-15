from django.db import models
from django.conf import settings

class Bitacora(models.Model):
    ACCIONES = [
        ('CREAR', 'Creación'),
        ('EDITAR', 'Modificación'),
        ('ELIMINAR', 'Eliminación'),
        ('LOGIN', 'Inicio de Sesión'),
        ('LOGOUT', 'Cierre de Sesión'),
        ('LOGIN_ERROR', 'Error de Acceso'),
    ]

    NIVELES = [
        ('INFO', 'Información'),
        ('WARNING', 'Advertencia'),
        ('CRITICAL', 'Crítico'),
    ]

    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='logs'
    )
    accion = models.CharField(max_length=20, choices=ACCIONES)
    nivel = models.CharField(max_length=10, choices=NIVELES, default='INFO')
    modelo = models.CharField(max_length=100, null=True, blank=True)
    objeto_id = models.CharField(max_length=100, null=True, blank=True)
    detalle = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.accion} - {self.modelo or 'Sistema'} - {self.timestamp}"

    class Meta:
        verbose_name = "Registro de Bitácora"
        verbose_name_plural = "Registros de Bitácora"
        ordering = ['-timestamp']
