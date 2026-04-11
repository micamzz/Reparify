/* 
   1. Protege la ruta → si no hay sesión redirige al login
   2. Carga datos del usuario desde localStorage
      - Nombre Completo yEmail: viene de 'reparify_sesion' (el que usó al registrarse)
      - Resto de datos: 'reparify_datos_{email}'
   3. Servicios solicitados: lee el historial de 'reparify_historial_{email}'
      Arranca en 0 y crece con cada servicio que solicite
   4. Menú lateral → paneles
   5. Formulario editable → guarda en localStorage
   6. Banner valoración pendiente
   7. Cerrar sesión
   */

document.addEventListener('DOMContentLoaded', () => {

    /* Si no hay sesión activa, redirigir al login */
    const sesion = JSON.parse(localStorage.getItem('reparify_sesion') || 'null');

    if (!sesion) {
        window.location.href = './iniciarSesion.html';
        return;
    }

    /* Email real del usuario (el que usó al registrarse) */
    const emailUsuario = sesion.email;

    const nombreUsuario = sesion.nombre;

    /* Claves de localStorage para este usuario */
    const KEY_DATOS = `reparify_datos_${emailUsuario}`;
    const KEY_HISTORIAL = `reparify_historial_${emailUsuario}`;
    const KEY_NAME = `reparify_nombre_${nombreUsuario}`;


    /* 
       2. CARGA DE DATOS DEL USUARIO
       El nombre y email siempre viene de la sesión (registro).
       El resto viene de 'reparify_datos_{email}' si fue guardado. */
    const datosPerfil = JSON.parse(localStorage.getItem(KEY_DATOS) || 'null');

    if (datosPerfil) {
        /* Datos del formulario */
        setInput('datosNombre', datosPerfil.nombre|| nombreUsuario);
        setInput('datosTelefono', datosPerfil.telefono || '');
        setInput('datosEmail', emailUsuario); 
        setInput('datosDireccion', datosPerfil.direccion || '');

        /* Card de perfil */
        if (datosPerfil.nombre) setText('perfilNombre', datosPerfil.nombre);
        if (datosPerfil.direccion) setText('perfilUbicacion', datosPerfil.direccion);
    } else {
        /* Primera vez: solo tenemos el email */
        setInput('datosEmail', emailUsuario);
        setInput('datosNombre', nombreUsuario);
        setText('perfilNombre', nombreUsuario);  
    }

    /* El campo email siempre muestra el email de registro y no se puede editar */
    const inputEmail = document.getElementById('datosEmail');
    if (inputEmail) {
        inputEmail.readOnly = true;
        inputEmail.style.opacity = '0.6';
        inputEmail.style.cursor = 'not-allowed';
        inputEmail.title = 'El email no se puede modificar';
    }


    /*  3. CONTADOR DE SERVICIOS SOLICITADOS
       Lee el historial del localStorage y cuenta los items.
       Si no hay historial, muestra 0.*/
    const historial = JSON.parse(localStorage.getItem(KEY_HISTORIAL) || '[]');
    setText('statServicios', historial.length);


    /*   4. MENÚ LATERAL → PANELES*/
    const menuItems = document.querySelectorAll('.menu-item[data-panel]');
    const paneles = document.querySelectorAll('.panel');

    menuItems.forEach(btn => {
        btn.addEventListener('click', () => {
            menuItems.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            paneles.forEach(p => p.classList.remove('active'));
            const target = document.getElementById(`panel-${btn.dataset.panel}`);
            if (target) target.classList.add('active');
        });
    });


    /*  5. FORMULARIO "MIS DATOS" → GUARDAR
       Guarda nombre, teléfono y dirección.
       El email NO se guarda desde aquí (viene del registro). */
    const formDatos = document.getElementById('formMisDatos');
    const datosMensaje = document.getElementById('datosMensaje');

    if (formDatos) {
        formDatos.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('datosNombre').value.trim();
            const telefono = document.getElementById('datosTelefono').value.trim();
            const direccion = document.getElementById('datosDireccion').value.trim();

            if (!nombre) {
                mostrarMensaje(datosMensaje, 'El nombre es obligatorio.', 'error');
                return;
            }

     /* Guardamos — el email no se puede cambiar */
            localStorage.setItem(KEY_DATOS, JSON.stringify({
                nombre,
                telefono,
                email: emailUsuario,   /* siempre el del registro */
                direccion
            }));

     /* Actualizamos la card en tiempo real */
            setText('perfilNombre', nombre);
            if (direccion) setText('perfilUbicacion', direccion);

            mostrarMensaje(datosMensaje, '¡Cambios guardados correctamente!', 'exito');

            setTimeout(() => {
                datosMensaje.textContent = '';
                datosMensaje.className = 'datos-mensaje';
            }, 3000);
        });
    }


    /* 
       6. BANNER VALORACIÓN PENDIENTE
       Solo se muestra si hay algún servicio 'en-progreso'
       con valoración null en el historial.
   */
    const banner = document.getElementById('bannerValoracion');
    const btnCerrarBanner = document.getElementById('btnBannerCerrar');
    const btnValorarAhora = document.getElementById('btnValorarAhora');

    /* Buscamos si hay algún servicio pendiente de valorar */
    const pendiente = historial.find(s => s.estado === 'en-progreso' && s.valoracion === null);

    if (!pendiente && banner) {
        /* Si no hay pendiente, ocultamos el banner */
        banner.style.display = 'none';
    } else if (pendiente && banner) {
        /* Actualizamos el texto del banner con los datos reales */
        setText('bannerProfesional', pendiente.tecnico);
        setText('bannerServicio', pendiente.servicio);
    }

    if (btnCerrarBanner && banner) {
        btnCerrarBanner.addEventListener('click', () => {
            banner.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => banner.remove(), 300);
        });
    }

    if (btnValorarAhora) {
        btnValorarAhora.addEventListener('click', () => {
            document.querySelector('.historial-wrapper')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    //   HELPER
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
        el.className = `datos-mensaje ${tipo}`;
    }

});