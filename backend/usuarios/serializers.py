from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'cedula', 'nombres', 'apellidos', 'semestre', 'area_estudios', 'correo', 'telefono', 'direccion', 'rol', 'is_staff', 'is_verified']

class RegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = Usuario
        fields = ['id', 'cedula', 'nombres', 'apellidos', 'semestre', 'area_estudios', 'correo', 'telefono', 'direccion', 'rol', 'password']
        
    def create(self, validated_data):
        user = Usuario.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    correo = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, data):
        user = authenticate(username=data.get('correo'), password=data.get('password'))
        if user and user.is_active:
            return user
        raise serializers.ValidationError("correo o contraseña incorrectos...")
