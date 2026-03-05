from django.urls import path
from .views import VerificarTablaView

urlpatterns = [
    path('verificar/', VerificarTablaView.as_view(), name='verificar-tabla'),
]
