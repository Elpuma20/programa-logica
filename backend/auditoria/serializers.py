from rest_framework import serializers
from .models import Bitacora
from usuarios.models import Usuario

class UsuarioLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['nombres', 'apellidos', 'correo', 'cedula']

class BitacoraSerializer(serializers.ModelSerializer):
    usuario_detalle = UsuarioLogSerializer(source='usuario', read_only=True)
    
    class Meta:
        model = Bitacora
        fields = [
            'id', 'usuario', 'usuario_detalle', 'accion', 
            'modelo', 'objeto_id', 'detalle', 'ip_address', 'timestamp'
        ]
