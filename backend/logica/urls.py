from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VerificarTablaView, ContenidoLogicoViewSet, RegistrarResolucionView, ProgresoEstudiantesView, ResponderResolucionView, HistorialResolucionesView

router = DefaultRouter()
router.register(r'contenido', ContenidoLogicoViewSet)

urlpatterns = [
    path('verificar/', VerificarTablaView.as_view(), name='verificar-tabla'),
    path('contenido/<int:pk>/resolver/', RegistrarResolucionView.as_view(), name='registrar-resolucion'),
    path('historial/', HistorialResolucionesView.as_view(), name='historial-resoluciones'),
    path('progreso/', ProgresoEstudiantesView.as_view(), name='progreso-estudiantes'),
    path('resolucion/<int:pk>/responder/', ResponderResolucionView.as_view(), name='responder-resolucion'),
    path('', include(router.urls)),
]
