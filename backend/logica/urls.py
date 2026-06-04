from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    VerificarTablaView, ContenidoLogicoViewSet, RegistrarResolucionView,
    ProgresoEstudiantesView, ResponderResolucionView, HistorialResolucionesView,
    EvaluacionViewSet, ListarEvaluacionesEstudianteView, ResponderEvaluacionView,
    MisResultadosEvaluacionesView, ResultadosEvaluacionesAdminView,
    ReporteEstudianteView
)

router = DefaultRouter()
router.register(r'contenido', ContenidoLogicoViewSet, basename='contenido')
router.register(r'evaluaciones-admin', EvaluacionViewSet, basename='evaluaciones-admin')

urlpatterns = [
    path('verificar/', VerificarTablaView.as_view(), name='verificar-tabla'),
    path('contenido/<int:pk>/resolver/', RegistrarResolucionView.as_view(), name='registrar-resolucion'),
    path('historial/', HistorialResolucionesView.as_view(), name='historial-resoluciones'),
    path('progreso/', ProgresoEstudiantesView.as_view(), name='progreso-estudiantes'),
    path('resolucion/<int:pk>/responder/', ResponderResolucionView.as_view(), name='responder-resolucion'),
    # Evaluaciones
    path('evaluaciones/', ListarEvaluacionesEstudianteView.as_view(), name='evaluaciones-estudiante'),
    path('evaluaciones/<int:pk>/responder/', ResponderEvaluacionView.as_view(), name='responder-evaluacion'),
    path('mis-evaluaciones/', MisResultadosEvaluacionesView.as_view(), name='mis-evaluaciones'),
    path('resultados-evaluaciones/', ResultadosEvaluacionesAdminView.as_view(), name='resultados-evaluaciones-admin'),
    # Reporte
    path('reporte-estudiante/<int:pk>/', ReporteEstudianteView.as_view(), name='reporte-estudiante'),
    path('', include(router.urls)),
]
