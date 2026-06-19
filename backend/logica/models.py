from django.db import models

class ContenidoLogico(models.Model):
    TIPOS = [
        ('trivia', 'Trivia'),
        ('adivinanza', 'Adivinanza'),
        ('rompecabezas', 'Rompecabezas'),
        ('paradoja', 'Paradoja'),
    ]
    
    DIFICULTAD = [
        ('facil', 'Fácil'),
        ('medio', 'Medio'),
        ('dificil', 'Difícil'),
    ]

    tipo = models.CharField(max_length=20, choices=TIPOS)
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(help_text="La pregunta o descripción del contenido")
    respuesta = models.TextField(help_text="La respuesta correcta o explicación")
    opciones = models.JSONField(null=True, blank=True, help_text="Para trivias: listas de opciones ['A', 'B', 'C']")
    dificultad = models.CharField(max_length=10, choices=DIFICULTAD, default='medio')
    imagen = models.FileField(upload_to='logica/', null=True, blank=True, help_text="Imagen para el rompecabezas")
    activo = models.BooleanField(default=True, help_text="Habilitado/Deshabilitado para los estudiantes")
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tipo.capitalize()}: {self.titulo}"

    class Meta:
        verbose_name = "Contenido Lógico"
        verbose_name_plural = "Contenidos Lógicos"

class Resolucion(models.Model):
    usuario = models.ForeignKey('usuarios.Usuario', on_delete=models.CASCADE, related_name='resoluciones')
    contenido = models.ForeignKey(ContenidoLogico, on_delete=models.CASCADE, related_name='resoluciones')
    fecha_completada = models.DateTimeField(auto_now_add=True)
    completado = models.BooleanField(default=True)
    comentario_docente = models.TextField(null=True, blank=True, help_text="Comentarios de retroalimentación del docente")
    intentos = models.IntegerField(default=1, help_text="Cantidad de intentos realizados")
    tiempo_usado = models.IntegerField(default=0, help_text="Tiempo total utilizado en segundos")
    historial_intentos = models.JSONField(default=list, blank=True, help_text="Historial detallado de intentos")

    def __str__(self):
        return f"{self.usuario.correo} - {self.contenido.titulo} ({self.fecha_completada.date()})"

    class Meta:
        verbose_name = "Resolución"
        verbose_name_plural = "Resoluciones"
        unique_together = ('usuario', 'contenido')


class Evaluacion(models.Model):
    TIPOS_LOGICA = [
        ('proposicional', 'Lógica Proposicional'),
        ('predicados', 'Lógica de Predicados'),
        ('inferencia', 'Inferencia y Demostración'),
        ('conjuntos', 'Teoría de Conjuntos'),
        ('boole', 'Álgebra de Boole'),
        ('general', 'General'),
    ]

    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, default='')
    tipo_logica = models.CharField(max_length=50, choices=TIPOS_LOGICA, default='general')
    preguntas = models.JSONField(
        help_text='Lista de preguntas: [{"pregunta": "...", "opciones": ["A","B","C","D"], "respuesta_correcta": "A"}]'
    )
    umbral_aprobacion = models.IntegerField(default=60, help_text="Porcentaje mínimo para aprobar (ej: 60)")
    activa = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    creado_por = models.ForeignKey(
        'usuarios.Usuario', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='evaluaciones_creadas'
    )

    def __str__(self):
        return f"Evaluación: {self.titulo} ({self.tipo_logica})"

    class Meta:
        verbose_name = "Evaluación"
        verbose_name_plural = "Evaluaciones"
        ordering = ['-fecha_creacion']


class ResultadoEvaluacion(models.Model):
    estudiante = models.ForeignKey(
        'usuarios.Usuario', on_delete=models.CASCADE,
        related_name='resultados_evaluaciones'
    )
    evaluacion = models.ForeignKey(
        Evaluacion, on_delete=models.CASCADE,
        related_name='resultados'
    )
    respuestas = models.JSONField(
        help_text='Respuestas del estudiante: {"0": "A", "1": "C", ...}'
    )
    puntaje = models.IntegerField(help_text="Cantidad de respuestas correctas")
    total_preguntas = models.IntegerField()
    aprobado = models.BooleanField()
    tiempo_usado = models.IntegerField(default=0, help_text="Tiempo utilizado en segundos")
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        estado = "✅ APROBADO" if self.aprobado else "❌ REPROBADO"
        return f"{self.estudiante.correo} - {self.evaluacion.titulo} - {estado}"

    class Meta:
        verbose_name = "Resultado de Evaluación"
        verbose_name_plural = "Resultados de Evaluaciones"
        ordering = ['-fecha']
