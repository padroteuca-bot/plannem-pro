window.NEM = {
    FASES: {
        3: { nombre: "Fase 3", grados: ["1°", "2°"], nivel: "Primaria" },
        4: { nombre: "Fase 4", grados: ["3°", "4°"], nivel: "Primaria" },
        5: { nombre: "Fase 5", grados: ["5°", "6°"], nivel: "Primaria" },
        6: { nombre: "Fase 6", grados: ["1°", "2°", "3°"], nivel: "Secundaria" }
    },
    
    CAMPOS: {
        lenguajes: {
            nombre: "Lenguajes",
            metodologia: {
                nombre: "Aprendizaje Basado en Proyectos Comunitarios (ABPC)",
                fases: [
                    { nombre: "Fase 1: Planeación", momentos: ["1. Identificación", "2. Recuperación", "3. Planificación"] },
                    { nombre: "Fase 2: Acción", momentos: ["4. Acercamiento", "5. Comprensión y producción", "6. Reconocimiento", "7. Concreción"] },
                    { nombre: "Fase 3: Intervención", momentos: ["8. Integración", "9. Difusión", "10. Consideraciones", "11. Avances"] }
                ]
            }
        },
        saberes: {
            nombre: "Saberes y Pensamiento Científico",
            metodologia: {
                nombre: "Aprendizaje Basado en Indagación (STEAM)",
                fases: [
                    { nombre: "Fase 1", momentos: ["Introducción al tema / Conocimientos previos"] },
                    { nombre: "Fase 2", momentos: ["Diseño de investigación / Formulación de preguntas"] },
                    { nombre: "Fase 3", momentos: ["Organizar y estructurar las respuestas"] },
                    { nombre: "Fase 4", momentos: ["Presentación de resultados"] },
                    { nombre: "Fase 5", momentos: ["Metacognición / Reflexión"] }
                ]
            }
        },
        etica: {
            nombre: "Ética, Naturaleza y Sociedades",
            metodologia: {
                nombre: "Aprendizaje Basado en Problemas (ABP)",
                fases: [
                    { nombre: "Momento 1", momentos: ["Presentemos"] },
                    { nombre: "Momento 2", momentos: ["Recolectemos"] },
                    { nombre: "Momento 3", momentos: ["Formulemos el problema"] },
                    { nombre: "Momento 4", momentos: ["Organicemos la experiencia"] },
                    { nombre: "Momento 5", momentos: ["Vivamos la experiencia"] },
                    { nombre: "Momento 6", momentos: ["Resultados y análisis"] }
                ]
            }
        },
        humano: {
            nombre: "De lo Humano y lo Comunitario",
            metodologia: {
                nombre: "Aprendizaje Servicio (AS)",
                fases: [
                    { nombre: "Etapa 1", momentos: ["Punto de partida"] },
                    { nombre: "Etapa 2", momentos: ["Lo que sé y lo que quiero saber"] },
                    { nombre: "Etapa 3", momentos: ["Organicemos las actividades"] },
                    { nombre: "Etapa 4", momentos: ["Creatividad en marcha"] },
                    { nombre: "Etapa 5", momentos: ["Compartimos y evaluamos lo aprendido"] }
                ]
            }
        }
    },
    
    EJES: [
        "Inclusión", 
        "Pensamiento crítico", 
        "Interculturalidad crítica", 
        "Igualdad de género", 
        "Vida saludable", 
        "Apropiación de las culturas a través de la lectura y la escritura", 
        "Artes y experiencias estéticas"
    ],
    
    CONTENIDOS: {
        3: {
            lenguajes: [
                { id: "L3_1", texto: "Uso de narraciones de la tradición oral de la comunidad", pdas: ["Narra de forma oral experiencias personales", "Identifica estructura de textos narrativos", "Escribe textos breves"] },
                { id: "L3_2", texto: "Exploración de la diversidad de lenguas", pdas: ["Reconoce diferentes formas de nombrar cosas", "Participa en juegos de palabras", "Valora la riqueza lingüística"] }
            ],
            saberes: [
                { id: "S3_1", texto: "Estudio de los números y suma y resta", pdas: ["Cuenta objetos del entorno", "Resuelve problemas de suma y resta", "Identifica valor posicional"] },
                { id: "S3_2", texto: "Conocimiento del cuerpo humano y cuidados", pdas: ["Identifica partes externas del cuerpo", "Comprende higiene personal", "Reconoce medidas de prevención"] }
            ],
            etica: [
                { id: "E3_1", texto: "La familia como espacio de protección", pdas: ["Reconoce importancia de la familia", "Identifica responsabilidades", "Expresa sentimientos familiares"] },
                { id: "E3_2", texto: "Cuidado de los ecosistemas", pdas: ["Identifica problemas ambientales", "Participa en acciones ecológicas", "Reconoce seres vivos"] }
            ],
            humano: [
                { id: "H3_1", texto: "Desarrollo de habilidades motrices", pdas: ["Explora formas de movimiento", "Participa en juegos colectivos", "Mantiene equilibrio"] },
                { id: "H3_2", texto: "Reconocimiento y gestión de emociones", pdas: ["Identifica emociones básicas", "Expresa emociones asertivamente", "Muestra empatía"] }
            ]
        },
        4: {
            lenguajes: [
                { id: "L4_1", texto: "Análisis de textos informativos", pdas: ["Identifica idea principal", "Elabora resúmenes", "Usa fuentes de información"] }
            ],
            saberes: [
                { id: "S4_1", texto: "Multiplicación y división", pdas: ["Resuelve problemas de multiplicación", "Comprende relación multiplicación-división", "Usa algoritmos convencionales"] }
            ],
            etica: [
                { id: "E4_1", texto: "Historia de la entidad federativa", pdas: ["Identifica primeros habitantes", "Reconoce cambios en el paisaje", "Valora patrimonio cultural"] }
            ],
            humano: [
                { id: "H4_1", texto: "Resolución de conflictos", pdas: ["Identifica causas", "Propone soluciones pacíficas", "Practica diálogo"] }
            ]
        },
        5: {
            lenguajes: [
                { id: "L5_1", texto: "Textos argumentativos y artículos de opinión", pdas: ["Estructura texto argumentativo", "Expresa opinión fundamentada", "Diferencia hechos de opiniones"] }
            ],
            saberes: [
                { id: "S5_1", texto: "Fracciones y decimales", pdas: ["Resuelve problemas con fracciones", "Opera con decimales", "Aplica porcentajes"] }
            ],
            etica: [
                { id: "E5_1", texto: "México y el mundo", pdas: ["Ubica a México en contexto mundial", "Analiza problemas globales", "Reconoce diversidad cultural"] }
            ],
            humano: [
                { id: "H5_1", texto: "Proyecto de vida", pdas: ["Establece metas", "Identifica fortalezas", "Toma decisiones"] }
            ]
        },
        6: {
            lenguajes: [
                { id: "L6_1", texto: "La diversidad de lenguas", pdas: ["Reconoce riqueza lingüística", "Analiza uso de la lengua", "Valora lenguas indígenas"] }
            ],
            saberes: [
                { id: "S6_1", texto: "Ecuaciones lineales y cuadráticas", pdas: ["Resuelve ecuaciones 1er grado", "Plantea problemas algebraicos", "Grafica funciones"] }
            ],
            etica: [
                { id: "E6_1", texto: "Revoluciones modernas", pdas: ["Analiza Revolución Francesa", "Comprende Revolución Industrial", "Relaciona eventos históricos"] }
            ],
            humano: [
                { id: "H6_1", texto: "Sexualidad y equidad de género", pdas: ["Reconoce derechos", "Promueve equidad", "Toma decisiones informadas"] }
            ]
        }
    },
    
    INSTRUMENTOS: [
        "Rúbrica", "Lista de cotejo", "Portafolio de evidencias", 
        "Diario de clase", "Registro anecdótico", "Escala de actitudes", "Guía de observación"
    ],
    
    EVALUACION_TIPOS: ["Diagnóstica", "Formativa", "Sumativa"],
    ESCENARIOS: ["Aula", "Escuela", "Comunidad"]
};
