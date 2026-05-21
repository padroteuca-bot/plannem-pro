const API_URL = window.location.protocol === 'file:' ? 'http://127.0.0.1:8000' : '';

function getToken() { return localStorage.getItem('pn_token'); }
function setToken(t) { localStorage.setItem('pn_token', t); }
function getUser() { try { return JSON.parse(localStorage.getItem('pn_user') || '{}'); } catch { return {}; } }
function setUser(u) { localStorage.setItem('pn_user', JSON.stringify(u)); }

async function authFetch(url, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_URL}${url}`, { ...options, headers });
    if (response.status === 401) {
        logoutUser();
        throw new Error('Sesión expirada');
    }
    return response;
}

async function checkAuth(requirePlan = true) {
    const token = getToken();
    if (!token) {
        window.location.href = '/app/auth.html';
        return null;
    }
    try {
        const res = await authFetch('/api/auth/me');
        if (res.ok) {
            const user = await res.json();
            setUser(user);
            
            // Si requiere plan y no tiene plan activo ni prueba gratis, redirigir a auth
            if (requirePlan && !user.plan_active && !user.free_eval_available) {
                window.location.href = '/app/auth.html?expired=1';
                return null;
            }
            return user;
        } else {
            throw new Error('No autorizado');
        }
    } catch (e) {
        logoutUser();
        return null;
    }
}

function logoutUser() {
    localStorage.removeItem('pn_token');
    localStorage.removeItem('pn_user');
    window.location.href = '/app/auth.html';
}

function renderUserHeader(user) {
    const header = document.getElementById('user-header');
    if (!header || !user) return;
    
    let planBadge = '';
    if (user.plan_active) {
        const planName = user.plan === 'yearly' ? 'Plan Anual' : 'Plan Mensual';
        planBadge = `<span class="plan-badge">✅ ${planName}</span>`;
    } else if (user.free_eval_available) {
        planBadge = `<span class="plan-badge" style="background:rgba(245,158,11,0.15);color:#F59E0B;">🎁 1 Planeación Gratis</span>`;
    } else {
        planBadge = `<span class="plan-badge expired">⚠️ Plan Inactivo</span>`;
    }

    header.innerHTML = `
        <div class="user-panel">
            <span class="email">${user.email}</span>
            ${planBadge}
            <button class="btn-logout" onclick="window.ccAuth.logoutUser()">Cerrar sesión</button>
        </div>
    `;
}

async function savePlaneacion(data) {
    try {
        const res = await authFetch('/api/planeaciones', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.detail || 'Error al guardar');
        return result;
    } catch (e) {
        throw e;
    }
}

async function loadPlaneacionesHistory() {
    try {
        const res = await authFetch('/api/planeaciones');
        if (res.ok) {
            return await res.json();
        }
        return [];
    } catch (e) {
        console.error(e);
        return [];
    }
}

async function deletePlaneacion(id) {
    if(!confirm('¿Seguro que deseas eliminar esta planeación?')) return false;
    try {
        const res = await authFetch(`/api/planeaciones/${id}`, { method: 'DELETE' });
        return res.ok;
    } catch (e) {
        return false;
    }
}

window.ccAuth = {
    API_URL,
    getToken,
    setToken,
    getUser,
    setUser,
    authFetch,
    checkAuth,
    logoutUser,
    renderUserHeader,
    savePlaneacion,
    loadPlaneacionesHistory,
    deletePlaneacion
};
