/* miPerfil.js
   Lee reservas de: reparify_reservas_usuario_{email}
   Misma clave donde agendarCita.js las guarda. */

document.addEventListener('DOMContentLoaded', () => {

    const sesion = JSON.parse(localStorage.getItem('reparify_sesion') || 'null');
    if (!sesion) {
        window.location.href = './iniciarSesion.html';
        return;
    }

    const emailUsuario  = sesion.email;
    const nombreUsuario = sesion.nombre || emailUsuario;

    const KEY_DATOS    = `reparify_datos_${emailUsuario}`;
    const KEY_RESERVAS = `reparify_reservas_usuario_${emailUsuario}`;

    const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                   'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];


    /* DATOS DEL FORMULARIO */

    const datosPerfil = JSON.parse(localStorage.getItem(KEY_DATOS) || 'null');
    if (datosPerfil) {
        setInput('datosNombre',    datosPerfil.nombre    || nombreUsuario);
        setInput('datosTelefono',  datosPerfil.telefono  || '');
        setInput('datosEmail',     emailUsuario);
        setInput('datosDireccion', datosPerfil.direccion || '');
        setText('perfilNombre',    datosPerfil.nombre    || nombreUsuario);
    } else {
        setInput('datosNombre', nombreUsuario);
        setInput('datosEmail',  emailUsuario);
        setText('perfilNombre', nombreUsuario);
    }

    const inputEmail = document.getElementById('datosEmail');
    if (inputEmail) {
        inputEmail.readOnly      = true;
        inputEmail.style.opacity = '0.6';
        inputEmail.style.cursor  = 'not-allowed';
        inputEmail.title         = 'El email no se puede modificar';
    }


    /* STATS */

    function actualizarStats() {
        const reservas = JSON.parse(localStorage.getItem(KEY_RESERVAS) || '[]');
        setText('statServicios', reservas.length);

        const hoy     = new Date().toISOString().slice(0, 10);
        const proxima = reservas
            .filter(r => r.fecha >= hoy)
            .sort((a, b) => a.fecha.localeCompare(b.fecha))[0];

        if (proxima) {
            const [y, m, d] = proxima.fecha.split('-').map(Number);
            setText('statProximo', `${d} ${MESES[m-1].slice(0,3)}`);
        } else {
            setText('statProximo', '—');
        }
    }

    actualizarStats();


    /* MENÚ LATERAL → PANELES */

    const menuItems = document.querySelectorAll('.menu-item[data-panel]');
    const paneles   = document.querySelectorAll('.panel');

    menuItems.forEach(btn => {
        btn.addEventListener('click', () => {
            menuItems.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            paneles.forEach(p => p.classList.remove('active'));
            const target = document.getElementById(`panel-${btn.dataset.panel}`);
            if (target) target.classList.add('active');

            if (btn.dataset.panel === 'misReservas') renderReservas();
        });
    });


    /* PANEL MIS RESERVAS */

    function renderReservas() {
        const panel = document.getElementById('panel-misReservas');
        if (!panel) return;

        const reservas = JSON.parse(localStorage.getItem(KEY_RESERVAS) || '[]');
        const hoy      = new Date().toISOString().slice(0, 10);

        const futuras = reservas
            .filter(r => r.fecha >= hoy)
            .sort((a, b) => a.fecha.localeCompare(b.fecha));

        const pasadas = reservas
            .filter(r => r.fecha < hoy)
            .sort((a, b) => b.fecha.localeCompare(a.fecha));

        if (reservas.length === 0) {
            panel.innerHTML = `
                <h3 class="panel-titulo">Mis Reservas</h3>
                <div style="text-align:center;padding:2em 0;">
                    <p style="font-size:2rem;margin-bottom:.5em;">📅</p>
                    <p style="color:var(--text-muted);margin-bottom:1em;">Todavía no tenés reservas.</p>
                    <a href="./agendarCita.html"
                       style="display:inline-block;background:var(--blue);color:#fff;border-radius:8px;
                              padding:10px 24px;font-weight:700;text-decoration:none;">
                        Agendar una cita
                    </a>
                </div>`;
            return;
        }

        function tarjetaReserva(r) {
            const [y, m, d]  = r.fecha.split('-').map(Number);
            const esPasada   = r.fecha < hoy;
            const badgeClase = esPasada ? 'badge-finalizado' : 'badge-progreso';
            const badgeTexto = esPasada ? 'Finalizada' : 'Confirmada';

            return `
                <div style="border:1.5px solid var(--border,#e5e7eb);border-radius:12px;
                            padding:1em 1.25em;margin-bottom:.875em;display:flex;
                            gap:1em;align-items:flex-start;background:var(--white);">
                    <div style="text-align:center;min-width:44px;flex-shrink:0;">
                        <div style="font-size:1.4rem;font-weight:800;color:var(--blue);line-height:1;">${d}</div>
                        <div style="font-size:0.7rem;color:var(--text-muted);font-weight:600;
                                    text-transform:uppercase;">${MESES[m-1].slice(0,3)}</div>
                        <div style="font-size:0.7rem;color:var(--text-muted);">${y}</div>
                    </div>
                    <div style="flex:1;min-width:0;">
                        <p style="font-weight:700;color:var(--text);margin:0 0 2px;">${r.proNombre}</p>
                        <p style="font-size:0.82rem;color:var(--text-muted);margin:0 0 4px;">${r.proProfesion || ''}</p>
                        <p style="font-size:0.82rem;color:var(--text-muted);margin:0;">🕐 ${r.horario} hs &nbsp; 📍 ${r.proUbicacion}</p>
                    </div>
                    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0;">
                        <span class="badge-estado ${badgeClase}">${badgeTexto}</span>
                        ${!esPasada ? `
                        <button class="btn-cancelar-reserva"
                                data-id="${r.id}"
                                style="background:transparent;border:1.5px solid #fca5a5;
                                       color:#c53030;border-radius:6px;padding:4px 10px;
                                       font-size:0.75rem;font-weight:600;cursor:pointer;">
                            Cancelar
                        </button>` : ''}
                    </div>
                </div>`;
        }

        let html = `<h3 class="panel-titulo">Mis Reservas</h3>`;

        if (futuras.length > 0) {
            html += `<p style="font-size:.8rem;font-weight:700;color:var(--text-muted);
                               text-transform:uppercase;letter-spacing:.5px;margin-bottom:.75em;">
                        Próximas (${futuras.length})
                     </p>`;
            html += futuras.map(tarjetaReserva).join('');
        }

        if (pasadas.length > 0) {
            html += `<p style="font-size:.8rem;font-weight:700;color:var(--text-muted);
                               text-transform:uppercase;letter-spacing:.5px;
                               margin:${futuras.length > 0 ? '1.25em 0 .75em' : '0 0 .75em'};">
                        Historial (${pasadas.length})
                     </p>`;
            html += pasadas.map(tarjetaReserva).join('');
        }

        panel.innerHTML = html;

        /* Botones cancelar */
        panel.querySelectorAll('.btn-cancelar-reserva').forEach(btn => {
            btn.addEventListener('click', () => cancelarReserva(parseInt(btn.dataset.id)));
        });
    }


    /* CANCELAR RESERVA */

    function cancelarReserva(id) {
        if (!confirm('¿Cancelar esta reserva?')) return;

        let lista    = JSON.parse(localStorage.getItem(KEY_RESERVAS) || '[]');
        const res    = lista.find(r => r.id === id);
        lista        = lista.filter(r => r.id !== id);
        localStorage.setItem(KEY_RESERVAS, JSON.stringify(lista));

        /* También borrar del lado del profesional */
        if (res) {
            const keyPro = `reparify_reservas_pro_${res.proId}`;
            let listaP   = JSON.parse(localStorage.getItem(keyPro) || '[]');
            listaP       = listaP.filter(r => r.id !== id);
            localStorage.setItem(keyPro, JSON.stringify(listaP));
        }

        actualizarStats();
        renderReservas();
    }


    /* HISTORIAL (tabla de la parte de abajo)
       Reutiliza las mismas reservas — las pasadas son el historial */

    function renderHistorial() {
        const tbody = document.getElementById('historialBody');
        if (!tbody) return;

        const reservas = JSON.parse(localStorage.getItem(KEY_RESERVAS) || '[]');
        const hoy      = new Date().toISOString().slice(0, 10);

        if (reservas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="tabla-vacia">Todavía no tenés servicios registrados.</td></tr>`;
            return;
        }

        /* Mostrar todas ordenadas por fecha desc */
        const ordenadas = [...reservas].sort((a, b) => b.fecha.localeCompare(a.fecha));

        tbody.innerHTML = ordenadas.map(r => {
            const [y, m, d] = r.fecha.split('-').map(Number);
            const fechaLeg  = `${d}/${m}/${y}`;
            const esPasada  = r.fecha < hoy;
            const badgeClase = esPasada ? 'badge-finalizado' : 'badge-progreso';
            const badgeTexto = esPasada ? 'Finalizada'       : 'Confirmada';

            const estrellas = r.valoracion
                ? '★'.repeat(r.valoracion) + '☆'.repeat(5 - r.valoracion)
                : '<span class="badge-pendiente">Pendiente</span>';

            const accion = esPasada && !r.valoracion
                ? `<button class="btn-valorar" data-id="${r.id}">Valorar</button>`
                : esPasada
                    ? '<span style="color:var(--text-muted);font-size:.78rem;">✓</span>'
                    : '';

            return `
                <tr>
                    <td>${r.proProfesion || '—'}</td>
                    <td>${r.proNombre}</td>
                    <td>${fechaLeg} ${r.horario}hs</td>
                    <td><span class="badge-estado ${badgeClase}">${badgeTexto}</span></td>
                    <td style="color:var(--yellow);letter-spacing:1px;">${estrellas}</td>
                    <td>${accion}</td>
                </tr>`;
        }).join('');

        /* Botones valorar */
        tbody.querySelectorAll('.btn-valorar').forEach(btn => {
            btn.addEventListener('click', () => abrirModalValorar(parseInt(btn.dataset.id)));
        });
    }

    renderHistorial();


    /* MODAL VALORAR */

    function abrirModalValorar(id) {
        const reservas = JSON.parse(localStorage.getItem(KEY_RESERVAS) || '[]');
        const r        = reservas.find(x => x.id === id);
        if (!r) return;

        const estrellaSeleccionada = prompt(
            `Valorá el servicio de ${r.proNombre}\nIngresá un número del 1 al 5:`, '5'
        );
        const val = parseInt(estrellaSeleccionada);
        if (!val || val < 1 || val > 5) return;

        const nuevas = reservas.map(x => x.id === id ? { ...x, valoracion: val } : x);
        localStorage.setItem(KEY_RESERVAS, JSON.stringify(nuevas));

        /* Ocultar banner si ya no hay pendientes */
        const hoy      = new Date().toISOString().slice(0, 10);
        const queda    = nuevas.find(x => x.fecha < hoy && !x.valoracion);
        if (!queda) {
            const banner = document.getElementById('bannerValoracion');
            if (banner) banner.style.display = 'none';
        }

        renderHistorial();
    }


    /* BANNER VALORACIÓN PENDIENTE */

    const banner          = document.getElementById('bannerValoracion');
    const btnCerrarBanner = document.getElementById('btnBannerCerrar');
    const btnValorarAhora = document.getElementById('btnValorarAhora');

    const reservas = JSON.parse(localStorage.getItem(KEY_RESERVAS) || '[]');
    const hoyStr   = new Date().toISOString().slice(0, 10);
    const pendiente = reservas.find(r => r.fecha < hoyStr && !r.valoracion);

    if (!pendiente && banner) {
        banner.style.display = 'none';
    } else if (pendiente && banner) {
        setText('bannerProfesional', pendiente.proNombre);
        setText('bannerServicio',    pendiente.proProfesion || 'servicio');
    }

    btnCerrarBanner?.addEventListener('click', () => {
        if (banner) {
            banner.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => banner.remove(), 300);
        }
    });

    btnValorarAhora?.addEventListener('click', () => {
        /* Ir al panel Mis Reservas */
        menuItems.forEach(b => b.classList.remove('active'));
        paneles.forEach(p => p.classList.remove('active'));
        const btnRes = document.querySelector('[data-panel="misReservas"]');
        if (btnRes) {
            btnRes.classList.add('active');
            document.getElementById('panel-misReservas')?.classList.add('active');
            renderReservas();
        }
        document.querySelector('.datos-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });


    /* FORMULARIO MIS DATOS */

    const formDatos    = document.getElementById('formMisDatos');
    const datosMensaje = document.getElementById('datosMensaje');

    if (formDatos) {
        formDatos.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre    = document.getElementById('datosNombre').value.trim();
            const telefono  = document.getElementById('datosTelefono').value.trim();
            const direccion = document.getElementById('datosDireccion').value.trim();

            if (!nombre) { mostrarMensaje(datosMensaje, 'El nombre es obligatorio.', 'error'); return; }

            localStorage.setItem(KEY_DATOS, JSON.stringify({ nombre, telefono, email: emailUsuario, direccion }));
            setText('perfilNombre', nombre);
            mostrarMensaje(datosMensaje, '¡Cambios guardados correctamente!', 'exito');
            setTimeout(() => { datosMensaje.textContent = ''; datosMensaje.className = 'datos-mensaje'; }, 3000);
        });
    }


    /* HELPERS */

    function setInput(id, valor) {
        const el = document.getElementById(id);
        if (el) el.value = valor;
    }
    function setText(id, texto) {
        const el = document.getElementById(id);
        if (el) el.textContent = texto;
    }
    function mostrarMensaje(el, texto, tipo) {
        if (!el) return;
        el.textContent = texto;
        el.className   = `datos-mensaje ${tipo}`;
    }
});