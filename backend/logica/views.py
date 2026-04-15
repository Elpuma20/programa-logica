from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count, Q
from .models import ContenidoLogico, Resolucion
from .serializers import ContenidoLogicoSerializer, ResolucionSerializer
from usuarios.models import Usuario
from usuarios.permissions import IsDocenteOrAdmin

class HistorialResolucionesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        resoluciones = Resolucion.objects.filter(usuario=request.user).order_by('-fecha_completada')
        serializer = ResolucionSerializer(resoluciones, many=True)
        return Response(serializer.data)

class RegistrarResolucionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            contenido = ContenidoLogico.objects.get(pk=pk)
            resolucion, created = Resolucion.objects.get_or_create(
                usuario=request.user,
                contenido=contenido,
                defaults={'completado': True}
            )
            return Response({'status': 'success', 'created': created})
        except ContenidoLogico.DoesNotExist:
            return Response({'error': 'Contenido no encontrado'}, status=status.HTTP_404_NOT_FOUND)

class VerificarTablaView(APIView):
# ... existing code ...
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        # Ejemplo: proposition = "p and q", values = [{"p": True, "q": True, "res": True}, ...]
        proposition = request.data.get('proposition')
        rows = request.data.get('rows') # Lista de objetos con valores y respuesta del usuario
        
        if not proposition or not rows:
            return Response({"error": "Faltan datos"}, status=status.HTTP_400_BAD_REQUEST)
            
        results = []
        all_correct = True
        
        for row in rows:
            # Reemplazar operadores lógicos si es necesario (ej: "->" por " <= ")
            # Para este prototipo, usaremos eval de python con booleanos
            try:
                # Limpiar y preparar la expresión
                expr = proposition.replace('AND', 'and').replace('OR', 'or').replace('NOT', 'not')
                # Manejar implicación p -> q como (not p or q)
                # handle equivalence p <-> q as (p == q)
                
                # Contexto para eval
                context = {k: v for k, v in row.items() if k != 'res'}
                correct_res = eval(expr, {"__builtins__": None}, context)
                
                is_row_correct = (correct_res == row['res'])
                if not is_row_correct:
                    all_correct = False
                
                results.append({
                    "row": row,
                    "correct_res": correct_res,
                    "is_correct": is_row_correct
                })
            except Exception as e:
                return Response({"error": f"Error evaluando: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
                
        return Response({
            "all_correct": all_correct,
            "results": results
        })

class ContenidoLogicoViewSet(viewsets.ModelViewSet):
    queryset = ContenidoLogico.objects.all().order_by('-fecha_creacion')
    serializer_class = ContenidoLogicoSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsDocenteOrAdmin]
        return [permission() for permission in permission_classes]

class ProgresoEstudiantesView(APIView):
    permission_classes = [IsDocenteOrAdmin]

    def get(self, request):
        # Listar estudiantes con su conteo de resoluciones
        estudiantes_data = []
        estudiantes = Usuario.objects.filter(rol='ESTUDIANTE').annotate(
            total_resoluciones=Count('resoluciones', filter=Q(resoluciones__completado=True))
        )
        
        for est in estudiantes:
            # Obtener últimas 3 resoluciones de cada estudiante
            ultimas_resoluciones = Resolucion.objects.filter(usuario=est).order_by('-fecha_completada')[:3]
            res_serializer = ResolucionSerializer(ultimas_resoluciones, many=True)
            
            estudiantes_data.append({
                'id': est.id,
                'nombres': est.nombres,
                'apellidos': est.apellidos,
                'correo': est.correo,
                'total_resoluciones': est.total_resoluciones,
                'area_estudios': est.area_estudios,
                'historial': res_serializer.data
            })
        
        total_desafios = ContenidoLogico.objects.count()
        
        return Response({
            'estudiantes': estudiantes_data,
            'meta': {
                'total_desafios': total_desafios
            }
        })

class ResponderResolucionView(APIView):
    permission_classes = [IsDocenteOrAdmin]

    def post(self, request, pk):
        try:
            # pk puede ser el ID del estudiante (si enviamos feedback general) 
            # o el ID de una resolución específica.
            # Según el flujo propuesto, permitimos feedback a la última resolución si no se especifica.
            
            try:
                # Intentamos buscar como resolución específica
                resolucion = Resolucion.objects.get(pk=pk)
            except Resolucion.DoesNotExist:
                # Si no, buscamos la última resolución del usuario con ID pk
                usuario = Usuario.objects.get(pk=pk)
                resolucion = Resolucion.objects.filter(usuario=usuario).order_by('-fecha_completada').first()
                if not resolucion:
                    return Response({'error': 'No hay resoluciones para este estudiante'}, status=status.HTTP_404_NOT_FOUND)

            comentario = request.data.get('comentario')
            resolucion.comentario_docente = comentario
            resolucion.save()
            return Response({
                'status': 'success', 
                'comentario': comentario,
                'resolucion_id': resolucion.id,
                'contenido': resolucion.contenido.titulo
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
