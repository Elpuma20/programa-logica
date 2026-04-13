from rest_framework import viewsets, permissions
from .models import Bitacora
from .serializers import BitacoraSerializer

class BitacoraViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Bitacora.objects.all().select_related('usuario')
    serializer_class = BitacoraSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        queryset = Bitacora.objects.all().select_related('usuario')
        usuario_id = self.request.query_params.get('usuario', None)
        accion = self.request.query_params.get('accion', None)
        
        if usuario_id:
            queryset = queryset.filter(usuario_id=usuario_id)
        if accion:
            queryset = queryset.filter(accion=accion)
            
        return queryset
