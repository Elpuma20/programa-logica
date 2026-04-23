from django.contrib import admin
from .models import ContenidoLogico, Resolucion

@admin.register(ContenidoLogico)
class ContenidoLogicoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'tipo', 'dificultad', 'fecha_creacion')
    list_filter = ('tipo', 'dificultad')
    search_fields = ('titulo', 'descripcion')

admin.site.register(Resolucion)
