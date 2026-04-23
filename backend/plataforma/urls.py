from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

from .admin_views import AdminStatsView, SystemStatusView, SecurityStatusView

def home(request):
    return JsonResponse({"mensaje": "Bienvenido a la API del Proyecto de Grado", "estado": "activo"})

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('api/', include('usuarios.urls')),
    path('api/logica/', include('logica.urls')),
    path('api/auditoria/', include('auditoria.urls')),
    # Admin Panel APIs
    path('api/admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('api/admin/system-status/', SystemStatusView.as_view(), name='system-status'),
    path('api/admin/security-status/', SecurityStatusView.as_view(), name='security-status'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
