from rest_framework import serializers
from .models import ContenidoLogico

class ContenidoLogicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContenidoLogico
        fields = '__all__'
