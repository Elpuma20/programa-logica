from django.urls import path
from .views import (
    RegistroView, LoginView, UsuarioDetalleView, 
    ListUsuariosView, VerificarUsuarioView, CambioPasswordView, SolicitarRecuperacionView, ConfirmarRecuperacionView, VerificarCodigoView,
    EliminarUsuarioView
)

urlpatterns = [
    path('register/', RegistroView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('user/', UsuarioDetalleView.as_view(), name='user-detail'),
    path('list/', ListUsuariosView.as_view(), name='user-list'),
    path('verify/<int:pk>/', VerificarUsuarioView.as_view(), name='user-verify'),
    path('delete/<int:pk>/', EliminarUsuarioView.as_view(), name='user-delete'),
    path('verify-code/', VerificarCodigoView.as_view(), name='verify-code'),
    path('change-password/', CambioPasswordView.as_view(), name='change-password'),
    path('password-reset/', SolicitarRecuperacionView.as_view(), name='password-reset-request'),
    path('password-reset-confirm/', ConfirmarRecuperacionView.as_view(), name='password-reset-confirm'),
]
