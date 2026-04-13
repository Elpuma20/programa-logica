from django.urls import path
from .views import (
    RegistroView, LoginView, UsuarioDetalleView, 
    ListUsuariosView, VerificarUsuarioView, CambioPasswordView, RecuperarPasswordView
)

urlpatterns = [
    path('register/', RegistroView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('user/', UsuarioDetalleView.as_view(), name='user-detail'),
    path('list/', ListUsuariosView.as_view(), name='user-list'),
    path('verify/<int:pk>/', VerificarUsuarioView.as_view(), name='user-verify'),
    path('change-password/', CambioPasswordView.as_view(), name='change-password'),
    path('reset-password/', RecuperarPasswordView.as_view(), name='reset-password'),
]
