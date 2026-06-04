from rest_framework import serializers
from .models import ContenidoLogico, Resolucion, Evaluacion, ResultadoEvaluacion

class ContenidoLogicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContenidoLogico
        fields = '__all__'

class ResolucionSerializer(serializers.ModelSerializer):
    contenido_titulo = serializers.ReadOnlyField(source='contenido.titulo')
    contenido_tipo = serializers.ReadOnlyField(source='contenido.tipo')
    
    class Meta:
        model = Resolucion
        fields = ['id', 'contenido', 'contenido_titulo', 'contenido_tipo', 'fecha_completada', 'completado', 'comentario_docente']


class EvaluacionSerializer(serializers.ModelSerializer):
    total_preguntas = serializers.SerializerMethodField()
    creado_por_nombre = serializers.SerializerMethodField()

    class Meta:
        model = Evaluacion
        fields = [
            'id', 'titulo', 'descripcion', 'tipo_logica', 'preguntas',
            'umbral_aprobacion', 'activa', 'fecha_creacion',
            'creado_por', 'creado_por_nombre', 'total_preguntas'
        ]
        read_only_fields = ['fecha_creacion', 'creado_por']

    def get_total_preguntas(self, obj):
        return len(obj.preguntas) if obj.preguntas else 0

    def get_creado_por_nombre(self, obj):
        if obj.creado_por:
            return f"{obj.creado_por.nombres} {obj.creado_por.apellidos}"
        return None


class EvaluacionListSerializer(serializers.ModelSerializer):
    """Serializer ligero para listar evaluaciones (sin revelar respuestas correctas)"""
    total_preguntas = serializers.SerializerMethodField()
    preguntas_sin_respuesta = serializers.SerializerMethodField()

    class Meta:
        model = Evaluacion
        fields = [
            'id', 'titulo', 'descripcion', 'tipo_logica',
            'umbral_aprobacion', 'activa', 'fecha_creacion',
            'total_preguntas', 'preguntas_sin_respuesta'
        ]

    def get_total_preguntas(self, obj):
        return len(obj.preguntas) if obj.preguntas else 0

    def get_preguntas_sin_respuesta(self, obj):
        """Devuelve preguntas sin la respuesta correcta para evitar trampas"""
        if not obj.preguntas:
            return []
        return [
            {
                'pregunta': p.get('pregunta', ''),
                'opciones': p.get('opciones', [])
            }
            for p in obj.preguntas
        ]


class ResultadoEvaluacionSerializer(serializers.ModelSerializer):
    evaluacion_titulo = serializers.ReadOnlyField(source='evaluacion.titulo')
    evaluacion_tipo = serializers.ReadOnlyField(source='evaluacion.tipo_logica')
    porcentaje = serializers.SerializerMethodField()
    estudiante_nombre = serializers.SerializerMethodField()

    class Meta:
        model = ResultadoEvaluacion
        fields = [
            'id', 'evaluacion', 'evaluacion_titulo', 'evaluacion_tipo',
            'respuestas', 'puntaje', 'total_preguntas',
            'aprobado', 'fecha', 'porcentaje', 'estudiante', 'estudiante_nombre'
        ]
        read_only_fields = ['puntaje', 'total_preguntas', 'aprobado', 'fecha', 'estudiante']

    def get_porcentaje(self, obj):
        if obj.total_preguntas > 0:
            return round((obj.puntaje / obj.total_preguntas) * 100)
        return 0

    def get_estudiante_nombre(self, obj):
        return f"{obj.estudiante.nombres} {obj.estudiante.apellidos}"
