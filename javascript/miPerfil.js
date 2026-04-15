/* miPerfil.js */

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
               'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

/* Email del usuario activo — se asigna en DOMContentLoaded */
let _emailUsuario = '';

/* Lee la clave de reservas siempre fresca */
function keyReservas() {
    return 'reparify_reservas_usuario_' + _emailUsuario;
}

/* Migración: asigna id a reservas antiguas que no lo tengan */
function migrarReservasSinId(clave) {
    var lista = JSON.parse(localStorage.getItem(clave) || '[]');
    var modificado = false;
    lista = lista.map(function(r) {
        if (r.id === undefined || r.id === null) {
            r.id = Date.now() + Math.floor(Math.random() * 10000);
            modificado = true;
        }
        return r;
    });
    if (modificado) {
        localStorage.setItem(clave, JSON.stringify(lista));

    }
    return lista;
}


/* POPUP DE CONFIRMACIÓN
   Se crea una vez, se reutiliza siempre. */
let _popup = null;

function mostrarPopupCancelar(id, proNombre, fecha, horario) {

    if (!_popup) {
        _popup = document.createElement('div');
        _popup.style.cssText =
            'position:fixed;inset:0;background:rgba(0,0,0,.55);' +
            'display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px;';
        _popup.innerHTML =
            '<div id="_popupBox" style="background:#fff;border:2px solid #000;border-radius:18px;' +
            'padding:2em 1.75em;max-width:360px;width:100%;text-align:center;">' +
            '<div style="font-size:2rem;margin-bottom:.5em;">🗓️</div>' +
            '<h3 id="_popupTitulo" style="font-size:1rem;font-weight:800;margin:0 0 .5em;color:#1a1a2e;">' +
            '¿Cancelar esta reserva?</h3>' +
            '<p id="_popupDesc" style="font-size:.85rem;color:#6b7280;line-height:1.6;margin:0 0 1.5em;"></p>' +
            '<div style="display:flex;gap:10px;">' +
            '<button id="_popupNo" style="flex:1;background:transparent;border:1.5px solid #e5e7eb;' +
            'border-radius:8px;padding:11px;font-family:inherit;font-size:.9rem;font-weight:600;' +
            'color:#6b7280;cursor:pointer;">Volver</button>' +
            '<button id="_popupSi" style="flex:1;background:#e53e3e;border:none;border-radius:8px;' +
            'padding:11px;font-family:inherit;font-size:.9rem;font-weight:700;color:#fff;cursor:pointer;">' +
            'Sí, cancelar</button>' +
            '</div></div>';
        document.body.appendChild(_popup);

        /* Click fuera cierra */
        _popup.addEventListener('click', function(e) {
            if (e.target === _popup) _popup.style.display = 'none';
        });
    }

    /* Actualizar descripción */
    document.getElementById('_popupDesc').innerHTML =
        'Vas a cancelar tu cita con <strong>' + proNombre + '</strong><br>' +
        'el <strong>' + fecha + '</strong> a las <strong>' + horario + ' hs</strong>.<br>' +
        'Esta acción no se puede deshacer.';

    _popup.style.display = 'flex';

    /* Clonar botones para limpiar listeners viejos */
    var viejo_si = document.getElementById('_popupSi');
    var nuevo_si = viejo_si.cloneNode(true);
    viejo_si.parentNode.replaceChild(nuevo_si, viejo_si);

    var viejo_no = document.getElementById('_popupNo');
    var nuevo_no = viejo_no.cloneNode(true);
    viejo_no.parentNode.replaceChild(nuevo_no, viejo_no);

    document.getElementById('_popupSi').addEventListener('click', function() {
        _popup.style.display = 'none';
        ejecutarCancelacion(id);
    });

    document.getElementById('_popupNo').addEventListener('click', function() {
        _popup.style.display = 'none';
    });
}


/* CANCELAR RESERVA */
function ejecutarCancelacion(id) {
    var idStr = String(id);
    var clave = keyReservas();


    var lista = JSON.parse(localStorage.getItem(clave) || '[]');
  

    var reserva = null;
    for (var i = 0; i < lista.length; i++) {
        if (String(lista[i].id) === idStr) { reserva = lista[i]; break; }
    }



    var nuevaLista = lista.filter(function(r) { return String(r.id) !== idStr; });


    localStorage.setItem(clave, JSON.stringify(nuevaLista));

    /* Liberar horario del profesional */
    if (reserva && reserva.proId) {
        var keyPro = 'reparify_reservas_pro_' + reserva.proId;
        var listaP = JSON.parse(localStorage.getItem(keyPro) || '[]');
        var nuevaP = listaP.filter(function(r) { return String(r.id) !== idStr; });
        localStorage.setItem(keyPro, JSON.stringify(nuevaP));
       
    }

    /* Actualizar UI */
    actualizarStats();
    renderReservas();
    renderHistorial();
}


/* STATS */
function actualizarStats() {
    var lista = JSON.parse(localStorage.getItem(keyReservas()) || '[]');
    var elS   = document.getElementById('statServicios');
    if (elS) elS.textContent = lista.length;

    var hoy  = new Date().toISOString().slice(0, 10);
    var prox = lista
        .filter(function(r) { return r.fecha >= hoy; })
        .sort(function(a, b) { return a.fecha.localeCompare(b.fecha); })[0];

    var elP = document.getElementById('statProximo');
    if (elP) {
        if (prox) {
            var parts = prox.fecha.split('-');
            elP.textContent = parts[2] + ' ' + MESES[parseInt(parts[1]) - 1].slice(0, 3);
        } else {
            elP.textContent = '—';
        }
    }
}


/* PANEL MIS RESERVAS */
function renderReservas() {
    var panel = document.getElementById('panel-misReservas');
    if (!panel) return;

    var lista = JSON.parse(localStorage.getItem(keyReservas()) || '[]');
    var hoy   = new Date().toISOString().slice(0, 10);


    var futuras = lista.filter(function(r) { return r.fecha >= hoy; })
                       .sort(function(a, b) { return a.fecha.localeCompare(b.fecha); });
    var pasadas = lista.filter(function(r) { return r.fecha < hoy; })
                       .sort(function(a, b) { return b.fecha.localeCompare(a.fecha); });

    if (lista.length === 0) {
        panel.innerHTML =
            '<h3 class="panel-titulo">Mis Reservas</h3>' +
            '<div style="text-align:center;padding:2em 0;">' +
            '<p style="font-size:2rem;margin-bottom:.5em;">📅</p>' +
            '<p style="color:var(--text-muted);margin-bottom:1.25em;">Todavía no tenés reservas.</p>' +
            '<a href="./agendarCita.html" style="display:inline-block;background:var(--blue);color:#fff;' +
            'border-radius:8px;padding:10px 24px;font-weight:700;text-decoration:none;">Agendar una cita</a>' +
            '</div>';
        return;
    }

    function tarjeta(r) {
        var parts   = r.fecha.split('-');
        var y = parts[0], m = parseInt(parts[1]), d = parseInt(parts[2]);
        var esPasada = r.fecha < hoy;
        var btnCancelar = esPasada ? '' :
            '<button class="btn-cancelar-reserva"' +
            ' data-id="' + r.id + '"' +
            ' data-nombre="' + r.proNombre + '"' +
            ' data-fecha="' + d + '/' + m + '/' + y + '"' +
            ' data-horario="' + r.horario + '"' +
            ' style="margin-top:4px;background:transparent;border:1.5px solid #fca5a5;' +
            'color:#c53030;border-radius:6px;padding:5px 12px;font-family:inherit;' +
            'font-size:.78rem;font-weight:600;cursor:pointer;">Cancelar</button>';

        return '<div style="border:1.5px solid var(--border,#e5e7eb);border-radius:12px;' +
            'padding:1em 1.25em;margin-bottom:.875em;display:flex;gap:1em;' +
            'align-items:flex-start;background:var(--white);">' +
            '<div style="text-align:center;min-width:44px;flex-shrink:0;">' +
            '<div style="font-size:1.4rem;font-weight:800;color:var(--blue);line-height:1;">' + d + '</div>' +
            '<div style="font-size:.7rem;color:var(--text-muted);font-weight:600;text-transform:uppercase;">' +
            MESES[m-1].slice(0,3) + '</div>' +
            '<div style="font-size:.7rem;color:var(--text-muted);">' + y + '</div>' +
            '</div>' +
            '<div style="flex:1;min-width:0;">' +
            '<p style="font-weight:700;color:var(--text);margin:0 0 2px;">' + r.proNombre + '</p>' +
            '<p style="font-size:.82rem;color:var(--text-muted);margin:0 0 4px;">' + (r.proProfesion || '') + '</p>' +
            '<p style="font-size:.82rem;color:var(--text-muted);margin:0;">🕐 ' + r.horario + ' hs &nbsp; 📍 ' + r.proUbicacion + '</p>' +
            '</div>' +
            '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0;">' +
            '<span class="badge-estado ' + (esPasada ? 'badge-finalizado' : 'badge-progreso') + '">' +
            (esPasada ? 'Finalizada' : 'Confirmada') + '</span>' +
            btnCancelar +
            '</div></div>';
    }

    var html = '<h3 class="panel-titulo">Mis Reservas</h3>';

    if (futuras.length > 0) {
        html += '<p style="font-size:.78rem;font-weight:700;color:var(--text-muted);' +
                'text-transform:uppercase;letter-spacing:.5px;margin-bottom:.75em;">' +
                'Próximas (' + futuras.length + ')</p>';
        html += futuras.map(tarjeta).join('');
    }
    if (pasadas.length > 0) {
        html += '<p style="font-size:.78rem;font-weight:700;color:var(--text-muted);' +
                'text-transform:uppercase;letter-spacing:.5px;margin-top:' +
                (futuras.length ? '1.25em' : '0') + ';margin-bottom:.75em;">' +
                'Historial (' + pasadas.length + ')</p>';
        html += pasadas.map(tarjeta).join('');
    }

    panel.innerHTML = html;

    /* Registrar listeners DESPUÉS de insertar HTML */
    var botones = panel.querySelectorAll('.btn-cancelar-reserva');

    botones.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var id      = btn.getAttribute('data-id');
            var nombre  = btn.getAttribute('data-nombre');
            var fecha   = btn.getAttribute('data-fecha');
            var horario = btn.getAttribute('data-horario');

            mostrarPopupCancelar(id, nombre, fecha, horario);
        });
    });
}


/* HISTORIAL */
function renderHistorial() {
    var tbody = document.getElementById('historialBody');
    if (!tbody) return;

    var lista = JSON.parse(localStorage.getItem(keyReservas()) || '[]');
    var hoy   = new Date().toISOString().slice(0, 10);

    if (lista.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="tabla-vacia">Todavía no tenés servicios registrados.</td></tr>';
        return;
    }

    var ordenadas = lista.slice().sort(function(a, b) { return b.fecha.localeCompare(a.fecha); });

    tbody.innerHTML = ordenadas.map(function(r) {
        var parts   = r.fecha.split('-');
        var y = parts[0], m = parseInt(parts[1]), d = parseInt(parts[2]);
        var esPasada = r.fecha < hoy;
        var estrellas = r.valoracion
            ? '★'.repeat(r.valoracion) + '☆'.repeat(5 - r.valoracion)
            : '<span class="badge-pendiente">Pendiente</span>';
        var accion = (esPasada && !r.valoracion)
            ? '<button class="btn-valorar" data-id="' + r.id + '">Valorar</button>' : '';

        return '<tr>' +
            '<td>' + (r.proProfesion || '—') + '</td>' +
            '<td>' + r.proNombre + '</td>' +
            '<td>' + d + '/' + m + '/' + y + ' ' + r.horario + 'hs</td>' +
            '<td><span class="badge-estado ' + (esPasada ? 'badge-finalizado' : 'badge-progreso') + '">' +
            (esPasada ? 'Finalizada' : 'Confirmada') + '</span></td>' +
            '<td style="color:var(--yellow);letter-spacing:1px;">' + estrellas + '</td>' +
            '<td>' + accion + '</td>' +
            '</tr>';
    }).join('');

    tbody.querySelectorAll('.btn-valorar').forEach(function(btn) {
        btn.addEventListener('click', function() {
            abrirValorar(btn.getAttribute('data-id'));
        });
    });
}


/* VALORAR */
function abrirValorar(id) {
    var lista = JSON.parse(localStorage.getItem(keyReservas()) || '[]');
    var r     = lista.find(function(x) { return String(x.id) === String(id); });
    if (!r) return;

    var val = parseInt(prompt('Valorá a ' + r.proNombre + '\nIngresá un número del 1 al 5:', '5'));
    if (!val || val < 1 || val > 5) return;

    var nuevas = lista.map(function(x) {
        return String(x.id) === String(id) ? Object.assign({}, x, { valoracion: val }) : x;
    });
    localStorage.setItem(keyReservas(), JSON.stringify(nuevas));

    var hoy   = new Date().toISOString().slice(0, 10);
    var queda = nuevas.find(function(x) { return x.fecha < hoy && !x.valoracion; });
    if (!queda) {
        var banner = document.getElementById('bannerValoracion');
        if (banner) banner.style.display = 'none';
    }
    renderHistorial();
}


/* INIT */
document.addEventListener('DOMContentLoaded', function() {

    var sesion = JSON.parse(localStorage.getItem('reparify_sesion') || 'null');
    if (!sesion) { window.location.href = './iniciarSesion.html'; return; }

    _emailUsuario = sesion.email;
    var nombreUsuario = sesion.nombre || sesion.email;
    var KEY_DATOS = 'reparify_datos_' + _emailUsuario;
    var KEY_FOTO  = 'reparify_foto_'  + _emailUsuario;

    /* Migrar reservas antiguas sin id al iniciar */
    migrarReservasSinId(keyReservas());


    /* FOTO */
    var imgPerfil = document.getElementById('perfilFoto');
    var inputFoto = document.getElementById('inputFotoPerfil');
    var fotoGuardada = localStorage.getItem(KEY_FOTO);
    if (fotoGuardada && imgPerfil) { imgPerfil.src = fotoGuardada; imgPerfil.style.display = 'block'; }

    if (inputFoto) {
        inputFoto.addEventListener('change', function() {
            var archivo = inputFoto.files[0];
            if (!archivo) return;
            if (!archivo.type.startsWith('image/')) { alert('Seleccioná una imagen.'); return; }
            if (archivo.size > 2 * 1024 * 1024) { alert('Máximo 2 MB.'); return; }
            var reader = new FileReader();
            reader.onload = function(e) {
                localStorage.setItem(KEY_FOTO, e.target.result);
                if (imgPerfil) { imgPerfil.src = e.target.result; imgPerfil.style.display = 'block'; }
            };
            reader.readAsDataURL(archivo);
        });
    }


    /* DATOS */
    var datosPerfil = JSON.parse(localStorage.getItem(KEY_DATOS) || 'null');
    if (datosPerfil) {
        setInput('datosNombre',    datosPerfil.nombre    || nombreUsuario);
        setInput('datosTelefono',  datosPerfil.telefono  || '');
        setInput('datosEmail',     _emailUsuario);
        setInput('datosDireccion', datosPerfil.direccion || '');
        setText('perfilNombre',    datosPerfil.nombre    || nombreUsuario);
    } else {
        setInput('datosNombre', nombreUsuario);
        setInput('datosEmail',  _emailUsuario);
        setText('perfilNombre', nombreUsuario);
    }

    var inputEmail = document.getElementById('datosEmail');
    if (inputEmail) {
        inputEmail.readOnly = true;
        inputEmail.style.opacity = '0.6';
        inputEmail.style.cursor  = 'not-allowed';
        inputEmail.title = 'El email no se puede modificar';
    }


    /* STATS y HISTORIAL iniciales */
    actualizarStats();
    renderHistorial();


    /* MENÚ LATERAL */
    var menuItems = document.querySelectorAll('.menu-item[data-panel]');
    var paneles   = document.querySelectorAll('.panel');

    menuItems.forEach(function(btn) {
        btn.addEventListener('click', function() {
            menuItems.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            paneles.forEach(function(p) { p.classList.remove('active'); });
            var target = document.getElementById('panel-' + btn.dataset.panel);
            if (target) target.classList.add('active');
            if (btn.dataset.panel === 'misReservas') renderReservas();
        });
    });


    /* BANNER */
    var banner          = document.getElementById('bannerValoracion');
    var btnCerrarBanner = document.getElementById('btnBannerCerrar');
    var btnValorarAhora = document.getElementById('btnValorarAhora');
    var hoyBanner       = new Date().toISOString().slice(0, 10);
    var reservasIni     = JSON.parse(localStorage.getItem(keyReservas()) || '[]');
    var pendiente       = reservasIni.find(function(r) { return r.fecha < hoyBanner && !r.valoracion; });

    if (!pendiente && banner) banner.style.display = 'none';
    else if (pendiente && banner) {
        setText('bannerProfesional', pendiente.proNombre   || '');
        setText('bannerServicio',    pendiente.proProfesion || 'servicio');
    }

    if (btnCerrarBanner) {
        btnCerrarBanner.addEventListener('click', function() {
            if (banner) { banner.style.animation = 'fadeOut .3s ease forwards'; setTimeout(function() { banner.remove(); }, 300); }
        });
    }

    if (btnValorarAhora) {
        btnValorarAhora.addEventListener('click', function() {
            menuItems.forEach(function(b) { b.classList.remove('active'); });
            paneles.forEach(function(p) { p.classList.remove('active'); });
            var btnRes = document.querySelector('[data-panel="misReservas"]');
            if (btnRes) {
                btnRes.classList.add('active');
                var panelRes = document.getElementById('panel-misReservas');
                if (panelRes) panelRes.classList.add('active');
                renderReservas();
            }
            var dl = document.querySelector('.datos-layout');
            if (dl) dl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }


    /* FORMULARIO MIS DATOS */
    var formDatos    = document.getElementById('formMisDatos');
    var datosMensaje = document.getElementById('datosMensaje');

    if (formDatos) {
        formDatos.addEventListener('submit', function(e) {
            e.preventDefault();
            var nombre    = document.getElementById('datosNombre').value.trim();
            var telefono  = document.getElementById('datosTelefono').value.trim();
            var direccion = document.getElementById('datosDireccion').value.trim();
            if (!nombre) { mostrarMensaje(datosMensaje, 'El nombre es obligatorio.', 'error'); return; }
            localStorage.setItem(KEY_DATOS, JSON.stringify({ nombre: nombre, telefono: telefono, email: _emailUsuario, direccion: direccion }));
            setText('perfilNombre', nombre);
            mostrarMensaje(datosMensaje, '¡Cambios guardados correctamente!', 'exito');
            setTimeout(function() { datosMensaje.textContent = ''; datosMensaje.className = 'datos-mensaje'; }, 3000);
        });
    }


    /* HELPERS */
    function setInput(id, valor) { var el = document.getElementById(id); if (el) el.value = valor; }
    function setText(id, texto)  { var el = document.getElementById(id); if (el) el.textContent = texto; }
    function mostrarMensaje(el, texto, tipo) {
        if (!el) return;
        el.textContent = texto;
        el.className   = 'datos-mensaje ' + tipo;
    }
});