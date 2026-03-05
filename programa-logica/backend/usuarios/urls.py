from django.urls import path
from .views import RegistroView, LoginView, UsuarioDetalleView

urlpatterns = [
    path('register/', RegistroView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('user/', UsuarioDetalleView.as_view(), name='user-detail'),
]
