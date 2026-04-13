from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VerificarTablaView, ContenidoLogicoViewSet

router = DefaultRouter()
router.register(r'contenido', ContenidoLogicoViewSet)

urlpatterns = [
    path('verificar/', VerificarTablaView.as_view(), name='verificar-tabla'),
    path('', include(router.urls)),
]
