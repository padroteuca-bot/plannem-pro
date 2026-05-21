// Variables globales de estado
let planeacionData = {
    datosGenerales: {},
    proyecto: { ejes_articuladores: [], contenidos: [], pdas: [] },
    actividades: {}, // Llave: momento_id, Valor: {inicio, desarrollo, cierre, tiempo, recursos}
    evaluacion: { instrumentos: [] }
};
let currentStep = 1;

// Utilidades
function qs(selector) { return document.querySelector(selector); }
function qsa(selector) { return document.querySelectorAll(selector); }

// Inicialización
window.addEventListener('DOMContentLoaded', async () => {
    // Verificar auth
    const user = await window.ccAuth.checkAuth();
    if (!user) return;
    
    window.ccAuth.renderUserHeader(user);
    initNEMSelects();
    setupEventListeners();
    
    // Cargar perfil escolar
    loadSchoolProfile();
});

// Navegación de pasos
function goToStep(step) {
    if (step < 1 || step > 5) return;
    
    // Guardar datos del paso actual antes de cambiar
    if (currentStep !== step) {
        saveCurrentStepData(currentStep);
    }
    
    qsa('.step-section').forEach(el => el.classList.remove('active'));
    qsa('.dock-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`step-${step}`).classList.add('active');
    document.querySelector(`.dock-btn[onclick="goToStep(${step})"]`).classList.add('active');
    
    currentStep = step;
    
    // Acciones específicas por paso
    if (step === 3) generateActividadesUI();
    if (step === 5) renderPlaneacionesHistory();
}

// Inicializar selects con datos de NEM
function initNEMSelects() {
    const faseSelect = qs('#fase');
    const campoSelect = qs('#campo_formativo');
    const ejesContainer = qs('#ejes-container');
    const instrumentosContainer = qs('#instrumentos-container');
    
    // Llenar Fases
    for (const [id, data] of Object.entries(window.NEM.FASES)) {
        faseSelect.innerHTML += `<option value="${id}">${data.nombre} (${data.nivel})</option>`;
    }
    
    // Llenar Campos Formativos
    for (const [id, data] of Object.entries(window.NEM.CAMPOS)) {
        campoSelect.innerHTML += `<option value="${id}">${data.nombre}</option>`;
    }
    
    // Llenar Ejes Articuladores
    window.NEM.EJES.forEach(eje => {
        ejesContainer.innerHTML += `
            <label class="tag-checkbox">
                <input type="checkbox" value="${eje}" class="eje-checkbox">
                <span>${eje}</span>
            </label>
        `;
    });
    
    // Llenar Instrumentos
    window.NEM.INSTRUMENTOS.forEach(inst => {
        instrumentosContainer.innerHTML += `
            <label class="tag-checkbox">
                <input type="checkbox" value="${inst}" class="inst-checkbox">
                <span>${inst}</span>
            </label>
        `;
    });
}

// Event Listeners
function setupEventListeners() {
    // Cambio de fase -> actualizar grados
    qs('#fase').addEventListener('change', (e) => {
        const faseId = e.target.value;
        const gradoSelect = qs('#grado');
        gradoSelect.innerHTML = '<option value="">Selecciona un grado</option>';
        if (faseId && window.NEM.FASES[faseId]) {
            window.NEM.FASES[faseId].grados.forEach(g => {
                gradoSelect.innerHTML += `<option value="${g}">${g}</option>`;
            });
        }
        updateContenidos();
    });
    
    // Cambio de campo formativo -> actualizar metodología y contenidos
    qs('#campo_formativo').addEventListener('change', (e) => {
        const campoId = e.target.value;
        if (campoId && window.NEM.CAMPOS[campoId]) {
            qs('#metodologia-display').textContent = window.NEM.CAMPOS[campoId].metodologia.nombre;
        } else {
            qs('#metodologia-display').textContent = 'Selecciona un campo formativo primero';
        }
        updateContenidos();
    });
}

// Actualizar lista de Contenidos y PDAs según Fase y Campo
function updateContenidos() {
    const faseId = qs('#fase').value;
    const campoId = qs('#campo_formativo').value;
    const container = qs('#contenidos-container');
    
    container.innerHTML = '';
    
    if (!faseId || !campoId) {
        container.innerHTML = '<p style="color:var(--muted); font-size:0.9rem;">Selecciona fase y campo formativo en el Paso 1 para ver los contenidos.</p>';
        return;
    }
    
    const contenidos = window.NEM.CONTENIDOS[faseId]?.[campoId] || [];
    
    if (contenidos.length === 0) {
        container.innerHTML = '<p style="color:var(--muted); font-size:0.9rem;">No hay contenidos disponibles para esta selección.</p>';
        return;
    }
    
    contenidos.forEach((c, idx) => {
        let pdasHtml = c.pdas.map(pda => `
            <label style="display:flex; gap:0.5rem; margin-top:0.5rem; align-items:flex-start;">
                <input type="checkbox" class="pda-checkbox" value="${pda}" data-contenido-id="${c.id}">
                <span style="font-size:0.85rem; color:var(--muted);">${pda}</span>
            </label>
        `).join('');
        
        container.innerHTML += `
            <div class="card" style="padding:1rem; margin-bottom:1rem; border:1px solid rgba(16,185,129,0.2);">
                <label style="display:flex; gap:0.5rem; font-weight:600;">
                    <input type="checkbox" class="contenido-checkbox" value="${c.texto}" data-id="${c.id}">
                    ${c.texto}
                </label>
                <div style="margin-left:1.5rem; margin-top:0.5rem; border-left:2px solid var(--border); padding-left:1rem;">
                    <p style="font-size:0.8rem; font-weight:600; color:var(--accent);">Procesos de Desarrollo de Aprendizaje (PDA):</p>
                    ${pdasHtml}
                </div>
            </div>
        `;
    });
}

// Generar UI para Actividades basado en la metodología
function generateActividadesUI() {
    const campoId = qs('#campo_formativo').value;
    const container = qs('#actividades-container');
    
    if (!campoId) {
        container.innerHTML = '<div class="card"><p style="color:var(--muted);">Selecciona un campo formativo en el Paso 2 para cargar la metodología.</p></div>';
        return;
    }
    
    const metodologia = window.NEM.CAMPOS[campoId].metodologia;
    container.innerHTML = `<h3>Metodología: ${metodologia.nombre}</h3><p style="color:var(--muted); font-size:0.9rem; margin-bottom:1.5rem;">Diseña tus actividades de acuerdo a los momentos de esta metodología.</p>`;
    
    metodologia.fases.forEach((fase, f_idx) => {
        let momentosHtml = '';
        fase.momentos.forEach((momento, m_idx) => {
            const mId = `act_${f_idx}_${m_idx}`;
            const savedData = planeacionData.actividades[mId] || {inicio:'', desarrollo:'', cierre:'', tiempo:'', recursos:''};
            
            momentosHtml += `
                <div class="accordion">
                    <div class="accordion-header" onclick="this.parentElement.classList.toggle('open')">
                        <span>${momento}</span>
                        <span class="accordion-icon">▼</span>
                    </div>
                    <div class="accordion-content">
                        <div class="form-group">
                            <label>Actividades de Inicio</label>
                            <textarea class="form-control act-input" data-id="${mId}" data-field="inicio" placeholder="¿Cómo iniciamos?">${savedData.inicio}</textarea>
                        </div>
                        <div class="form-group">
                            <label>Actividades de Desarrollo</label>
                            <textarea class="form-control act-input" data-id="${mId}" data-field="desarrollo" placeholder="Desarrollo de la sesión...">${savedData.desarrollo}</textarea>
                        </div>
                        <div class="form-group">
                            <label>Actividades de Cierre</label>
                            <textarea class="form-control act-input" data-id="${mId}" data-field="cierre" placeholder="Reflexión y cierre...">${savedData.cierre}</textarea>
                        </div>
                        <div style="display:flex; gap:1rem;">
                            <div class="form-group" style="flex:1;">
                                <label>Tiempo Estimado</label>
                                <input type="text" class="form-control act-input" data-id="${mId}" data-field="tiempo" value="${savedData.tiempo}" placeholder="Ej: 2 sesiones">
                            </div>
                            <div class="form-group" style="flex:2;">
                                <label>Recursos y Materiales</label>
                                <input type="text" class="form-control act-input" data-id="${mId}" data-field="recursos" value="${savedData.recursos}" placeholder="Libro de texto, proyector...">
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML += `
            <div style="margin-bottom:2rem;">
                <h4 style="margin-bottom:1rem; color:var(--accent-blue);">${fase.nombre}</h4>
                ${momentosHtml}
            </div>
        `;
    });
    
    // Add listeners to save activities as they are typed
    qsa('.act-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const mId = e.target.dataset.id;
            const field = e.target.dataset.field;
            if (!planeacionData.actividades[mId]) planeacionData.actividades[mId] = {};
            planeacionData.actividades[mId][field] = e.target.value;
        });
    });
}

// Guardar datos del paso
function saveCurrentStepData(step) {
    if (step === 1) {
        planeacionData.datosGenerales = {
            school_name: qs('#school_name').value,
            cct: qs('#cct').value,
            nivel: qs('#nivel').value,
            turno: qs('#turno').value,
            fase: parseInt(qs('#fase').value) || 0,
            grado: qs('#grado').value,
            grupo: qs('#grupo').value,
            ciclo_escolar: qs('#ciclo_escolar').value,
            periodo_evaluacion: qs('#periodo_evaluacion').value,
            fecha_inicio: qs('#fecha_inicio').value,
            fecha_fin: qs('#fecha_fin').value
        };
        // Auto-guardar perfil escolar en background
        if (planeacionData.datosGenerales.school_name) {
            window.ccAuth.authFetch('/api/school-profile', {
                method: 'POST',
                body: JSON.stringify(planeacionData.datosGenerales)
            });
        }
    } else if (step === 2) {
        planeacionData.proyecto = {
            campo_formativo: qs('#campo_formativo').value,
            metodologia: qs('#metodologia-display').textContent,
            nombre_proyecto: qs('#nombre_proyecto').value,
            problematica: qs('#problematica').value,
            justificacion: qs('#justificacion').value,
            escenario: qs('#escenario').value,
            producto_final: qs('#producto_final').value,
            productos_parciales: qs('#productos_parciales').value,
            ejes_articuladores: Array.from(qsa('.eje-checkbox:checked')).map(cb => cb.value),
            contenidos: Array.from(qsa('.contenido-checkbox:checked')).map(cb => cb.value),
            pdas: Array.from(qsa('.pda-checkbox:checked')).map(cb => cb.value)
        };
    } else if (step === 4) {
        planeacionData.evaluacion = {
            tipo: qs('#tipo_evaluacion').value,
            instrumentos: Array.from(qsa('.inst-checkbox:checked')).map(cb => cb.value),
            criterios: qs('#criterios_eval').value,
            adecuaciones: qs('#adecuaciones').value,
            observaciones: qs('#observaciones').value
        };
    }
}

// Cargar perfil escolar
async function loadSchoolProfile() {
    try {
        const res = await window.ccAuth.authFetch('/api/school-profile');
        if (res.ok) {
            const profile = await res.json();
            if (profile.school_name) {
                qs('#school_name').value = profile.school_name || '';
                qs('#cct').value = profile.cct || '';
                qs('#nivel').value = profile.nivel || '';
                qs('#turno').value = profile.turno || '';
            }
        }
    } catch(e) { console.log("No school profile found"); }
}

// Generar PDF y Guardar
async function saveAndGeneratePDF() {
    saveCurrentStepData(currentStep); // ensure last step is saved
    const btn = qs('#btn-generate');
    btn.disabled = true;
    btn.innerHTML = 'Generando...';
    
    try {
        // Formatear payload
        const payload = {
            titulo: planeacionData.proyecto.nombre_proyecto || "Planeación Sin Título",
            fase: planeacionData.datosGenerales.fase,
            grado: planeacionData.datosGenerales.grado,
            grupo: planeacionData.datosGenerales.grupo,
            ciclo_escolar: planeacionData.datosGenerales.ciclo_escolar,
            periodo_evaluacion: planeacionData.datosGenerales.periodo_evaluacion,
            fecha_inicio: planeacionData.datosGenerales.fecha_inicio,
            fecha_fin: planeacionData.datosGenerales.fecha_fin,
            campo_formativo: planeacionData.proyecto.campo_formativo,
            metodologia: planeacionData.proyecto.metodologia,
            nombre_proyecto: planeacionData.proyecto.nombre_proyecto,
            problematica: planeacionData.proyecto.problematica,
            justificacion: planeacionData.proyecto.justificacion,
            escenario: planeacionData.proyecto.escenario,
            producto_final: planeacionData.proyecto.producto_final,
            productos_parciales: planeacionData.proyecto.productos_parciales,
            ejes_articuladores: planeacionData.proyecto.ejes_articuladores,
            contenidos: planeacionData.proyecto.contenidos.map(c => ({texto: c})),
            pdas: planeacionData.proyecto.pdas,
            actividades: [planeacionData.actividades], // Simplificado para guardar
            evaluacion: planeacionData.evaluacion,
            adecuaciones: planeacionData.evaluacion.adecuaciones,
            observaciones: planeacionData.evaluacion.observaciones
        };
        
        // Guardar en backend
        const res = await window.ccAuth.savePlaneacion(payload);
        
        // Generar PDF usando jsPDF en frontend (fallback simple)
        generatePDFClientSide(payload);
        
        alert("¡Planeación generada y guardada con éxito!");
        goToStep(5); // Ir al historial
        
        // Update user state (for free eval badge removal if used)
        window.ccAuth.checkAuth();
        
    } catch (e) {
        alert(e.message || "Error al generar la planeación");
        if(e.message && e.message.includes("Límite")) {
            window.location.href = '/app/auth.html?expired=1';
        }
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Guardar y Generar PDF';
    }
}

function generatePDFClientSide(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const user = window.ccAuth.getUser();
    
    // Config
    doc.setFont("helvetica");
    let y = 20;
    
    // Encabezado
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("PLANEACIÓN DIDÁCTICA - NUEVA ESCUELA MEXICANA", 105, y, {align: "center"});
    y += 10;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Escuela: ${planeacionData.datosGenerales.school_name || 'N/A'}`, 14, y);
    doc.text(`CCT: ${planeacionData.datosGenerales.cct || 'N/A'}`, 140, y);
    y += 7;
    doc.text(`Docente: ${user.name || 'N/A'}`, 14, y);
    doc.text(`Ciclo: ${data.ciclo_escolar || 'N/A'}`, 140, y);
    y += 7;
    doc.text(`Fase: ${data.fase} | Grado y Grupo: ${data.grado} "${data.grupo}"`, 14, y);
    doc.text(`Fechas: ${data.fecha_inicio} a ${data.fecha_fin}`, 140, y);
    
    y += 10;
    doc.setLineWidth(0.5);
    doc.line(14, y, 196, y);
    y += 10;
    
    // Proyecto
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("1. DATOS DEL PROYECTO", 14, y);
    y += 7;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Nombre: ${data.nombre_proyecto}`, 14, y); y+=7;
    doc.text(`Campo Formativo: ${window.NEM.CAMPOS[data.campo_formativo]?.nombre || ''}`, 14, y); y+=7;
    doc.text(`Metodología: ${data.metodologia}`, 14, y); y+=7;
    
    // Split text for problematica
    const problemLines = doc.splitTextToSize(`Problemática: ${data.problematica}`, 180);
    doc.text(problemLines, 14, y);
    y += (problemLines.length * 5) + 5;
    
    doc.setFont("helvetica", "bold");
    doc.text("Ejes Articuladores:", 14, y); y+=6;
    doc.setFont("helvetica", "normal");
    doc.text(data.ejes_articuladores.join(", ") || "Ninguno", 14, y); y+=10;
    
    // PDAs
    doc.setFont("helvetica", "bold");
    doc.text("Procesos de Desarrollo de Aprendizaje (PDA):", 14, y); y+=6;
    doc.setFont("helvetica", "normal");
    data.pdas.forEach(pda => {
        const pLines = doc.splitTextToSize(`• ${pda}`, 180);
        doc.text(pLines, 14, y);
        y += (pLines.length * 5);
        if (y > 270) { doc.addPage(); y = 20; }
    });
    y += 10;
    
    // Finish simply and trigger download
    doc.setFont("helvetica", "bold");
    doc.text("Nota: El formato completo de actividades se guarda en plataforma.", 14, y);
    
    doc.save(`Planeacion_${data.nombre_proyecto.replace(/\s+/g, '_')}.pdf`);
}

async function renderPlaneacionesHistory() {
    const container = qs('#historial-list');
    container.innerHTML = '<p>Cargando historial...</p>';
    
    const planes = await window.ccAuth.loadPlaneacionesHistory();
    
    if (planes.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:3rem; color:var(--muted);">
                <div style="font-size:3rem; margin-bottom:1rem;">📂</div>
                <p>Aún no tienes planeaciones guardadas.</p>
                <button onclick="goToStep(1)" class="btn btn-primary" style="margin-top:1rem;">Crear mi primera planeación</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    planes.forEach(p => {
        const date = new Date(p.created_at).toLocaleDateString();
        container.innerHTML += `
            <div class="planeacion-card">
                <div class="planeacion-info">
                    <h4>${p.titulo}</h4>
                    <p>Fase ${p.fase} - ${p.grado} "${p.grupo}" | ${date}</p>
                    <p style="color:var(--accent-blue); font-size:0.8rem; margin-top:0.3rem;">${p.metodologia}</p>
                </div>
                <div class="planeacion-actions">
                    <button class="btn btn-secondary" onclick="alert('Generando PDF de historial...')">⬇️ PDF</button>
                    <button class="btn btn-secondary" style="color:var(--danger); border-color:rgba(239,68,68,0.3);" onclick="borrarPlaneacion(${p.id})">🗑️</button>
                </div>
            </div>
        `;
    });
}

async function borrarPlaneacion(id) {
    if(await window.ccAuth.deletePlaneacion(id)) {
        renderPlaneacionesHistory();
    }
}
