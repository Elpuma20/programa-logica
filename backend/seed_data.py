import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'plataforma.settings')
django.setup()

from logica.models import ContenidoLogico

def seed_data():
    data = [
        {
            'tipo': 'trivia',
            'titulo': 'Lógica de Proposiciones',
            'descripcion': '¿Cuál de los siguientes conectivos representa la conjunción?',
            'respuesta': '∧',
            'opciones': ['∧', '∨', '¬', '→'],
            'dificultad': 'facil'
        },
        {
            'tipo': 'adivinanza',
            'titulo': 'El Enigma del Tiempo',
            'descripcion': 'Siempre estoy en tu futuro, pero nunca llegas a mí. ¿Qué soy?',
            'respuesta': 'El mañana',
            'dificultad': 'medio'
        },
        {
            'tipo': 'rompecabezas',
            'titulo': 'Secuencia Numérica',
            'descripcion': 'Sigue la lógica: 2, 4, 8, 16... ¿Cuál es el siguiente número?',
            'respuesta': '32',
            'dificultad': 'facil'
        },
        {
            'tipo': 'paradoja',
            'titulo': 'La Paradoja de Epiménides',
            'descripcion': 'Un cretense dice: "Todos los cretenses son mentirosos". Si dice la verdad, miente.',
            'respuesta': 'Es una paradoja de autorreferencia circular que desafía los valores de verdad simples.',
            'dificultad': 'dificil'
        }
    ]
    
    for item in data:
        if not ContenidoLogico.objects.filter(titulo=item['titulo']).exists():
            ContenidoLogico.objects.create(**item)
            print(f"Sedeado: {item['titulo']}")

if __name__ == "__main__":
    seed_data()
