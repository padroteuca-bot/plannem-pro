import json
import random
import os

# --- CONTEXTO METODOLÓGICO DE LA NEM ---
# Estas estructuras se basan exactamente en los momentos oficiales dictados por la SEP para cada Campo Formativo.

METODOLOGIAS = {
    "lenguajes": [
        "1. Identificación", "2. Recuperación", "3. Planificación",
        "4. Acercamiento", "5. Comprensión y producción", "6. Reconocimiento",
        "7. Concreción", "8. Integración", "9. Difusión", 
        "10. Consideraciones", "11. Avances"
    ],
    "saberes": [
        "Introducción al tema / Conocimientos previos", 
        "Diseño de investigación / Formulación de preguntas",
        "Organizar y estructurar las respuestas", 
        "Presentación de resultados", 
        "Metacognición / Reflexión"
    ],
    "etica": [
        "Presentemos", "Recolectemos", "Formulemos el problema",
        "Organicemos la experiencia", "Vivamos la experiencia", 
        "Resultados y análisis"
    ],
    "humano": [
        "Punto de partida", "Lo que sé y lo que quiero saber",
        "Organicemos las actividades", "Creatividad en marcha",
        "Compartimos y evaluamos lo aprendido"
    ]
}

# --- DIFERENCIACIÓN COGNITIVA POR FASES (Respondiendo a tu pregunta) ---
# Aquí definimos cómo se distingue cada fase en términos de la complejidad de los productos y verbos.
DIFERENCIACION_FASE = {
    3: { # 1° y 2° de Primaria
        "verbos": ["Dibujar", "Identificar", "Describir oralmente", "Agrupar", "Explorar", "Reconocer", "Recortar"],
        "productos": ["Cartel con dibujos", "Cuento ilustrado", "Maqueta sencilla", "Exposición oral breve", "Collage"],
        "tiempos": ["20", "30", "15"], # Tiempos más cortos de atención
        "adjetivos": ["divertido", "colorido", "con ayuda del docente", "en círculo", "en parejas"]
    },
    4: { # 3° y 4° de Primaria
        "verbos": ["Redactar", "Clasificar", "Entrevistar", "Medir", "Comparar", "Investigar en biblioteca", "Organizar"],
        "productos": ["Periódico mural", "Folleto informativo", "Experimento demostrativo", "Obra de teatro escolar", "Línea del tiempo"],
        "tiempos": ["30", "45", "20"],
        "adjetivos": ["en equipos", "con organizadores gráficos", "consultando el libro de texto", "en el patio"]
    },
    5: { # 5° y 6° de Primaria
        "verbos": ["Argumentar", "Analizar", "Debatir", "Proyectar", "Diseñar", "Sintetizar", "Comprobar"],
        "productos": ["Ensayo argumentativo", "Campaña de concientización", "Feria de ciencias", "Debate formal", "Podcast escolar", "Reporte de investigación"],
        "tiempos": ["45", "60", "30"],
        "adjetivos": ["de forma autónoma", "utilizando herramientas digitales", "con asamblea grupal", "analizando gráficas"]
    },
    6: { # 1°, 2° y 3° de Secundaria
        "verbos": ["Criticar", "Sistematizar", "Intervenir", "Prototipar", "Cuestionar", "Evaluar", "Modelar matemática/físicamente"],
        "productos": ["Prototipo funcional", "Artículo de divulgación", "Intervención comunitaria", "Feria interdisciplinaria", "Foro de discusión abierto", "Panel de expertos"],
        "tiempos": ["50", "90", "40"],
        "adjetivos": ["mediante investigación de campo", "aplicando pensamiento crítico", "con encuestas a la comunidad", "mediante laboratorios"]
    }
}

# --- MATERIAS Y TEMÁTICAS BASE ---
TEMATICAS = {
    "lenguajes": [
        ("Nuestras tradiciones vivas", "Pérdida de identidad cultural y tradiciones."),
        ("El poder de las historias", "Dificultad en la comprensión y redacción narrativa."),
        ("Voces de mi comunidad", "Falta de reconocimiento a los saberes comunitarios y lenguas originarias."),
        ("Medios de comunicación responsables", "Consumo acrítico de información falsa o amarillista."),
        ("Poesía y emociones", "Dificultad para expresar emociones a través del lenguaje estético.")
    ],
    "saberes": [
        ("Cuidado del agua en mi escuela", "Desperdicio excesivo de recursos hídricos en la institución."),
        ("Las matemáticas de las compras", "Dificultad para aplicar operaciones básicas y fracciones en la vida real."),
        ("Mi cuerpo funciona", "Desconocimiento de hábitos de higiene y sistemas del cuerpo humano."),
        ("El clima está cambiando", "Falta de conciencia sobre el impacto del cambio climático en la localidad."),
        ("Nutrición en mi lonchera", "Consumo elevado de comida chatarra frente a opciones saludables.")
    ],
    "etica": [
        ("Conociendo nuestras raíces históricas", "Desconexión con los hechos históricos que formaron nuestra identidad."),
        ("Igualdad en el patio de juegos", "Casos de exclusión y falta de equidad de género en el recreo."),
        ("Cuidando nuestros ecosistemas locales", "Contaminación por basura en los parques y calles cercanas."),
        ("Derechos de los niños y niñas", "Desconocimiento de los derechos humanos y mecanismos de protección."),
        ("Reglas de convivencia", "Falta de acuerdos y violencia escolar leve.")
    ],
    "humano": [
        ("Juegos tradicionales en movimiento", "Sedentarismo excesivo debido al uso de tecnología."),
        ("Conociendo y manejando el enojo", "Poca inteligencia emocional que deriva en conflictos áulicos."),
        ("Mi proyecto de vida", "Falta de metas a futuro y desmotivación académica."),
        ("Habilidades para la paz", "Falta de habilidades de diálogo y mediación."),
        ("Alimentación e imagen corporal", "Baja autoestima e influencia negativa de los estándares estéticos.")
    ]
}

MESES = ["general", "septiembre", "octubre", "noviembre", "diciembre", "enero", "febrero", "marzo", "abril", "mayo", "junio"]

def generar_actividades(campo, fase):
    momentos = METODOLOGIAS[campo]
    diff = DIFERENCIACION_FASE[fase]
    actividades = []
    
    for momento in momentos:
        # Generar aleatoriamente actividades con verbos y tiempos de acuerdo a la fase
        v_inicio = random.choice(diff["verbos"])
        v_des = random.choice(diff["verbos"])
        v_cierre = random.choice(diff["verbos"])
        adj = random.choice(diff["adjetivos"])
        
        actividades.append({
            "momento": momento,
            "tipo": "Inicio",
            "descripcion": f"{v_inicio} los conceptos principales {adj}.",
            "tiempo": random.choice(diff["tiempos"])
        })
        actividades.append({
            "momento": momento,
            "tipo": "Desarrollo",
            "descripcion": f"{v_des} a fondo utilizando los materiales provistos {adj}.",
            "tiempo": random.choice(diff["tiempos"])
        })
        actividades.append({
            "momento": momento,
            "tipo": "Cierre",
            "descripcion": f"{v_cierre} para reflexionar lo aprendido.",
            "tiempo": random.choice(diff["tiempos"])
        })
    return actividades

def generar_rubrica(fase):
    return {
        "instrumento": "Rúbrica" if fase >= 4 else "Lista de cotejo",
        "criterios": [
            {
                "criterio": "Comprensión del tema central",
                "excelente": "Logra explicar claramente los conceptos y los aplica.",
                "bueno": "Explica la mayoría de los conceptos con poca ayuda.",
                "suficiente": "Requiere apoyo constante para explicar."
            },
            {
                "criterio": "Participación y Trabajo Colaborativo",
                "excelente": "Colabora activamente asumiendo roles.",
                "bueno": "Participa pero se distrae ocasionalmente.",
                "suficiente": "Trabaja aislado o evita participar."
            },
            {
                "criterio": "Calidad del Producto Final",
                "excelente": "El producto cumple todos los requisitos solicitados.",
                "bueno": "El producto omite uno o dos detalles.",
                "suficiente": "El producto está incompleto."
            }
        ]
    }

def construir_json_masivo():
    # Estructura: { fase (str): { campo (str): { mes (str): [ proyectos... ] } } }
    base_de_datos = {}
    
    for fase in [3, 4, 5, 6]:
        fase_str = str(fase)
        base_de_datos[fase_str] = {}
        for campo in ["lenguajes", "saberes", "etica", "humano"]:
            base_de_datos[fase_str][campo] = {}
            for mes in MESES:
                base_de_datos[fase_str][campo][mes] = []
            
            # Generar 100 proyectos para este campo/fase, distribuidos en los meses
            for i in range(110): # Generaremos 110 para asegurar más de 100
                tema, problematica = random.choice(TEMATICAS[campo])
                producto = random.choice(DIFERENCIACION_FASE[fase]["productos"])
                mes = random.choice(MESES)
                
                proyecto = {
                    "titulo": f"{tema} ({i+1}) - Enfoque Fase {fase}",
                    "problematica": problematica,
                    "justificacion": f"Es fundamental intervenir pedagógicamente porque los alumnos de Fase {fase} requieren consolidar habilidades vinculadas a este tema.",
                    "producto_final": producto,
                    "ejes_articuladores": random.sample(["Inclusión", "Pensamiento crítico", "Interculturalidad crítica", "Vida saludable", "Apropiación de las culturas a través de la lectura y la escritura"], 2),
                    "pdas": [f"PDA sugerido automático Nivel Fase {fase}"], # Frontend can map them
                    "actividades": generar_actividades(campo, fase),
                    "rubrica": generar_rubrica(fase)
                }
                
                base_de_datos[fase_str][campo][mes].append(proyecto)
                
    # Guardar en archivo
    filepath = os.path.join(os.path.dirname(__file__), "nem_massive_templates.json")
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(base_de_datos, f, ensure_ascii=False, indent=2)
    print(f"✅ ¡Generación exitosa! Se ha creado la base de datos masiva en: {filepath}")

if __name__ == "__main__":
    construir_json_masivo()
