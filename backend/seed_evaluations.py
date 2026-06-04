import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'plataforma.settings')
django.setup()

from logica.models import Evaluacion

def seed_evaluations():
    evaluaciones = [
        {
            'titulo': 'Fundamentos de Lógica Proposicional',
            'descripcion': 'Prueba de nivel básico sobre proposiciones, conectores lógicos, tablas de verdad y tautologías.',
            'tipo_logica': 'proposicional',
            'umbral_aprobacion': 60,
            'activa': True,
            'preguntas': [
                {
                    'pregunta': '¿Qué conectiva lógica corresponde al símbolo "→"?',
                    'opciones': ['Conjunción', 'Disyunción', 'Condicional', 'Bicondicional'],
                    'respuesta_correcta': 'Condicional'
                },
                {
                    'pregunta': 'Si P es Verdadero y Q es Falso, ¿cuál es el valor de verdad de P ∧ Q?',
                    'opciones': ['Verdadero', 'Falso', 'Indeterminado', 'Ambas'],
                    'respuesta_correcta': 'Falso'
                },
                {
                    'pregunta': '¿Qué es una tautología?',
                    'opciones': [
                        'Una proposición que siempre es falsa.',
                        'Una proposición que puede ser verdadera o falsa.',
                        'Una proposición que siempre es verdadera independientemente de los valores de sus componentes.',
                        'Una contradicción lógica.'
                    ],
                    'respuesta_correcta': 'Una proposición que siempre es verdadera independientemente de los valores de sus componentes.'
                },
                {
                    'pregunta': '¿Cuál es la negación de la proposición "P ∨ Q" según las Leyes de De Morgan?',
                    'opciones': ['¬P ∨ ¬Q', '¬P ∧ ¬Q', '¬P ∨ Q', 'P ∧ ¬Q'],
                    'respuesta_correcta': '¬P ∧ ¬Q'
                },
                {
                    'pregunta': '¿Cuál es el valor de verdad de "P → Q" cuando P es Falso y Q es Verdadero?',
                    'opciones': ['Verdadero', 'Falso', 'No se puede determinar', 'Nulo'],
                    'respuesta_correcta': 'Verdadero'
                }
            ]
        },
        {
            'titulo': 'Álgebra de Boole y Simplificación de Circuitos',
            'descripcion': 'Evaluación sobre compuertas lógicas, postulados del álgebra de Boole y minimización de funciones.',
            'tipo_logica': 'boole',
            'umbral_aprobacion': 70,
            'activa': True,
            'preguntas': [
                {
                    'pregunta': '¿A qué equivale la expresión booleana A + (A · B) según la ley de absorción?',
                    'opciones': ['B', 'A · B', 'A', '1'],
                    'respuesta_correcta': 'A'
                },
                {
                    'pregunta': '¿Qué compuerta lógica produce un 1 lógico únicamente cuando todas sus entradas son 1?',
                    'opciones': ['OR', 'AND', 'XOR', 'NAND'],
                    'respuesta_correcta': 'AND'
                },
                {
                    'pregunta': '¿A qué es igual A + ¬A en el Álgebra de Boole?',
                    'opciones': ['0', 'A', '¬A', '1'],
                    'respuesta_correcta': '1'
                },
                {
                    'pregunta': '¿Qué compuerta lógica realiza la operación de suma booleana excluyente?',
                    'opciones': ['AND', 'NAND', 'XOR', 'NOR'],
                    'respuesta_correcta': 'XOR'
                },
                {
                    'pregunta': 'La ley distributiva booleana establece que A + (B · C) es igual a:',
                    'opciones': [
                        '(A + B) · (A + C)',
                        '(A · B) + (A · C)',
                        'A + B + C',
                        'A · B · C'
                    ],
                    'respuesta_correcta': '(A + B) · (A + C)'
                }
            ]
        },
        {
            'titulo': 'Lógica de Predicados y Cuantificadores',
            'descripcion': 'Examen sobre la formalización del lenguaje natural utilizando cuantificadores universales y existenciales.',
            'tipo_logica': 'predicados',
            'umbral_aprobacion': 60,
            'activa': True,
            'preguntas': [
                {
                    'pregunta': '¿Qué símbolo se utiliza para denotar el cuantificador universal "Para todo"?',
                    'opciones': ['∃', '∀', '∈', '⊂'],
                    'respuesta_correcta': '∀'
                },
                {
                    'pregunta': '¿Cuál es la negación lógica de "Todos los estudiantes aprobaron" (∀x E(x))?',
                    'opciones': [
                        'Ningún estudiante aprobó.',
                        'Algunos estudiantes no aprobaron (∃x ¬E(x)).',
                        'Todos los estudiantes reprobaron.',
                        'Si estudias entonces apruebas.'
                    ],
                    'respuesta_correcta': 'Algunos estudiantes no aprobaron (∃x ¬E(x)).'
                },
                {
                    'pregunta': '¿Qué representa el símbolo "∃"?',
                    'opciones': [
                        'Cuantificador universal',
                        'Cuantificador existencial ("Existe al menos un")',
                        'Operador de negación',
                        'Condicional material'
                    ],
                    'respuesta_correcta': 'Cuantificador existencial ("Existe al menos un")'
                },
                {
                    'pregunta': 'La expresión "∀x (Humano(x) → Mortal(x))" se traduce en lenguaje natural como:',
                    'opciones': [
                        'Existe un humano que es mortal.',
                        'Todos los humanos son mortales.',
                        'Nadie es humano ni mortal.',
                        'Si alguien es mortal, es humano.'
                    ],
                    'respuesta_correcta': 'Todos los humanos son mortales.'
                }
            ]
        },
        {
            'titulo': 'Reglas de Inferencia y Demostración',
            'descripcion': 'Prueba sobre reglas lógicas clásicas de deducción formal (Modus Ponens, Modus Tollens, Silogismos).',
            'tipo_logica': 'inferencia',
            'umbral_aprobacion': 60,
            'activa': True,
            'preguntas': [
                {
                    'pregunta': '¿Qué regla de inferencia permite concluir Q a partir de P → Q y P?',
                    'opciones': [
                        'Modus Tollens (MT)',
                        'Silogismo Disyuntivo (SD)',
                        'Modus Ponens (MP)',
                        'Adición'
                    ],
                    'respuesta_correcta': 'Modus Ponens (MP)'
                },
                {
                    'pregunta': 'A partir de "P → Q" y "¬Q", ¿qué regla nos permite deducir "¬P"?',
                    'opciones': [
                        'Modus Ponens (MP)',
                        'Modus Tollens (MT)',
                        'Simplificación',
                        'Silogismo Hipotético'
                    ],
                    'respuesta_correcta': 'Modus Tollens (MT)'
                },
                {
                    'pregunta': '¿Qué regla de deducción nos permite concluir P → R si sabemos que P → Q y Q → R?',
                    'opciones': [
                        'Dilema Constructivo',
                        'Silogismo Hipotético (SH)',
                        'Modus Ponens',
                        'Conjunción'
                    ],
                    'respuesta_correcta': 'Silogismo Hipotético (SH)'
                },
                {
                    'pregunta': 'Si tenemos la premisa "P ∨ Q" y también sabemos "¬P", ¿qué concluimos por Silogismo Disyuntivo?',
                    'opciones': ['¬Q', 'P ∧ Q', 'Q', 'P'],
                    'respuesta_correcta': 'Q'
                }
            ]
        }
    ]

    for item in evaluaciones:
        if not Evaluacion.objects.filter(titulo=item['titulo']).exists():
            # Contar total preguntas
            total_preguntas = len(item['preguntas'])
            Evaluacion.objects.create(
                titulo=item['titulo'],
                descripcion=item['descripcion'],
                tipo_logica=item['tipo_logica'],
                preguntas=item['preguntas'],
                umbral_aprobacion=item['umbral_aprobacion'],
                activa=item['activa']
            )
            print(f"Evaluación creada: {item['titulo']}")

if __name__ == '__main__':
    print("Iniciando carga de evaluaciones semilla...")
    seed_evaluations()
    print("¡Finalizado!")
