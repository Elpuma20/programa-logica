from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def home(request):
    return JsonResponse({"mensaje": "Bienvenido a la API del Proyecto de Grado", "estado": "activo"})

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('api/', include('usuarios.urls')),
    path('api/logica/', include('logica.urls')),
]
