import os
import django
import random
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'plataforma.settings')
django.setup()

from usuarios.models import Usuario
from logica.models import ContenidoLogico, Resolucion, Evaluacion, ResultadoEvaluacion

def seed_demo_data():
    print("=== INICIANDO CONFIGURACIÓN DE DATOS DEMO (DOCENTE / INTENTOS) ===")

    # 1. Distribuir estudiantes en diferentes secciones
    estudiantes = list(Usuario.objects.filter(rol='ESTUDIANTE'))
    if not estudiantes:
        print("❌ No hay estudiantes en el sistema. Asegúrate de correr recreate_users.py primero.")
        return

    secciones = ['Sección A', 'Sección B', 'Sección C']
    
    # Asignar secciones específicas a algunos alumnos conocidos para testear consistencia
    student_section_map = {
        'maria@gmail.com': 'Sección A',
        'santamaria.jef@gmail.com': 'Sección B',
        'gyannis7@gmail.com': 'Sección A',
        'carlos12@gmail.com': 'Sección B',
        'pedro@example.com': 'Sección C',
        'adrian@gmail.com': 'Sección C',
        'jose@gmail.com': 'Sección C',
    }

    print("Actualizando secciones de estudiantes...")
    for idx, est in enumerate(estudiantes):
        if est.correo in student_section_map:
            est.seccion = student_section_map[est.correo]
        else:
            est.seccion = secciones[idx % len(secciones)]
        est.save()
        print(f"  Estudiante: {est.nombres} {est.apellidos} ({est.correo}) -> {est.seccion}")

    # 2. Subir varias evaluaciones adicionales
    print("\nCreando evaluaciones adicionales...")
    evaluaciones_extra = [
        {
            'titulo': 'Teoría de Conjuntos y Operaciones Básicas',
            'descripcion': 'Examen sobre intersección, unión, diferencias de conjuntos y diagramas de Venn.',
            'tipo_logica': 'conjuntos',
            'umbral_aprobacion': 60,
            'activa': True,
            'preguntas': [
                {
                    'pregunta': '¿Qué operación de conjuntos representa la intersección (∩)?',
                    'opciones': [
                        'Elementos comunes a ambos conjuntos',
                        'Todos los elementos de ambos conjuntos sin repetir',
                        'Elementos que están en el primero pero no en el segundo',
                        'El conjunto vacío'
                    ],
                    'respuesta_correcta': 'Elementos comunes a ambos conjuntos'
                },
                {
                    'pregunta': 'Si A = {1, 2} y B = {2, 3}, ¿cuál es el conjunto resultante de la unión A ∪ B?',
                    'opciones': ['{2}', '{1, 2, 3}', '{1, 3}', '{1, 2, 2, 3}'],
                    'respuesta_correcta': '{1, 2, 3}'
                },
                {
                    'pregunta': '¿Cuál es el símbolo utilizado tradicionalmente para denotar el conjunto vacío?',
                    'opciones': ['∅', '∈', '⊂', '∩'],
                    'respuesta_correcta': '∅'
                },
                {
                    'pregunta': '¿Qué representa la diferencia de conjuntos A - B?',
                    'opciones': [
                        'Elementos comunes entre A y B',
                        'Elementos que pertenecen a A pero NO pertenecen a B',
                        'Elementos que pertenecen a B pero NO pertenecen a A',
                        'La suma de los elementos de A y B'
                    ],
                    'respuesta_correcta': 'Elementos que pertenecen a A pero NO pertenecen a B'
                }
            ]
        },
        {
            'titulo': 'Razonamiento Crítico y Paradojas Clásicas',
            'descripcion': 'Evaluación general sobre el análisis de argumentos y contradicciones de autorreferencia.',
            'tipo_logica': 'general',
            'umbral_aprobacion': 60,
            'activa': True,
            'preguntas': [
                {
                    'pregunta': '¿Cuál de las siguientes es la mejor definición de una paradoja?',
                    'opciones': [
                        'Una mentira intencionada para engañar al oponente',
                        'Un argumento aparentemente válido que conduce a una conclusión contradictoria o absurda',
                        'Una verdad incuestionable basada en axiomas',
                        'Una fórmula matemática sin solución real'
                    ],
                    'respuesta_correcta': 'Un argumento aparentemente válido que conduce a una conclusión contradictoria o absurda'
                },
                {
                    'pregunta': '¿Cuál es el núcleo de contradicción en la paradoja de Epiménides (un cretense dice "todos los cretenses mienten")?',
                    'opciones': [
                        'Si dice la verdad, entonces miente, y si miente, entonces dice la verdad.',
                        'Los cretenses nunca han sabido mentir.',
                        'Es imposible verificar si es cretense.',
                        'Toda mentira es en realidad una verdad a medias.'
                    ],
                    'respuesta_correcta': 'Si dice la verdad, entonces miente, y si miente, entonces dice la verdad.'
                },
                {
                    'pregunta': '¿De qué trata conceptualmente la paradoja física/matemática de Aquiles y la tortuga?',
                    'opciones': [
                        'La imposibilidad teórica de que el corredor más rápido alcance al más lento si este inicia con ventaja',
                        'Que las tortugas son en realidad más veloces en distancias cuánticas',
                        'La dilatación temporal por velocidad',
                        'La fuerza de gravedad afectando la aceleración'
                    ],
                    'respuesta_correcta': 'La imposibilidad teórica de que el corredor más rápido alcance al más lento si este inicia con ventaja'
                }
            ]
        }
    ]

    for item in evaluaciones_extra:
        ev, created = Evaluacion.objects.get_or_create(
            titulo=item['titulo'],
            defaults={
                'descripcion': item['descripcion'],
                'tipo_logica': item['tipo_logica'],
                'umbral_aprobacion': item['umbral_aprobacion'],
                'activa': item['activa'],
                'preguntas': item['preguntas']
            }
        )
        if created:
            print(f"  Creada evaluación: {ev.titulo}")
        else:
            print(f"  La evaluación '{ev.titulo}' ya existía.")

    # 3. Asegurar que existan contenidos lógicos de prueba
    contenidos = list(ContenidoLogico.objects.all())
    if not contenidos:
        print("❌ No hay Contenidos Lógicos en la DB. Corriendo seed_data de forma inline...")
        from seed_data import seed_data
        seed_data()
        contenidos = list(ContenidoLogico.objects.all())

    # 4. Generar resoluciones simuladas (intentos en juegos)
    print("\nGenerando historial de intentos en Juegos...")
    # Limpiamos resoluciones previas para evitar conflictos de unique_together
    Resolucion.objects.all().delete()
    
    # Yannis (Sección A) -> Resuelve Juego 1 con 2 intentos, Juego 2 con 1 intento
    yannis = Usuario.objects.filter(correo='gyannis7@gmail.com').first()
    if yannis and len(contenidos) >= 2:
        # Juego 1
        res1 = Resolucion.objects.create(
            usuario=yannis,
            contenido=contenidos[0],
            completado=True,
            intentos=2,
            tiempo_usado=140,
            historial_intentos=[
                {
                    'n_intento': 1,
                    'fecha': (timezone.now() - timezone.timedelta(minutes=10)).isoformat(),
                    'tiempo_usado': 80,
                    'resultado': 'Incorrecto'
                },
                {
                    'n_intento': 2,
                    'fecha': timezone.now().isoformat(),
                    'tiempo_usado': 60,
                    'resultado': 'Completado'
                }
            ],
            comentario_docente="Buen esfuerzo al corregir la conjunción en el segundo intento."
        )
        print(f"  Resolución simulada de {yannis.nombres} en {contenidos[0].titulo} (2 intentos)")

        # Juego 2
        res2 = Resolucion.objects.create(
            usuario=yannis,
            contenido=contenidos[1],
            completado=True,
            intentos=1,
            tiempo_usado=45,
            historial_intentos=[
                {
                    'n_intento': 1,
                    'fecha': timezone.now().isoformat(),
                    'tiempo_usado': 45,
                    'resultado': 'Completado'
                }
            ]
        )
        print(f"  Resolución simulada de {yannis.nombres} en {contenidos[1].titulo} (1 intento)")

    # Carlos (Sección B) -> Resuelve Juego 2 con 1 intento
    carlos = Usuario.objects.filter(correo='carlos12@gmail.com').first()
    if carlos and len(contenidos) >= 2:
        Resolucion.objects.create(
            usuario=carlos,
            contenido=contenidos[1],
            completado=True,
            intentos=1,
            tiempo_usado=50,
            historial_intentos=[
                {
                    'n_intento': 1,
                    'fecha': timezone.now().isoformat(),
                    'tiempo_usado': 50,
                    'resultado': 'Completado'
                }
            ]
        )
        print(f"  Resolución simulada de {carlos.nombres} en {contenidos[1].titulo} (1 intento)")

    # Pedro (Sección C) -> Resuelve Juego 3 con 3 intentos
    pedro = Usuario.objects.filter(correo='pedro@example.com').first()
    if pedro and len(contenidos) >= 3:
        Resolucion.objects.create(
            usuario=pedro,
            contenido=contenidos[2],
            completado=True,
            intentos=3,
            tiempo_usado=210,
            historial_intentos=[
                {
                    'n_intento': 1,
                    'fecha': (timezone.now() - timezone.timedelta(minutes=20)).isoformat(),
                    'tiempo_usado': 90,
                    'resultado': 'Incorrecto'
                },
                {
                    'n_intento': 2,
                    'fecha': (timezone.now() - timezone.timedelta(minutes=10)).isoformat(),
                    'tiempo_usado': 70,
                    'resultado': 'Incorrecto'
                },
                {
                    'n_intento': 3,
                    'fecha': timezone.now().isoformat(),
                    'tiempo_usado': 50,
                    'resultado': 'Completado'
                }
            ]
        )
        print(f"  Resolución simulada de {pedro.nombres} en {contenidos[2].titulo} (3 intentos)")

    # 5. Generar resultados de evaluaciones simuladas (intentos en evaluaciones)
    print("\nGenerando historial de intentos en Evaluaciones...")
    ResultadoEvaluacion.objects.all().delete()
    evaluaciones = list(Evaluacion.objects.all())

    if evaluaciones:
        # Yannis (Sección B) -> 2 intentos en Evaluación 1 (id=1 o primera de la lista)
        # Intento 1: Reprobado, Intento 2: Aprobado
        eval1 = evaluaciones[0]
        if yannis:
            # Intento 1 (Fallido)
            ResultadoEvaluacion.objects.create(
                estudiante=yannis,
                evaluacion=eval1,
                respuestas={"0": "Conjunción", "1": "Falso", "2": "Contradicción", "3": "¬P ∨ ¬Q", "4": "Falso"},
                puntaje=2,
                total_preguntas=5,
                aprobado=False,
                tiempo_usado=120,
                fecha=timezone.now() - timezone.timedelta(hours=2)
            )
            # Intento 2 (Aprobado)
            ResultadoEvaluacion.objects.create(
                estudiante=yannis,
                evaluacion=eval1,
                respuestas={"0": "Condicional", "1": "Falso", "2": "Una proposición que siempre es verdadera independientemente de los valores de sus componentes.", "3": "¬P ∧ ¬Q", "4": "Verdadero"},
                puntaje=5,
                total_preguntas=5,
                aprobado=True,
                tiempo_usado=95,
                fecha=timezone.now() - timezone.timedelta(minutes=30)
            )
            print(f"  Resultado de examen para {yannis.nombres} en {eval1.titulo} (2 intentos)")

        # Carlos (Sección B) -> 1 intento en Evaluación 1 (Aprobado)
        if carlos:
            ResultadoEvaluacion.objects.create(
                estudiante=carlos,
                evaluacion=eval1,
                respuestas={"0": "Condicional", "1": "Falso", "2": "Una proposición que siempre es verdadera independientemente de los valores de sus componentes.", "3": "¬P ∧ ¬Q", "4": "Verdadero"},
                puntaje=5,
                total_preguntas=5,
                aprobado=True,
                tiempo_usado=80,
                fecha=timezone.now() - timezone.timedelta(hours=1)
            )
            print(f"  Resultado de examen para {carlos.nombres} en {eval1.titulo} (1 intento)")

        # Pedro (Sección C) -> 2 intentos en la evaluación de Teoría de Conjuntos (que creamos nosotros)
        eval_conj = Evaluacion.objects.filter(tipo_logica='conjuntos').first()
        if pedro and eval_conj:
            # Intento 1 (Fallido)
            ResultadoEvaluacion.objects.create(
                estudiante=pedro,
                evaluacion=eval_conj,
                respuestas={"0": "El conjunto vacío", "1": "{2}", "2": "∅", "3": "La suma de los elementos de A y B"},
                puntaje=1,
                total_preguntas=4,
                aprobado=False,
                tiempo_usado=140,
                fecha=timezone.now() - timezone.timedelta(hours=3)
            )
            # Intento 2 (Aprobado)
            ResultadoEvaluacion.objects.create(
                estudiante=pedro,
                evaluacion=eval_conj,
                respuestas={"0": "Elementos comunes a ambos conjuntos", "1": "{1, 2, 3}", "2": "∅", "3": "Elementos que pertenecen a A pero NO pertenecen a B"},
                puntaje=4,
                total_preguntas=4,
                aprobado=True,
                tiempo_usado=110,
                fecha=timezone.now() - timezone.timedelta(hours=1)
            )
            print(f"  Resultado de examen para {pedro.nombres} en {eval_conj.titulo} (2 intentos)")

    print("\n=== CONFIGURACIÓN DE DATOS DEMO FINALIZADA CON ÉXITO ===")

if __name__ == '__main__':
    seed_demo_data()
