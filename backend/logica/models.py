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

    def __str__(self):
        return f"{self.usuario.correo} - {self.contenido.titulo} ({self.fecha_completada.date()})"

    class Meta:
        verbose_name = "Resolución"
        verbose_name_plural = "Resoluciones"
        unique_together = ('usuario', 'contenido')
