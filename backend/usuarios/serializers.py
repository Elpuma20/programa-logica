from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
<<<<<<< HEAD
        fields = ['cedula', 'nombres', 'apellidos', 'correo', 'telefono']
=======
        fields = ['cedula', 'nombres', 'apellidos', 'semestre', 'area_estudios', 'correo', 'telefono', 'direccion']
>>>>>>> 02a0cd1547dd2cdfafbcf8e7daf8736d90b20194

class RegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = Usuario
<<<<<<< HEAD
        fields = ['cedula', 'nombres', 'apellidos', 'correo', 'telefono', 'password']
=======
        fields = ['cedula', 'nombres', 'apellidos', 'semestre', 'area_estudios', 'correo', 'telefono', 'direccion', 'password']
>>>>>>> 02a0cd1547dd2cdfafbcf8e7daf8736d90b20194
        
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
