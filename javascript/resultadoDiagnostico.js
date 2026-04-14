
document.addEventListener('DOMContentLoaded', () => {

    const raw = localStorage.getItem('reparify_diagnostico');

    /* Si no hay datos, volver a la página anterior */
    if (!raw) {
        window.location.href = './obtenerDiagnostico.html';
        return;
    }

    const { descripcionUsuario, resultado } = JSON.parse(raw);

    /* ── Descripción del usuario ── */
    const elDesc = document.getElementById('resDescripcionUsuario');
    if (elDesc) elDesc.textContent = descripcionUsuario;

    /* ── Dificultad ── */
    const dificultadConfig = {
        'BAJA':  { width: '25%', color: '#186CFF', label: 'BAJA' },
        'MEDIA': { width: '55%', color: '#FDC700', label: 'MEDIA' },
        'ALTA':  { width: '90%', color: '#FF7A1A', label: 'ALTA' }
    };
    const difCfg = dificultadConfig[resultado.dificultad] || dificultadConfig['MEDIA'];

    const elBarra = document.getElementById('resBarra');
    if (elBarra) {
        elBarra.style.width = difCfg.width;
        elBarra.style.background = difCfg.color;
    }

    const elDif = document.getElementById('resDificultad');
    if (elDif) {
        elDif.textContent = difCfg.label;
        elDif.style.background = difCfg.color;
    }

    /* ── Solución casera ── */
    const elCasera = document.getElementById('resSolucionCasera');
    if (elCasera) {
        elCasera.innerHTML = resultado.solucionCasera
            ? '<span class="res-casera-si">✅ Posible solución casera</span>'
            : '<span class="res-casera-no">🔧 Requiere profesional</span>';
    }

    /* ── Título y descripción del diagnóstico ── */
    const elTitulo = document.getElementById('resTitulo');
    if (elTitulo) elTitulo.textContent = resultado.titulo;

    const elDescDiag = document.getElementById('resDescripcionDiag');
    if (elDescDiag) elDescDiag.textContent = resultado.descripcion;

    /* ── Pasos ── */
    const elPasos = document.getElementById('resPasosList');
    if (elPasos && resultado.pasos) {
        elPasos.innerHTML = resultado.pasos
            .map((paso, i) => `<li class="res-paso-item"><span class="res-paso-num">${i + 1}</span><span>${paso}</span></li>`)
            .join('');
    }

    /* ── Advertencia ── */
    const partes = resultado.advertencia ? resultado.advertencia.split('. ') : [];
    const elAdvTitulo = document.getElementById('resAdvertenciaTitulo');
    const elAdvTexto  = document.getElementById('resAdvertenciaTexto');
    if (elAdvTitulo) elAdvTitulo.textContent = partes[0] ? partes[0] + '.' : '';
    if (elAdvTexto)  elAdvTexto.textContent  = partes.slice(1).join('. ');

    /* ── Botón "Ya lo solucioné" ── */
    const btnResuelto = document.getElementById('btnResuelto');
    if (btnResuelto) {
        btnResuelto.addEventListener('click', () => {
            /* Guardar en historial de diagnósticos resueltos */
            const sesion = JSON.parse(localStorage.getItem('reparify_sesion') || 'null');
            if (sesion) {
                const keyHistorial = 'reparify_diagnosticos_' + sesion.email;
                const historial = JSON.parse(localStorage.getItem(keyHistorial) || '[]');
                historial.push({
                    descripcion: descripcionUsuario,
                    titulo: resultado.titulo,
                    profesion: resultado.profesion,
                    fecha: new Date().toISOString(),
                    estado: 'resuelto'
                });
                localStorage.setItem(keyHistorial, JSON.stringify(historial));
            }
            localStorage.removeItem('reparify_diagnostico');
            window.location.href = './obtenerDiagnostico.html';
        });
    }

    /* ── Link agendar: filtrar por profesión si hay match ── */
    const btnAgendar = document.getElementById('btnAgendar');
    if (btnAgendar && resultado.profesion) {
        btnAgendar.href = `./profesionales.html?profesion=${encodeURIComponent(resultado.profesion)}`;
    }
});