/* iniciarSesion.js
   Busca el email en AMBAS tablas:
   1. reparify_usuarios     → usuarios regulares
   2. reparify_profesionales → profesionales registrados
   Si encuentra coincidencia y la contraseña es correcta,
   guarda reparify_sesion y redirige al index. */

document.addEventListener('DOMContentLoaded', () => {

    const form        = document.getElementById('formLogin');
    const inputEmail  = document.getElementById('emailLogin');
    const inputPass   = document.getElementById('passwordLogin');
    const btnSubmit   = document.querySelector('.btn-login-submit');
    const formMensaje = document.getElementById('formMensajeLogin');

    if (!form) return;


    /* HELPERS VISUALES */

    function mostrarError(input, errorId, mensaje) {
        input.classList.add('input-error');
        input.classList.remove('input-ok');
        document.getElementById(errorId).textContent = mensaje;
    }

    function mostrarOk(input, errorId) {
        input.classList.remove('input-error');
        input.classList.add('input-ok');
        document.getElementById(errorId).textContent = '';
    }

    function limpiar(input, errorId) {
        input.classList.remove('input-error', 'input-ok');
        document.getElementById(errorId).textContent = '';
    }

    function esEmailValido(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }


    /* BUSCAR EN AMBAS TABLAS
       Devuelve { cuenta, tipo } donde tipo es 'usuario' o 'profesional',
       o null si no se encuentra. */
    function buscarCuenta(email) {
        const emailNorm = email.toLowerCase().trim();

        /* Buscar en usuarios regulares */
        const usuarios = JSON.parse(localStorage.getItem('reparify_usuarios') || '[]');
        const usuario  = usuarios.find(u => u.email.toLowerCase() === emailNorm);
        if (usuario) return { cuenta: usuario, tipo: 'usuario' };

        /* Buscar en profesionales */
        const profesionales = JSON.parse(localStorage.getItem('reparify_profesionales') || '[]');
        const profesional   = profesionales.find(p => p.email?.toLowerCase() === emailNorm);
        if (profesional) return { cuenta: profesional, tipo: 'profesional' };

        return null;
    }

    /* Guarda la sesión con el tipo de cuenta para que el navbar
       y otras páginas puedan usarlo */
    function guardarSesion(cuenta, tipo) {
        localStorage.setItem('reparify_sesion', JSON.stringify({
            email:      cuenta.email,
            nombre:     cuenta.nombre || cuenta.email,
            tipo:       tipo,           /* 'usuario' o 'profesional' */
            fechaLogin: new Date().toISOString()
        }));
    }


    /* VALIDACIONES */

    function validarEmailLogin() {
        const val = inputEmail.value.trim();
        if (!val) {
            mostrarError(inputEmail, 'error-emailLogin', 'Ingresá tu email.');
            return false;
        }
        if (!esEmailValido(val)) {
            mostrarError(inputEmail, 'error-emailLogin', 'Ingresá un email válido.');
            return false;
        }
        mostrarOk(inputEmail, 'error-emailLogin');
        return true;
    }

    function validarPasswordLogin() {
        const val = inputPass.value;
        if (!val) {
            mostrarError(inputPass, 'error-passwordLogin', 'Ingresá tu contraseña.');
            return false;
        }
        mostrarOk(inputPass, 'error-passwordLogin');
        return true;
    }

    /* Validación en tiempo real */
    inputEmail.addEventListener('blur',  validarEmailLogin);
    inputPass.addEventListener('blur',   validarPasswordLogin);
    inputEmail.addEventListener('input', () => limpiar(inputEmail, 'error-emailLogin'));
    inputPass.addEventListener('input',  () => limpiar(inputPass,  'error-passwordLogin'));


    /* SUBMIT */

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        formMensaje.textContent = '';
        formMensaje.className   = 'form-mensaje';

        const emailOk = validarEmailLogin();
        const passOk  = validarPasswordLogin();
        if (!emailOk || !passOk) return;

        /* Buscar en usuarios y profesionales */
        const resultado = buscarCuenta(inputEmail.value);

        /* Email no encontrado en ninguna tabla */
        if (!resultado) {
            formMensaje.textContent = 'Revisá tu email y/o contraseña e intentá de nuevo.';
            formMensaje.classList.add('error');
            return;
        }

        /* Contraseña incorrecta */
        if (resultado.cuenta.password !== inputPass.value) {
            formMensaje.textContent = 'Revisá tu email y/o contraseña e intentá de nuevo.';
            formMensaje.classList.add('error');
            return;
        }

        /* Todo correcto → guardamos sesión con tipo */
        guardarSesion(resultado.cuenta, resultado.tipo);

        btnSubmit.disabled    = true;
        btnSubmit.textContent = 'Ingresando...';

        const nombre = resultado.cuenta.nombre || resultado.cuenta.email;
        formMensaje.textContent = `¡Bienvenido/a, ${nombre}! Redirigiendo...`;
        formMensaje.classList.add('exito');

        /* Redirigir según el tipo de cuenta */
        setTimeout(() => {
            if (resultado.tipo === 'profesional') {
                window.location.href = '/index.html';
            } else {
                window.location.href = '/index.html';
            }
        }, 1500);
    });


    /* TOGGLE VER/OCULTAR CONTRASEÑA */

    document.querySelectorAll('.toggle-pass').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = document.getElementById(btn.dataset.target);
            if (!input) return;
            const ver       = input.type === 'password';
            input.type      = ver ? 'text' : 'password';
            btn.textContent = ver ? '🙈' : '👁';
            btn.setAttribute('aria-label', ver ? 'Ocultar contraseña' : 'Ver contraseña');
        });
    });

});