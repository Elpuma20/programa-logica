from rest_framework import serializers
from .models import ContenidoLogico, Resolucion

class ContenidoLogicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContenidoLogico
        fields = '__all__'

class ResolucionSerializer(serializers.ModelSerializer):
    contenido_titulo = serializers.ReadOnlyField(source='contenido.titulo')
    contenido_tipo = serializers.ReadOnlyField(source='contenido.tipo')
    
    class Meta:
        model = Resolucion
        fields = ['id', 'contenido', 'contenido_titulo', 'contenido_tipo', 'fecha_completada', 'completado', 'comentario_docente']
