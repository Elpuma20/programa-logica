import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'plataforma.settings')
django.setup()

from logica.models import ContenidoLogico

def seed_more_contents():
    print("=== INICIANDO CONFIGURACIÓN DE CONTENIDOS ADICIONALES ===")
    
    contenidos = [
        # --- TRIVIAS ---
        {
            'tipo': 'trivia',
            'titulo': 'Bicondicional y Equivalencia',
            'descripcion': '¿Qué conectivo lógico representa la doble implicación o equivalencia ("si y solo si")?',
            'respuesta': '↔',
            'opciones': ['∧', '∨', '↔', '→'],
            'dificultad': 'facil',
            'activo': True
        },
        {
            'tipo': 'trivia',
            'titulo': 'Leyes de De Morgan',
            'descripcion': 'De acuerdo con las leyes de De Morgan, ¿a qué es equivalente la negación de una conjunción: ¬(P ∧ Q)?',
            'respuesta': '¬P ∨ ¬Q',
            'opciones': ['¬P ∨ ¬Q', '¬P ∧ ¬Q', 'P ∨ Q', '¬P ∨ Q'],
            'dificultad': 'medio',
            'activo': True
        },
        {
            'tipo': 'trivia',
            'titulo': 'Regla de Silogismo Hipotético',
            'descripcion': 'Si sabemos que "P → Q" (Si P entonces Q) y "Q → R" (Si Q entonces R), ¿qué conclusión lógica podemos deducir de forma directa?',
            'respuesta': 'P → R',
            'opciones': ['P → R', 'P ∧ R', '¬P', 'Q → P'],
            'dificultad': 'medio',
            'activo': True
        },
        
        # --- ADIVINANZAS ---
        {
            'tipo': 'adivinanza',
            'titulo': 'El Enigma del Silencio',
            'descripcion': 'Si me nombras, me rompes o desaparezco de inmediato. ¿Qué soy?',
            'respuesta': 'El silencio',
            'dificultad': 'facil',
            'activo': True
        },
        {
            'tipo': 'adivinanza',
            'titulo': 'El Misterio del Carbón',
            'descripcion': 'Negro cuando lo compras, rojo y brillante cuando lo usas, y gris ceniza cuando lo tiras a la basura. ¿Qué es?',
            'respuesta': 'El carbón',
            'dificultad': 'medio',
            'activo': True
        },
        {
            'tipo': 'adivinanza',
            'titulo': 'Las Casillas Cuadradas',
            'descripcion': 'Tengo sesenta y cuatro casillas blancas y negras bien ordenadas, pero no tengo ninguna habitación. ¿Qué soy?',
            'respuesta': 'El ajedrez',
            'dificultad': 'facil',
            'activo': True
        },

        # --- PARADOJAS ---
        {
            'tipo': 'paradoja',
            'titulo': 'La Paradoja del Mentiroso',
            'descripcion': 'Si digo "Esta frase es una mentira", ¿estoy diciendo la verdad o estoy mintiendo?',
            'respuesta': 'Si es verdadera, entonces es mentira; si es mentira, entonces es verdadera. Es una contradicción lógica sin valor de verdad estable.',
            'dificultad': 'dificil',
            'activo': True
        },
        {
            'tipo': 'paradoja',
            'titulo': 'La Paradoja del Barbero',
            'descripcion': 'Un barbero en un pueblo afeita a todos los hombres que no se afeitan a sí mismos, y solo a ellos. ¿Debe el barbero afeitarse a sí mismo?',
            'respuesta': 'Si se afeita a sí mismo, viola la regla de afeitar solo a quienes no lo hacen. Si no se afeita, debe afearse por definición. Es una contradicción.',
            'dificultad': 'dificil',
            'activo': True
        },
        {
            'tipo': 'paradoja',
            'titulo': 'La Paradoja de Aquiles y la Tortuga',
            'descripcion': 'Aquiles compite contra una tortuga dándole ventaja inicial. Cada vez que Aquiles llega al punto donde estaba la tortuga, esta ha avanzado un poco. ¿Podrá alcanzarla matemáticamente según Zenón?',
            'respuesta': 'Teóricamente requiere recorrer infinitos puntos en un tiempo finito, lo que planteaba un dilema sobre la divisibilidad infinita del espacio.',
            'dificultad': 'medio',
            'activo': True
        },

        # --- ROMPECABEZAS ---
        {
            'tipo': 'rompecabezas',
            'titulo': 'Secuencia de Fibonacci',
            'descripcion': 'Determina la secuencia lógica: 1, 1, 2, 3, 5, 8, 13... ¿Cuál es el siguiente número?',
            'respuesta': '21',
            'dificultad': 'facil',
            'activo': True,
            'imagen': 'logica/fibonacci_spiral.png'
        },
        {
            'tipo': 'rompecabezas',
            'titulo': 'La Adivinanza de los Gatos',
            'descripcion': 'Si tres gatos cazan tres ratones en exactamente tres minutos, ¿cuántos minutos tardarán cien gatos en cazar cien ratones?',
            'respuesta': '3',
            'dificultad': 'medio',
            'activo': True,
            'imagen': 'logica/three_cats.png'
        },
        {
            'tipo': 'rompecabezas',
            'titulo': 'Operaciones Cruzadas',
            'descripcion': 'Descubre la regla lógica: Si 1+4 = 5, 2+5 = 12, 3+6 = 21... ¿Cuánto es el resultado de 8+11?',
            'respuesta': '96',
            'dificultad': 'dificil',
            'activo': True,
            'imagen': 'logica/math_matrix.png'
        }
    ]

    for item in contenidos:
        obj, created = ContenidoLogico.objects.update_or_create(
            titulo=item['titulo'],
            defaults={
                'tipo': item['tipo'],
                'descripcion': item['descripcion'],
                'respuesta': item['respuesta'],
                'opciones': item.get('opciones'),
                'dificultad': item['dificultad'],
                'activo': item['activo'],
                'imagen': item.get('imagen')
            }
        )
        if created:
            print(f"  [+] Creado contenido: {obj.titulo} ({obj.tipo})")
        else:
            print(f"  [*] Actualizado contenido: {obj.titulo} ({obj.tipo})")
            
    print("=== CONFIGURACIÓN DE CONTENIDOS ADICIONALES FINALIZADA ===")

if __name__ == '__main__':
    seed_more_contents()
