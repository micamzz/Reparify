/* miPerfilProfesional.js
   Perfil del profesional logueado (su propia vista).
   - Protege la ruta: si no hay sesión redirige al login.
   - Si la sesión es de un usuario regular, redirige a miPerfil.html.
   - Carga los datos del profesional desde reparify_profesionales.
   - Permite editar datos básicos.
   - Muestra historial de servicios (si hay). */

document.addEventListener('DOMContentLoaded', () => {

    /* ── PROTECCIÓN DE RUTA ── */
    const sesion = JSON.parse(localStorage.getItem('reparify_sesion') || 'null');

    if (!sesion) {
        window.location.href = './iniciarSesion.html';
        return;
    }

    if (sesion.tipo !== 'profesional') {
        /* Usuario regular: mandarlo a su propio perfil */
        window.location.href = './miPerfil.html';
        return;
    }

    /* ── BUSCAR LOS DATOS DEL PROFESIONAL EN LOCALSTORAGE ── */
    const emailPro = sesion.email;
    const profesionales = JSON.parse(localStorage.getItem('reparify_profesionales') || '[]');
    const pro = profesionales.find(p => p.email?.toLowerCase() === emailPro.toLowerCase());

    /* ── FOTO DE PERFIL ── */
    const KEY_FOTO   = `reparify_foto_pro_${emailPro}`;
    const fotoWrapper = document.getElementById('fotoWrapper');
    const inputFoto   = document.getElementById('inputFoto');
    const imgFoto     = document.getElementById('proFoto');

    /* Cargar foto guardada (base64) */
    const fotoGuardada = localStorage.getItem(KEY_FOTO);
    if (fotoGuardada) {
        imgFoto.src = fotoGuardada;
        imgFoto.style.background = 'none';
    } else if (pro?.foto) {
        imgFoto.src = pro.foto;
    }

    /* Al hacer click en el wrapper → abrir selector de archivo */
    fotoWrapper?.addEventListener('click', () => inputFoto.click());

    /* Al seleccionar archivo → convertir a base64 y guardar */
    inputFoto?.addEventListener('change', () => {
        const archivo = inputFoto.files[0];
        if (!archivo) return;

        /* Validar tipo y tamaño (máx 2MB) */
        if (!archivo.type.startsWith('image/')) return;
        if (archivo.size > 2 * 1024 * 1024) {
            alert('La imagen no puede superar los 2MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target.result;
            imgFoto.src = base64;
            imgFoto.style.background = 'none';
            localStorage.setItem(KEY_FOTO, base64);

            /* También actualizar el objeto del profesional */
            if (pro) {
                pro.foto = base64;
                localStorage.setItem('reparify_profesionales', JSON.stringify(profesionales));
            }
        };
        reader.readAsDataURL(archivo);
    });

    /* ── RENDERIZAR CARD HEADER ── */
    setText('proNombre',    pro?.nombre    || sesion.nombre || '—');
    setText('proProfesion', pro?.profesion || '—');
    setText('proUbicacion', pro?.ubicacion || pro?.zona || '—');
    setText('proDesde',     pro?.desde     || '—');
    setText('proValoracion', pro?.valoracion > 0 ? pro.valoracion : '—');
    setText('proTrabajos',   pro?.trabajos  > 0 ? pro.trabajos  : '0');
    setText('proRespuesta',  pro?.respuesta && pro.respuesta !== 'N/A' ? `< ${pro.respuesta}` : '—');

    document.title = `Reparify – ${pro?.nombre || sesion.nombre}`;

    /* ── FORMULARIO MIS DATOS ── */
    const KEY_DATOS = `reparify_datos_pro_${emailPro}`;
    const datosPerfil = JSON.parse(localStorage.getItem(KEY_DATOS) || 'null');

    /* Pre-rellenar con datos guardados o los del registro */
    setInput('datosNombre',    datosPerfil?.nombre    || pro?.nombre    || sesion.nombre || '');
    setInput('datosTelefono',  datosPerfil?.telefono  || pro?.telefono  || '');
    setInput('datosEmail',     emailPro);
    setInput('datosZona',      datosPerfil?.zona      || pro?.zona      || '');
    setInput('datosMatricula', datosPerfil?.matricula || pro?.matricula || '');

    /* Email no editable */
    const inputEmail = document.getElementById('datosEmail');
    if (inputEmail) {
        inputEmail.readOnly = true;
        inputEmail.style.opacity = '0.6';
        inputEmail.style.cursor  = 'not-allowed';
        inputEmail.title = 'El email no se puede modificar';
    }

    const formDatos   = document.getElementById('formMisDatos');
    const datosMensaje = document.getElementById('datosMensaje');

    if (formDatos) {
        formDatos.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre    = document.getElementById('datosNombre').value.trim();
            const telefono  = document.getElementById('datosTelefono').value.trim();
            const zona      = document.getElementById('datosZona').value.trim();
            const matricula = document.getElementById('datosMatricula').value.trim();

            if (!nombre) {
                mostrarMensaje(datosMensaje, 'El nombre es obligatorio.', 'error');
                return;
            }

            /* Guardar datos editados */
            localStorage.setItem(KEY_DATOS, JSON.stringify({ nombre, telefono, zona, matricula, email: emailPro }));

            /* Actualizar card en tiempo real */
            setText('proNombre',    nombre);
            setText('proUbicacion', zona || pro?.ubicacion || '—');

            /* Actualizar también el objeto en reparify_profesionales */
            if (pro) {
                pro.nombre    = nombre;
                pro.telefono  = telefono;
                pro.zona      = zona;
                pro.ubicacion = zona ? `${zona}, CABA` : pro.ubicacion;
                pro.matricula = matricula;
                localStorage.setItem('reparify_profesionales', JSON.stringify(profesionales));
            }

            mostrarMensaje(datosMensaje, '¡Cambios guardados correctamente!', 'exito');
            setTimeout(() => {
                datosMensaje.textContent = '';
                datosMensaje.className = 'datos-mensaje';
            }, 3000);
        });
    }

    /* ── PANEL SERVICIOS ── */
    setText('tagEspecialidad', pro?.profesion || '—');

    /* ── PANEL HISTORIAL ── */
    /* Por ahora sin historial real para profesionales registrados */
    const historialBody = document.getElementById('historialBody');
    if (historialBody && pro?.historial && pro.historial.length > 0) {
        historialBody.innerHTML = pro.historial.map(h => `
            <tr>
                <td>${h.servicio}</td>
                <td>${h.cliente}</td>
                <td>${h.fecha}</td>
                <td><span class="badge-estado badge-${h.estado === 'finalizado' ? 'finalizado' : 'progreso'}">
                    ${h.estado === 'finalizado' ? 'Finalizado' : 'En progreso'}
                </span></td>
                <td><span class="estrellas">${'★'.repeat(h.valoracion || 0)}${'☆'.repeat(5 - (h.valoracion || 0))}</span></td>
            </tr>
        `).join('');
    }

    /* ── PANEL CONFIGURACIÓN ── */
    setText('configCbu',       pro?.cbu      || '—');
    setText('configDomicilio', pro?.domicilio || '—');

    document.getElementById('btnCerrarSesion')?.addEventListener('click', () => {
        localStorage.removeItem('reparify_sesion');
        window.location.href = '/index.html';
    });

    /* ── MENÚ LATERAL ── */
    const menuItems = document.querySelectorAll('.menu-item[data-panel]');
    const paneles   = document.querySelectorAll('.panel');

    menuItems.forEach(btn => {
        btn.addEventListener('click', () => {
            menuItems.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            paneles.forEach(p => p.classList.remove('active'));
            const target = document.getElementById(`panel-${btn.dataset.panel}`);
            if (target) target.classList.add('active');
        });
    });

    /* ── HELPERS ── */
    function setText(id, texto) {
        const el = document.getElementById(id);
        if (el) el.textContent = texto;
    }

    function setInput(id, valor) {
        const el = document.getElementById(id);
        if (el) el.value = valor;
    }

    function mostrarMensaje(el, texto, tipo) {
        if (!el) return;
        el.textContent = texto;
        el.className = `datos-mensaje ${tipo}`;
    }

});