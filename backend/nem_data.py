FASES_GRADOS = {
    3: {"nombre": "Fase 3", "nivel": "Primaria", "grados": ["1°", "2°"], "descripcion": "Primaria baja"},
    4: {"nombre": "Fase 4", "nivel": "Primaria", "grados": ["3°", "4°"], "descripcion": "Primaria media"},
    5: {"nombre": "Fase 5", "nivel": "Primaria", "grados": ["5°", "6°"], "descripcion": "Primaria alta"},
    6: {"nombre": "Fase 6", "nivel": "Secundaria", "grados": ["1°", "2°", "3°"], "descripcion": "Secundaria"}
}

CAMPOS_FORMATIVOS = {
    "lenguajes": {
        "nombre": "Lenguajes",
        "disciplinas": ["Español", "Inglés", "Artes"],
        "metodologia": {
            "nombre": "Aprendizaje Basado en Proyectos Comunitarios (ABPC)",
            "fases": [
                {"nombre": "Planeación", "momentos": [
                    {"num": 1, "nombre": "Identificación", "descripcion": "Planteamiento del problema comunitario"},
                    {"num": 2, "nombre": "Recuperación", "descripcion": "Saberes previos: ¿qué sabemos?"},
                    {"num": 3, "nombre": "Planificación", "descripcion": "Actividades, tiempos, responsables, productos"}
                ]},
                {"nombre": "Acción", "momentos": [
                    {"num": 4, "nombre": "Acercamiento", "descripcion": "Exploración e investigación"},
                    {"num": 5, "nombre": "Comprensión y producción", "descripcion": "Desarrollo de contenidos y producciones"},
                    {"num": 6, "nombre": "Reconocimiento", "descripcion": "Valorar avances y ajustes"},
                    {"num": 7, "nombre": "Concreción", "descripcion": "Primera versión del producto + retroalimentación"}
                ]},
                {"nombre": "Intervención", "momentos": [
                    {"num": 8, "nombre": "Integración", "descripcion": "Exposición y retroalimentación final"},
                    {"num": 9, "nombre": "Difusión", "descripcion": "Compartir con la comunidad"},
                    {"num": 10, "nombre": "Consideraciones", "descripcion": "Instrumentos de seguimiento"},
                    {"num": 11, "nombre": "Avances", "descripcion": "Evaluación para proyectos futuros"}
                ]}
            ]
        }
    },
    "saberes": {
        "nombre": "Saberes y Pensamiento Científico",
        "disciplinas": ["Matemáticas", "Ciencias Naturales", "Tecnología"],
        "metodologia": {
            "nombre": "Aprendizaje Basado en Indagación (STEAM)",
            "fases": [
                {"num": 1, "nombre": "Introducción al tema", "descripcion": "Conocimientos previos e identificación de la problemática"},
                {"num": 2, "nombre": "Diseño de investigación", "descripcion": "Formulación de preguntas, planificación"},
                {"num": 3, "nombre": "Organizar y estructurar", "descripcion": "Sistematización de datos, análisis"},
                {"num": 4, "nombre": "Presentación de resultados", "descripcion": "Exposición de hallazgos, argumentación"},
                {"num": 5, "nombre": "Metacognición", "descripcion": "Reflexión individual, equipo y grupal"}
            ]
        }
    },
    "etica": {
        "nombre": "Ética, Naturaleza y Sociedades",
        "disciplinas": ["Historia", "Geografía", "Formación Cívica y Ética"],
        "metodologia": {
            "nombre": "Aprendizaje Basado en Problemas (ABP)",
            "fases": [
                {"num": 1, "nombre": "Presentemos", "descripcion": "Reflexión inicial, disparadores"},
                {"num": 2, "nombre": "Recolectemos", "descripcion": "Exploración de saberes previos"},
                {"num": 3, "nombre": "Formulemos el problema", "descripcion": "Definición clara del problema"},
                {"num": 4, "nombre": "Organicemos la experiencia", "descripcion": "Plan de acción: objetivos, recursos, tiempos"},
                {"num": 5, "nombre": "Vivamos la experiencia", "descripcion": "Ejecución e indagación"},
                {"num": 6, "nombre": "Resultados y análisis", "descripcion": "Revisión de hallazgos y divulgación"}
            ]
        }
    },
    "humano": {
        "nombre": "De lo Humano y lo Comunitario",
        "disciplinas": ["Educación Física", "Vida Saludable", "Educación Socioemocional"],
        "metodologia": {
            "nombre": "Aprendizaje Servicio (AS)",
            "fases": [
                {"num": 1, "nombre": "Punto de partida", "descripcion": "Identificación de problemática comunitaria"},
                {"num": 2, "nombre": "Lo que sé y lo que quiero saber", "descripcion": "Diagnóstico y saberes previos"},
                {"num": 3, "nombre": "Organicemos las actividades", "descripcion": "Planificación de acciones y recursos"},
                {"num": 4, "nombre": "Creatividad en marcha", "descripcion": "Ejecución y monitoreo"},
                {"num": 5, "nombre": "Compartimos y evaluamos", "descripcion": "Presentación y evaluación del impacto"}
            ]
        }
    }
}

EJES_ARTICULADORES = [
    "Inclusión", 
    "Pensamiento crítico", 
    "Interculturalidad crítica", 
    "Igualdad de género", 
    "Vida saludable", 
    "Apropiación de las culturas a través de la lectura y la escritura", 
    "Artes y experiencias estéticas"
]

CONTENIDOS_PDA = {
    3: {  # Fase 3 (1° y 2° Primaria)
        "lenguajes": [
            {
                "contenido": "Uso de narraciones de la tradición oral de la comunidad",
                "pdas": [
                    "Narra de forma oral experiencias personales y comunitarias",
                    "Identifica la estructura de textos narrativos sencillos",
                    "Escribe textos breves a partir de sus vivencias"
                ]
            },
            {
                "contenido": "Exploración de la diversidad de lenguas en su comunidad",
                "pdas": [
                    "Reconoce que existen diferentes formas de nombrar las cosas",
                    "Participa en juegos de palabras en diversas lenguas",
                    "Valora la riqueza lingüística de su entorno"
                ]
            },
            {
                "contenido": "Expresión artística y apreciación de manifestaciones estéticas",
                "pdas": [
                    "Explora materiales y técnicas de artes visuales",
                    "Expresa emociones mediante lenguajes artísticos",
                    "Aprecia manifestaciones artísticas de su comunidad"
                ]
            }
        ],
        "saberes": [
            {
                "contenido": "Estudio de los números y suma y resta",
                "pdas": [
                    "Cuenta objetos y elementos de su entorno",
                    "Resuelve problemas de suma y resta con objetos reales",
                    "Identifica el valor posicional en números de dos cifras"
                ]
            },
            {
                "contenido": "Conocimiento del cuerpo humano y sus cuidados",
                "pdas": [
                    "Identifica las partes externas del cuerpo humano",
                    "Comprende la importancia de la higiene personal",
                    "Reconoce medidas de prevención de accidentes"
                ]
            },
            {
                "contenido": "Exploración de fenómenos naturales",
                "pdas": [
                    "Observa y describe cambios en el clima",
                    "Identifica características de plantas y animales de su entorno",
                    "Formula preguntas sobre cómo funcionan las cosas"
                ]
            }
        ],
        "etica": [
            {
                "contenido": "La familia como espacio de protección, cuidado y afecto",
                "pdas": [
                    "Reconoce la importancia de la familia",
                    "Identifica responsabilidades en el hogar",
                    "Expresa cómo se siente en su familia"
                ]
            },
            {
                "contenido": "Historia de la comunidad y costumbres",
                "pdas": [
                    "Narra historias de su comunidad",
                    "Identifica costumbres y tradiciones locales",
                    "Compara objetos del pasado y del presente"
                ]
            },
            {
                "contenido": "Cuidado de los ecosistemas",
                "pdas": [
                    "Identifica problemas ambientales en su entorno",
                    "Participa en acciones para cuidar el medio ambiente",
                    "Reconoce a los seres vivos y sus necesidades"
                ]
            }
        ],
        "humano": [
            {
                "contenido": "Desarrollo de habilidades motrices",
                "pdas": [
                    "Explora diferentes formas de movimiento",
                    "Participa en juegos colectivos",
                    "Mantiene el equilibrio en situaciones lúdicas"
                ]
            },
            {
                "contenido": "Reconocimiento y gestión de emociones",
                "pdas": [
                    "Identifica emociones básicas en sí mismo y en otros",
                    "Expresa sus emociones de manera asertiva",
                    "Muestra empatía ante las emociones de sus compañeros"
                ]
            },
            {
                "contenido": "Hábitos de vida saludable",
                "pdas": [
                    "Reconoce alimentos saludables y comida chatarra",
                    "Practica el lavado de manos correctamente",
                    "Comprende la importancia del descanso y la actividad física"
                ]
            }
        ]
    },
    # Para brevedad, el resto de fases (4, 5, 6) pueden ser pobladas con datos similares
    4: { # Fase 4 (3° y 4° Primaria)
        "lenguajes": [
            {
                "contenido": "Análisis de textos informativos",
                "pdas": ["Identifica la idea principal de un texto informativo", "Elabora resúmenes breves", "Usa fuentes de información para investigar un tema"]
            }
        ],
        "saberes": [
            {
                "contenido": "Multiplicación y división",
                "pdas": ["Resuelve problemas de multiplicación", "Comprende la relación entre multiplicación y división", "Utiliza algoritmos convencionales"]
            }
        ],
        "etica": [
            {
                "contenido": "Historia de la entidad federativa",
                "pdas": ["Identifica los primeros habitantes de su entidad", "Reconoce cambios en el paisaje a lo largo del tiempo", "Valora el patrimonio cultural"]
            }
        ],
        "humano": [
            {
                "contenido": "Resolución de conflictos",
                "pdas": ["Identifica causas de los conflictos", "Propone soluciones pacíficas", "Practica el diálogo respetuoso"]
            }
        ]
    },
    5: { # Fase 5 (5° y 6° Primaria)
        "lenguajes": [
             {
                "contenido": "Textos argumentativos y artículos de opinión",
                "pdas": ["Estructura un texto argumentativo", "Expresa una opinión fundamentada", "Diferencia entre hechos y opiniones"]
             }
        ],
        "saberes": [
             {
                "contenido": "Fracciones y decimales",
                "pdas": ["Resuelve problemas con fracciones", "Opera con números decimales", "Aplica porcentajes en situaciones reales"]
             }
        ],
        "etica": [
             {
                "contenido": "México y el mundo",
                "pdas": ["Ubica a México en el contexto mundial", "Analiza problemas globales", "Reconoce la diversidad cultural del mundo"]
             }
        ],
        "humano": [
             {
                "contenido": "Proyecto de vida",
                "pdas": ["Establece metas a corto y mediano plazo", "Identifica fortalezas y áreas de oportunidad", "Toma decisiones responsables"]
             }
        ]
    },
    6: { # Fase 6 (Secundaria)
        "lenguajes": [
             {
                "contenido": "La diversidad de lenguas y su uso en la comunicación familiar, escolar y comunitaria",
                "pdas": ["Reconoce la riqueza lingüística de México", "Analiza el uso de la lengua en distintos contextos", "Valora la importancia de preservar las lenguas indígenas"]
             }
        ],
        "saberes": [
             {
                "contenido": "Ecuaciones lineales y cuadráticas",
                "pdas": ["Resuelve ecuaciones de primer grado", "Plantea problemas usando álgebra", "Grafica funciones lineales"]
             }
        ],
        "etica": [
             {
                "contenido": "Las revoluciones modernas y sus tendencias",
                "pdas": ["Analiza las causas de la Revolución Francesa", "Comprende el impacto de la Revolución Industrial", "Relaciona eventos históricos con el presente"]
             }
        ],
        "humano": [
             {
                "contenido": "Sexualidad y equidad de género",
                "pdas": ["Reconoce los derechos sexuales y reproductivos", "Promueve la equidad de género", "Toma decisiones informadas sobre su cuerpo"]
             }
        ]
    }
}

INSTRUMENTOS_EVALUACION = [
    "Rúbrica", 
    "Lista de cotejo", 
    "Portafolio de evidencias", 
    "Diario de clase", 
    "Registro anecdótico", 
    "Escala de actitudes", 
    "Guía de observación"
]

TIPOS_EVALUACION = ["Diagnóstica", "Formativa", "Sumativa"]

ESCENARIOS = ["Aula", "Escuela", "Comunidad"]
