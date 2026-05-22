const fs = require('fs');
const path = require('path');

const METODOLOGIAS = {
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
};

const DIFERENCIACION_FASE = {
    3: { 
        "verbos": ["Dibujar", "Identificar", "Describir oralmente", "Agrupar", "Explorar", "Reconocer", "Recortar"],
        "productos": ["Cartel con dibujos", "Cuento ilustrado", "Maqueta sencilla", "Exposición oral breve", "Collage"],
        "tiempos": ["20", "30", "15"], 
        "adjetivos": ["divertido", "colorido", "con ayuda del docente", "en círculo", "en parejas"]
    },
    4: { 
        "verbos": ["Redactar", "Clasificar", "Entrevistar", "Medir", "Comparar", "Investigar en biblioteca", "Organizar"],
        "productos": ["Periódico mural", "Folleto informativo", "Experimento demostrativo", "Obra de teatro escolar", "Línea del tiempo"],
        "tiempos": ["30", "45", "20"],
        "adjetivos": ["en equipos", "con organizadores gráficos", "consultando el libro de texto", "en el patio"]
    },
    5: { 
        "verbos": ["Argumentar", "Analizar", "Debatir", "Proyectar", "Diseñar", "Sintetizar", "Comprobar"],
        "productos": ["Ensayo argumentativo", "Campaña de concientización", "Feria de ciencias", "Debate formal", "Podcast escolar", "Reporte de investigación"],
        "tiempos": ["45", "60", "30"],
        "adjetivos": ["de forma autónoma", "utilizando herramientas digitales", "con asamblea grupal", "analizando gráficas"]
    },
    6: { 
        "verbos": ["Criticar", "Sistematizar", "Intervenir", "Prototipar", "Cuestionar", "Evaluar", "Modelar matemática/físicamente"],
        "productos": ["Prototipo funcional", "Artículo de divulgación", "Intervención comunitaria", "Feria interdisciplinaria", "Foro de discusión abierto", "Panel de expertos"],
        "tiempos": ["50", "90", "40"],
        "adjetivos": ["mediante investigación de campo", "aplicando pensamiento crítico", "con encuestas a la comunidad", "mediante laboratorios"]
    }
};

const TEMATICAS = {
    "lenguajes": [
        ["Nuestras tradiciones vivas", "Pérdida de identidad cultural y tradiciones."],
        ["El poder de las historias", "Dificultad en la comprensión y redacción narrativa."],
        ["Voces de mi comunidad", "Falta de reconocimiento a los saberes comunitarios y lenguas originarias."],
        ["Medios de comunicación responsables", "Consumo acrítico de información falsa o amarillista."],
        ["Poesía y emociones", "Dificultad para expresar emociones a través del lenguaje estético."]
    ],
    "saberes": [
        ["Cuidado del agua en mi escuela", "Desperdicio excesivo de recursos hídricos en la institución."],
        ["Las matemáticas de las compras", "Dificultad para aplicar operaciones básicas y fracciones en la vida real."],
        ["Mi cuerpo funciona", "Desconocimiento de hábitos de higiene y sistemas del cuerpo humano."],
        ["El clima está cambiando", "Falta de conciencia sobre el impacto del cambio climático en la localidad."],
        ["Nutrición en mi lonchera", "Consumo elevado de comida chatarra frente a opciones saludables."]
    ],
    "etica": [
        ["Conociendo nuestras raíces históricas", "Desconexión con los hechos históricos que formaron nuestra identidad."],
        ["Igualdad en el patio de juegos", "Casos de exclusión y falta de equidad de género en el recreo."],
        ["Cuidando nuestros ecosistemas locales", "Contaminación por basura en los parques y calles cercanas."],
        ["Derechos de los niños y niñas", "Desconocimiento de los derechos humanos y mecanismos de protección."],
        ["Reglas de convivencia", "Falta de acuerdos y violencia escolar leve."]
    ],
    "humano": [
        ["Juegos tradicionales en movimiento", "Sedentarismo excesivo debido al uso de tecnología."],
        ["Conociendo y manejando el enojo", "Poca inteligencia emocional que deriva en conflictos áulicos."],
        ["Mi proyecto de vida", "Falta de metas a futuro y desmotivación académica."],
        ["Habilidades para la paz", "Falta de habilidades de diálogo y mediación."],
        ["Alimentación e imagen corporal", "Baja autoestima e influencia negativa de los estándares estéticos."]
    ]
};

const MESES = ["general", "septiembre", "octubre", "noviembre", "diciembre", "enero", "febrero", "marzo", "abril", "mayo", "junio"];

function r(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function rSample(arr, n) {
    let result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len) return arr;
    while (n--) {
        let x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

function generar_actividades(campo, fase) {
    let momentos = METODOLOGIAS[campo];
    let diff = DIFERENCIACION_FASE[fase];
    let actividades = [];
    
    momentos.forEach(momento => {
        let v_inicio = r(diff.verbos);
        let v_des = r(diff.verbos);
        let v_cierre = r(diff.verbos);
        let adj = r(diff.adjetivos);
        
        actividades.push({
            momento: momento,
            tipo: "Inicio",
            descripcion: `${v_inicio} los conceptos principales ${adj}.`,
            tiempo: r(diff.tiempos)
        });
        actividades.push({
            momento: momento,
            tipo: "Desarrollo",
            descripcion: `${v_des} a fondo utilizando los materiales provistos ${adj}.`,
            tiempo: r(diff.tiempos)
        });
        actividades.push({
            momento: momento,
            tipo: "Cierre",
            descripcion: `${v_cierre} para reflexionar lo aprendido.`,
            tiempo: r(diff.tiempos)
        });
    });
    return actividades;
}

function generar_rubrica(fase) {
    return {
        "instrumento": fase >= 4 ? "Rúbrica" : "Lista de cotejo",
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
    };
}

function construir_json_masivo() {
    let base_de_datos = {};
    const EJES = ["Inclusión", "Pensamiento crítico", "Interculturalidad crítica", "Vida saludable", "Apropiación de las culturas a través de la lectura y la escritura"];
    
    [3, 4, 5, 6].forEach(fase => {
        base_de_datos[fase.toString()] = {};
        ["lenguajes", "saberes", "etica", "humano"].forEach(campo => {
            base_de_datos[fase.toString()][campo] = {};
            MESES.forEach(mes => {
                base_de_datos[fase.toString()][campo][mes] = [];
            });
            
            // Generate 110 projects
            for (let i = 0; i < 110; i++) {
                let [tema, problematica] = r(TEMATICAS[campo]);
                let producto = r(DIFERENCIACION_FASE[fase].productos);
                let mes = r(MESES);
                
                let proyecto = {
                    "titulo": `${tema} (${i+1}) - Enfoque Fase ${fase}`,
                    "problematica": problematica,
                    "justificacion": `Es fundamental intervenir pedagógicamente porque los alumnos de Fase ${fase} requieren consolidar habilidades vinculadas a este tema.`,
                    "producto_final": producto,
                    "ejes_articuladores": rSample(EJES, 2),
                    "pdas": [`PDA sugerido automático Nivel Fase ${fase}`],
                    "actividades": generar_actividades(campo, fase),
                    "rubrica": generar_rubrica(fase)
                };
                
                base_de_datos[fase.toString()][campo][mes].push(proyecto);
            }
        });
    });
    
    const filepath = path.join(__dirname, 'nem_massive_templates.json');
    fs.writeFileSync(filepath, JSON.stringify(base_de_datos, null, 2));
    console.log("✅ ¡Generación exitosa! Archivo guardado en: " + filepath);
}

construir_json_masivo();
