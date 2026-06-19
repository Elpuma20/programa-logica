from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count, Q
from .models import ContenidoLogico, Resolucion, Evaluacion, ResultadoEvaluacion
from .serializers import (
    ContenidoLogicoSerializer, ResolucionSerializer,
    EvaluacionSerializer, EvaluacionListSerializer, ResultadoEvaluacionSerializer
)
from usuarios.models import Usuario
from usuarios.permissions import IsDocenteOrAdmin

class HistorialResolucionesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        resoluciones = Resolucion.objects.filter(usuario=request.user).order_by('-fecha_completada')
        serializer = ResolucionSerializer(resoluciones, many=True)
        return Response(serializer.data)

from django.utils import timezone

class RegistrarResolucionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            contenido = ContenidoLogico.objects.get(pk=pk)
            tiempo = int(request.data.get('tiempo_usado', 0))
            intentos_req = int(request.data.get('intentos', 1))
            
            resolucion, created = Resolucion.objects.get_or_create(
                usuario=request.user,
                contenido=contenido,
                defaults={
                    'completado': True,
                    'intentos': intentos_req,
                    'tiempo_usado': tiempo,
                    'historial_intentos': [
                        {
                            'n_intento': i,
                            'fecha': timezone.now().isoformat(),
                            'tiempo_usado': round(tiempo / intentos_req) if i == intentos_req else 0,
                            'resultado': 'Completado' if i == intentos_req else 'Incorrecto'
                        } for i in range(1, intentos_req + 1)
                    ]
                }
            )
            
            if not created:
                start_intento = resolucion.intentos + 1
                resolucion.intentos += intentos_req
                resolucion.tiempo_usado += tiempo
                resolucion.completado = True
                
                # Anexar al historial
                historial = resolucion.historial_intentos or []
                for i in range(start_intento, resolucion.intentos + 1):
                    historial.append({
                        'n_intento': i,
                        'fecha': timezone.now().isoformat(),
                        'tiempo_usado': round(tiempo / intentos_req) if i == resolucion.intentos else 0,
                        'resultado': 'Completado' if i == resolucion.intentos else 'Incorrecto'
                    })
                resolucion.historial_intentos = historial
                resolucion.save()
                
            return Response({
                'status': 'success',
                'created': created,
                'intentos': resolucion.intentos,
                'tiempo_usado': resolucion.tiempo_usado
            })
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
    serializer_class = ContenidoLogicoSerializer
    
    def get_queryset(self):
        queryset = ContenidoLogico.objects.all().order_by('-fecha_creacion')
        if self.request.user and self.request.user.is_authenticated and self.request.user.rol == 'ESTUDIANTE':
            queryset = queryset.filter(activo=True)
        tipo = self.request.query_params.get('tipo')
        if tipo:
            queryset = queryset.filter(tipo=tipo)
        return queryset
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsDocenteOrAdmin]
        return [permission() for permission in permission_classes]

    def destroy(self, request, *args, **kwargs):
        if request.user.rol == 'DOCENTE':
            return Response({'error': 'El docente no tiene permisos para eliminar registros del sistema.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

class ProgresoEstudiantesView(APIView):
    permission_classes = [IsDocenteOrAdmin]

    def get(self, request):
        seccion = request.query_params.get('seccion')
        juego_id = request.query_params.get('juego_id')

        # Base query
        estudiantes = Usuario.objects.filter(rol='ESTUDIANTE')
        if seccion:
            estudiantes = estudiantes.filter(seccion=seccion)

        total_desafios = ContenidoLogico.objects.count()
        estudiantes_data = []

        for est in estudiantes:
            est_info = {
                'id': est.id,
                'nombres': est.nombres,
                'apellidos': est.apellidos,
                'correo': est.correo,
                'seccion': est.seccion or 'Sección A',
                'sexo': est.get_sexo_display() if est.sexo else 'Masculino',
                'area_estudios': est.area_estudios or 'Ingeniería en Sistemas',
            }

            if juego_id:
                if juego_id.startswith('game_'):
                    try:
                        game_pk = int(juego_id.split('_')[1])
                        res = Resolucion.objects.filter(usuario=est, contenido_id=game_pk).first()
                        if res:
                            est_info['intentos'] = res.intentos
                            est_info['tiempo_usado'] = res.tiempo_usado
                            est_info['calificacion'] = "Completado" if res.completado else "Incompleto"
                            est_info['aprobado'] = res.completado
                            est_info['historial'] = res.historial_intentos or []
                        else:
                            est_info['intentos'] = 0
                            est_info['tiempo_usado'] = 0
                            est_info['calificacion'] = "Pendiente"
                            est_info['aprobado'] = False
                            est_info['historial'] = []
                    except (ValueError, IndexError):
                        pass
                elif juego_id.startswith('eval_'):
                    try:
                        eval_pk = int(juego_id.split('_')[1])
                        resultados = ResultadoEvaluacion.objects.filter(estudiante=est, evaluacion_id=eval_pk).order_by('-fecha')
                        if resultados.exists():
                            latest = resultados.first()
                            est_info['intentos'] = resultados.count()
                            est_info['tiempo_usado'] = sum(r.tiempo_usado for r in resultados)
                            est_info['calificacion'] = f"{latest.puntaje}/{latest.total_preguntas} ({round(latest.puntaje / latest.total_preguntas * 100)}%)"
                            est_info['aprobado'] = latest.aprobado
                            est_info['historial'] = [
                                {
                                    'n_intento': len(resultados) - idx,
                                    'fecha': r.fecha.isoformat(),
                                    'tiempo_usado': r.tiempo_usado,
                                    'resultado': f"Aprobado ({r.puntaje}/{r.total_preguntas})" if r.aprobado else f"Reprobado ({r.puntaje}/{r.total_preguntas})"
                                } for idx, r in enumerate(resultados)
                            ]
                        else:
                            est_info['intentos'] = 0
                            est_info['tiempo_usado'] = 0
                            est_info['calificacion'] = "Sin evaluar"
                            est_info['aprobado'] = False
                            est_info['historial'] = []
                    except (ValueError, IndexError):
                        pass
            else:
                total_resoluciones = Resolucion.objects.filter(usuario=est, completado=True).count()
                est_info['total_resoluciones'] = total_resoluciones
                ultimas = Resolucion.objects.filter(usuario=est).order_by('-fecha_completada')[:3]
                est_info['historial'] = ResolucionSerializer(ultimas, many=True).data

            estudiantes_data.append(est_info)

        secciones_disponibles = list(Usuario.objects.filter(rol='ESTUDIANTE').values_list('seccion', flat=True).distinct())
        secciones_disponibles = [s for s in secciones_disponibles if s]
        if "Sección A" not in secciones_disponibles:
            secciones_disponibles.append("Sección A")

        juegos_disponibles = []
        for g in ContenidoLogico.objects.all().order_by('tipo', 'titulo'):
            juegos_disponibles.append({
                'id': f"game_{g.id}",
                'titulo': f"{g.tipo.capitalize()}: {g.titulo}",
                'tipo': 'Juego'
            })
        for ev in Evaluacion.objects.all().order_by('titulo'):
            juegos_disponibles.append({
                'id': f"eval_{ev.id}",
                'titulo': f"Evaluación: {ev.titulo}",
                'tipo': 'Evaluación'
            })

        total_m = estudiantes.filter(sexo='M').count()
        total_f = estudiantes.filter(sexo='F').count()

        distribucion_seccion = {}
        for sec in secciones_disponibles:
            distribucion_seccion[sec] = estudiantes.filter(seccion=sec).count()

        return Response({
            'estudiantes': estudiantes_data,
            'secciones_disponibles': secciones_disponibles,
            'juegos_disponibles': juegos_disponibles,
            'meta': {
                'total_desafios': total_desafios,
                'distribucion_sexo': {
                    'Masculino': total_m,
                    'Femenino': total_f
                },
                'distribucion_seccion': distribucion_seccion
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


# ============================================
# EVALUACIONES NO PONDERADAS
# ============================================

class EvaluacionViewSet(viewsets.ModelViewSet):
    """CRUD de evaluaciones para admin/docente"""
    serializer_class = EvaluacionSerializer

    def get_queryset(self):
        return Evaluacion.objects.all()

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [IsDocenteOrAdmin()]

    def get_serializer_class(self):
        # Para estudiantes al listar, no mostrar respuestas
        if self.action in ['list', 'retrieve']:
            user = self.request.user
            if user.rol == 'ESTUDIANTE' and not user.is_staff:
                return EvaluacionListSerializer
        return EvaluacionSerializer

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)

    def destroy(self, request, *args, **kwargs):
        if request.user.rol == 'DOCENTE':
            return Response({'error': 'El docente no tiene permisos para eliminar registros del sistema.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)


class ListarEvaluacionesEstudianteView(APIView):
    """Lista evaluaciones activas para estudiantes (sin respuestas correctas)"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        evaluaciones = Evaluacion.objects.filter(activa=True)
        serializer = EvaluacionListSerializer(evaluaciones, many=True)
        return Response(serializer.data)


class ResponderEvaluacionView(APIView):
    """Estudiante envía sus respuestas a una evaluación"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            evaluacion = Evaluacion.objects.get(pk=pk, activa=True)
        except Evaluacion.DoesNotExist:
            return Response(
                {'error': 'Evaluación no encontrada o inactiva.'},
                status=status.HTTP_404_NOT_FOUND
            )

        respuestas = request.data.get('respuestas', {})
        tiempo_usado = int(request.data.get('tiempo_usado', 0))
        
        if not respuestas:
            return Response(
                {'error': 'Debes enviar tus respuestas.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calificación no ponderada: cada pregunta vale 1 punto
        preguntas = evaluacion.preguntas
        total = len(preguntas)
        correctas = 0
        detalle = []

        for i, pregunta in enumerate(preguntas):
            respuesta_estudiante = respuestas.get(str(i), '')
            respuesta_correcta = pregunta.get('respuesta_correcta', '')
            es_correcta = respuesta_estudiante.strip().lower() == respuesta_correcta.strip().lower()
            if es_correcta:
                correctas += 1
            detalle.append({
                'pregunta': pregunta.get('pregunta', ''),
                'respuesta_estudiante': respuesta_estudiante,
                'respuesta_correcta': respuesta_correcta,
                'es_correcta': es_correcta
            })

        porcentaje = round((correctas / total) * 100) if total > 0 else 0
        aprobado = porcentaje >= evaluacion.umbral_aprobacion

        # Guardar resultado
        resultado = ResultadoEvaluacion.objects.create(
            estudiante=request.user,
            evaluacion=evaluacion,
            respuestas=respuestas,
            puntaje=correctas,
            total_preguntas=total,
            aprobado=aprobado,
            tiempo_usado=tiempo_usado
        )

        return Response({
            'id': resultado.id,
            'puntaje': correctas,
            'total_preguntas': total,
            'porcentaje': porcentaje,
            'aprobado': aprobado,
            'umbral': evaluacion.umbral_aprobacion,
            'tiempo_usado': resultado.tiempo_usado,
            'detalle': detalle
        }, status=status.HTTP_201_CREATED)


class MisResultadosEvaluacionesView(APIView):
    """Historial de evaluaciones del estudiante autenticado"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        resultados = ResultadoEvaluacion.objects.filter(
            estudiante=request.user
        ).order_by('-fecha')
        serializer = ResultadoEvaluacionSerializer(resultados, many=True)
        return Response(serializer.data)


class ResultadosEvaluacionesAdminView(APIView):
    """Ver todos los resultados de evaluaciones (admin/docente)"""
    permission_classes = [IsDocenteOrAdmin]

    def get(self, request):
        resultados = ResultadoEvaluacion.objects.all().order_by('-fecha')[:100]
        serializer = ResultadoEvaluacionSerializer(resultados, many=True)
        return Response(serializer.data)


# ============================================
# REPORTE DE FORTALEZAS Y DEBILIDADES
# ============================================

class ReporteEstudianteView(APIView):
    """Genera un reporte de fortalezas y debilidades de un estudiante"""
    permission_classes = [IsDocenteOrAdmin]

    def get(self, request, pk):
        try:
            estudiante = Usuario.objects.get(pk=pk, rol='ESTUDIANTE')
        except Usuario.DoesNotExist:
            return Response(
                {'error': 'Estudiante no encontrado.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # 1. Resoluciones por tipo de contenido
        resoluciones = Resolucion.objects.filter(usuario=estudiante, completado=True)
        total_contenido = ContenidoLogico.objects.count()

        resumen_por_tipo = {}
        for tipo_choice in ContenidoLogico.TIPOS:
            tipo = tipo_choice[0]
            total_tipo = ContenidoLogico.objects.filter(tipo=tipo).count()
            completadas = resoluciones.filter(contenido__tipo=tipo).count()
            porcentaje = round((completadas / total_tipo) * 100) if total_tipo > 0 else 0
            resumen_por_tipo[tipo] = {
                'total': total_tipo,
                'completadas': completadas,
                'porcentaje': porcentaje
            }

        # 2. Resultados de evaluaciones por tipo de lógica
        resultados_eval = ResultadoEvaluacion.objects.filter(estudiante=estudiante)
        resumen_evaluaciones = {}
        for tipo_choice in Evaluacion.TIPOS_LOGICA:
            tipo = tipo_choice[0]
            nombre = tipo_choice[1]
            resultados_tipo = resultados_eval.filter(evaluacion__tipo_logica=tipo)
            total_eval = resultados_tipo.count()
            aprobadas = resultados_tipo.filter(aprobado=True).count()
            if total_eval > 0:
                porcentaje_aprobacion = round((aprobadas / total_eval) * 100)
            else:
                porcentaje_aprobacion = None  # Sin datos
            resumen_evaluaciones[tipo] = {
                'nombre': nombre,
                'total': total_eval,
                'aprobadas': aprobadas,
                'reprobadas': total_eval - aprobadas,
                'porcentaje_aprobacion': porcentaje_aprobacion
            }

        # 3. Determinar fortalezas y debilidades
        fortalezas = []
        debilidades = []

        # Basado en resoluciones de contenido
        for tipo, datos in resumen_por_tipo.items():
            if datos['porcentaje'] >= 70:
                fortalezas.append({
                    'area': tipo.capitalize(),
                    'porcentaje': datos['porcentaje'],
                    'fuente': 'contenido'
                })
            elif datos['porcentaje'] < 40 and datos['total'] > 0:
                debilidades.append({
                    'area': tipo.capitalize(),
                    'porcentaje': datos['porcentaje'],
                    'fuente': 'contenido'
                })

        # Basado en evaluaciones
        for tipo, datos in resumen_evaluaciones.items():
            if datos['porcentaje_aprobacion'] is not None:
                if datos['porcentaje_aprobacion'] >= 70:
                    fortalezas.append({
                        'area': datos['nombre'],
                        'porcentaje': datos['porcentaje_aprobacion'],
                        'fuente': 'evaluacion'
                    })
                elif datos['porcentaje_aprobacion'] < 40:
                    debilidades.append({
                        'area': datos['nombre'],
                        'porcentaje': datos['porcentaje_aprobacion'],
                        'fuente': 'evaluacion'
                    })

        # 4. Historial reciente
        ultimas_resoluciones = resoluciones.order_by('-fecha_completada')[:5]
        ultimos_resultados = resultados_eval.order_by('-fecha')[:5]

        return Response({
            'estudiante': {
                'id': estudiante.id,
                'nombres': estudiante.nombres,
                'apellidos': estudiante.apellidos,
                'correo': estudiante.correo,
                'area_estudios': estudiante.area_estudios,
                'semestre': estudiante.semestre,
            },
            'fortalezas': fortalezas,
            'debilidades': debilidades,
            'resumen_contenido': resumen_por_tipo,
            'resumen_evaluaciones': resumen_evaluaciones,
            'estadisticas_generales': {
                'total_resoluciones': resoluciones.count(),
                'total_contenido_disponible': total_contenido,
                'evaluaciones_realizadas': resultados_eval.count(),
                'evaluaciones_aprobadas': resultados_eval.filter(aprobado=True).count(),
                'evaluaciones_reprobadas': resultados_eval.filter(aprobado=False).count(),
            },
            'historial_resoluciones': ResolucionSerializer(ultimas_resoluciones, many=True).data,
            'historial_evaluaciones': ResultadoEvaluacionSerializer(ultimos_resultados, many=True).data,
        })
