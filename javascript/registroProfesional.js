/* registroProfesional.js
   Maneja el formulario de 3 pasos para el registro de profesionales.
   Al completar los 3 pasos guarda el profesional en localStorage
   bajo la clave 'reparify_profesionales', que es la misma que
   lee profesionales.js al combinar con los hardcodeados. */

document.addEventListener('DOMContentLoaded', () => {

    /* Si ya hay sesión activa no tiene sentido registrarse de nuevo */
    const sesionActiva = JSON.parse(localStorage.getItem('reparify_sesion') || 'null');
    if (sesionActiva) {
        /* Si es profesional, ir a su perfil; si es usuario, al index */
        if (sesionActiva.tipo === 'profesional') {
            window.location.href = '/Pages/miPerfilProfesional.html';
        } else {
            window.location.href = '/index.html';
        }
        return;
    }


    /* Paso actual (1, 2 o 3) */
    let pasoActual = 1;

    /* Acumulamos los datos de cada paso acá */
    const datosPro = {
        paso1: {},
        paso2: {},
        paso3: {}
    };


    /* HELPERS DE VALIDACIÓN */

    function esEmailValido(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function mostrarError(inputId, errorId, msg) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        if (input) input.classList.add('input-error');
        if (error) error.textContent = msg;
    }

    function limpiarError(inputId, errorId) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        if (input) input.classList.remove('input-error');
        if (error) error.textContent = '';
    }

    function limpiarTodosLosErrores(ids) {
        ids.forEach(({ inputId, errorId }) => limpiarError(inputId, errorId));
    }

    /* Limpia errores al escribir */
    function bindLimpiarAlEscribir(inputId, errorId) {
        const el = document.getElementById(inputId);
        if (el) el.addEventListener('input', () => limpiarError(inputId, errorId));
    }


    /* INDICADOR DE PASOS: actualiza dots y líneas */

    function actualizarIndicador(paso) {
        for (let i = 1; i <= 3; i++) {
            const dot = document.getElementById(`dot${i}`);
            if (!dot) continue;
            dot.classList.remove('activo', 'completado');
            if (i < paso) dot.classList.add('completado');
            else if (i === paso) dot.classList.add('activo');
        }
        for (let i = 1; i <= 2; i++) {
            const linea = document.getElementById(`linea${i}`);
            if (!linea) continue;
            if (i < paso) linea.classList.add('activa');
            else linea.classList.remove('activa');
        }
    }


    /* NAVEGAR ENTRE PASOS */

    function irAPaso(numero) {
        document.querySelectorAll('.paso-contenido').forEach(p => p.classList.remove('activo'));
        const target = document.getElementById(`paso${numero}`);
        if (target) target.classList.add('activo');
        pasoActual = numero;
        actualizarIndicador(numero);
    }


    /* PASO 1: validación y avance */

    const formPaso1 = document.getElementById('formPaso1');
    const campos1 = [
        { inputId: 'p1Nombre', errorId: 'err-p1Nombre' },
        { inputId: 'p1Dni', errorId: 'err-p1Dni' },
        { inputId: 'p1Telefono', errorId: 'err-p1Telefono' },
        { inputId: 'p1Email', errorId: 'err-p1Email' },
        { inputId: 'p1Password', errorId: 'err-p1Password' }
    ];

    campos1.forEach(c => bindLimpiarAlEscribir(c.inputId, c.errorId));

    if (formPaso1) {
        formPaso1.addEventListener('submit', (e) => {
            e.preventDefault();
            limpiarTodosLosErrores(campos1);
            let valido = true;

            const nombre = document.getElementById('p1Nombre').value.trim();
            const dni = document.getElementById('p1Dni').value.trim();
            const telefono = document.getElementById('p1Telefono').value.trim();
            const email = document.getElementById('p1Email').value.trim();
            const password = document.getElementById('p1Password').value;

            if (!nombre) {
                mostrarError('p1Nombre', 'err-p1Nombre', 'El nombre es obligatorio.'); valido = false;
            }
            if (!dni) {
                mostrarError('p1Dni', 'err-p1Dni', 'El DNI o CUIT es obligatorio.'); valido = false;
            }
            if (!telefono) {
                mostrarError('p1Telefono', 'err-p1Telefono', 'El teléfono es obligatorio.'); valido = false;
            }
            if (!email) {
                mostrarError('p1Email', 'err-p1Email', 'El email es obligatorio.'); valido = false;
            } else if (!esEmailValido(email)) {
                mostrarError('p1Email', 'err-p1Email', 'Ingresá un email válido.'); valido = false;
            } else if (emailYaRegistrado(email)) {
                mostrarError('p1Email', 'err-p1Email', 'Este email ya está registrado.'); valido = false;
            }
            if (!password || password.length < 6) {
                mostrarError('p1Password', 'err-p1Password', 'Mínimo 6 caracteres.'); valido = false;
            }

            if (!valido) return;

            datosPro.paso1 = { nombre, dni, telefono, email, password };
            irAPaso(2);
        });
    }


    /* PASO 2: validación y avance */

    const formPaso2 = document.getElementById('formPaso2');
    const campos2 = [
        { inputId: 'p2Especialidad', errorId: 'err-p2Especialidad' },
        { inputId: 'p2Zona', errorId: 'err-p2Zona' },
        { inputId: 'p2Matricula', errorId: 'err-p2Matricula' },
        { inputId: 'p2Certificado', errorId: 'err-p2Certificado' }
    ];

    campos2.forEach(c => bindLimpiarAlEscribir(c.inputId, c.errorId));

    /* Actualiza el label del input file con el nombre del archivo */
    const inputFile = document.getElementById('p2Certificado');
    if (inputFile) {
        inputFile.addEventListener('change', () => {
            const label = document.getElementById('p2CertificadoLabel');
            if (label && inputFile.files[0]) {
                label.textContent = `✅ ${inputFile.files[0].name}`;
                label.classList.add('con-archivo');
            }
        });
    }

    document.getElementById('btnVolver2')?.addEventListener('click', () => irAPaso(1));

    if (formPaso2) {
        formPaso2.addEventListener('submit', (e) => {
            e.preventDefault();
            limpiarTodosLosErrores(campos2);
            let valido = true;

            const especialidad = document.getElementById('p2Especialidad').value;
            const zona = document.getElementById('p2Zona').value;
            const matricula = document.getElementById('p2Matricula').value.trim();
            const certificado = document.getElementById('p2Certificado').files[0];

            if (!especialidad) {
                mostrarError('p2Especialidad', 'err-p2Especialidad', 'Seleccioná una especialidad.'); valido = false;
            }
            if (!zona) {
                mostrarError('p2Zona', 'err-p2Zona', 'Seleccioná tu zona de cobertura.'); valido = false;
            }
            if (!matricula) {
                mostrarError('p2Matricula', 'err-p2Matricula', 'La matrícula es obligatoria.'); valido = false;
            }
            if (!certificado) {
                mostrarError('p2Certificado', 'err-p2Certificado', 'Adjuntá el certificado de antecedentes.'); valido = false;
            }

            if (!valido) return;

            datosPro.paso2 = {
                especialidad,
                zona,
                matricula,
                certificadoNombre: certificado.name
            };
            irAPaso(3);
        });
    }


    /* PASO 3: validación y guardado final */

    const formPaso3 = document.getElementById('formPaso3');
    const campos3 = [
        { inputId: 'p3Email', errorId: 'err-p3Email' },
        { inputId: 'p3Cbu', errorId: 'err-p3Cbu' },
        { inputId: 'p3Domicilio', errorId: 'err-p3Domicilio' }
    ];

    campos3.forEach(c => bindLimpiarAlEscribir(c.inputId, c.errorId));

    document.getElementById('btnVolver3')?.addEventListener('click', () => irAPaso(2));

    if (formPaso3) {
        formPaso3.addEventListener('submit', (e) => {
            e.preventDefault();
            limpiarTodosLosErrores(campos3);

            const mensajeEl = document.getElementById('formMensajePro');
            mensajeEl.textContent = '';
            mensajeEl.className = 'form-mensaje';

            let valido = true;

            const emailFact = document.getElementById('p3Email').value.trim();
            const cbu = document.getElementById('p3Cbu').value.trim();
            const domicilio = document.getElementById('p3Domicilio').value.trim();
            const terminos = document.getElementById('p3Terminos').checked;

            if (!emailFact) {
                mostrarError('p3Email', 'err-p3Email', 'El email de facturación es obligatorio.'); valido = false;
            } else if (!esEmailValido(emailFact)) {
                mostrarError('p3Email', 'err-p3Email', 'Ingresá un email válido.'); valido = false;
            }
            if (!cbu) {
                mostrarError('p3Cbu', 'err-p3Cbu', 'El CBU o alias es obligatorio.'); valido = false;
            }
            if (!domicilio) {
                mostrarError('p3Domicilio', 'err-p3Domicilio', 'El domicilio fiscal es obligatorio.'); valido = false;
            }
            if (!terminos) {
                const err = document.getElementById('err-p3Terminos');
                if (err) err.textContent = 'Debés aceptar los términos y condiciones.';
                valido = false;
            }

            if (!valido) return;

            datosPro.paso3 = { emailFact, cbu, domicilio };

            /* Guardamos el profesional en localStorage */
            guardarProfesional();

            /* Feedback de éxito */
            const btnCont = formPaso3.querySelector('.btn-continuar');
            if (btnCont) {
                btnCont.disabled = true;
                btnCont.textContent = 'Registrando...';
            }

            mensajeEl.textContent = '¡Registro exitoso! Redirigiendo...';
            mensajeEl.classList.add('exito');

            /* Damos tiempo al navegador para confirmar el localStorage antes de redirigir */
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 1500);
        });
    }


    /* GUARDAR EN LOCALSTORAGE
       El objeto del profesional usa el mismo formato que los
       hardcodeados en profesionales.js para que se integren sin problemas. */

    // function guardarProfesional() {
    //     const existentes = JSON.parse(localStorage.getItem('reparify_profesionales') || '[]');

    //     /* Generamos un id único mayor a los hardcodeados (que van del 1 al 15) */
    //     const nuevoId = existentes.length > 0
    //         ? Math.max(...existentes.map(p => p.id)) + 1
    //         : 100;

    //     const nuevoProfesional = {
    //         id: nuevoId,
    //         nombre: datosPro.paso1.nombre,
    //         profesion: datosPro.paso2.especialidad,
    //         ubicacion: `${datosPro.paso2.zona}, CABA`,
    //         zona: datosPro.paso2.zona,
    //         desde: formatearFechaActual(),
    //         trabajos: 0,
    //         valoracion: 0,
    //         respuesta: 'N/A',
    //         foto: '',          /* sin foto por ahora */
    //         /* Guardamos el resto de los datos para uso futuro */
    //         dni: datosPro.paso1.dni,
    //         telefono: datosPro.paso1.telefono,
    //         email: datosPro.paso1.email,
    //         matricula: datosPro.paso2.matricula,
    //         cbu: datosPro.paso3.cbu,
    //         domicilio: datosPro.paso3.domicilio,
    //         esRegistrado: true
    //     };

    //     existentes.push(nuevoProfesional);
    //     localStorage.setItem('reparify_profesionales', JSON.stringify(existentes));

    //      const usuarios = JSON.parse(localStorage.getItem('reparify_usuarios') || '[]');

    //       usuarios.push({
    //     nombre: datosPro.paso1.nombre,
    //     email: datosPro.paso1.email,
    //     password: datosPro.paso1.password,
    //     tipo: 'profesional' 
    // });

    //     /* También guardamos la sesión del profesional si es necesario */
    //     localStorage.setItem('reparify_sesion_pro', JSON.stringify({
    //         email: datosPro.paso1.email,
    //         nombre: datosPro.paso1.nombre,
    //         profesion: datosPro.paso2.especialidad,
    //         fechaLogin: new Date().toISOString()
    //     }));
    // }

    function guardarProfesional() {
    const existentes = JSON.parse(localStorage.getItem('reparify_profesionales') || '[]');

    const nuevoId = existentes.length > 0
        ? Math.max(...existentes.map(p => p.id)) + 1
        : 100;

    const nuevoProfesional = {
        id: nuevoId,
        nombre: datosPro.paso1.nombre,
        profesion: datosPro.paso2.especialidad,
        ubicacion: `${datosPro.paso2.zona}, CABA`,
        zona: datosPro.paso2.zona,
        desde: formatearFechaActual(),
        trabajos: 0,
        valoracion: 0,
        respuesta: 'N/A',
        foto: '',
        dni: datosPro.paso1.dni,
        telefono: datosPro.paso1.telefono,
        email: datosPro.paso1.email,
        password: datosPro.paso1.password, // 🔥 IMPORTANTE
        matricula: datosPro.paso2.matricula,
        cbu: datosPro.paso3.cbu,
        domicilio: datosPro.paso3.domicilio,
        esRegistrado: true
    };

    existentes.push(nuevoProfesional);
    localStorage.setItem('reparify_profesionales', JSON.stringify(existentes));

    // 🔥🔥 AGREGAR ESTO
    const usuarios = JSON.parse(localStorage.getItem('reparify_usuarios') || '[]');

    usuarios.push({
        nombre: datosPro.paso1.nombre,
        email: datosPro.paso1.email,
        password: datosPro.paso1.password,
        tipo: 'profesional' // 👈 clave
    });

    localStorage.setItem('reparify_usuarios', JSON.stringify(usuarios));

    // sesión
    localStorage.setItem('reparify_sesion', JSON.stringify({
        email: datosPro.paso1.email,
        nombre: datosPro.paso1.nombre,
        tipo: 'profesional',
        fechaLogin: new Date().toISOString()
    }));
}
    function formatearFechaActual() {
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const hoy = new Date();
        return `${meses[hoy.getMonth()]} ${hoy.getFullYear()}`;
    }


    /* VERIFICAR SI EL EMAIL YA EXISTE como profesional o usuario */

    function emailYaRegistrado(email) {
        const profStorage = JSON.parse(localStorage.getItem('reparify_profesionales') || '[]');
        const usersStorage = JSON.parse(localStorage.getItem('reparify_usuarios') || '[]');
        const emailMin = email.toLowerCase();
        return (
            profStorage.some(p => p.email?.toLowerCase() === emailMin) ||
            usersStorage.some(u => u.email?.toLowerCase() === emailMin)
        );
    }


    /* TOGGLE VER/OCULTAR CONTRASEÑA */

    document.querySelectorAll('.toggle-pass').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = document.getElementById(btn.dataset.target);
            if (!input) return;
            const ver = input.type === 'password';
            input.type = ver ? 'text' : 'password';
            btn.textContent = ver ? '🙈' : '👁';
        });
    });

});