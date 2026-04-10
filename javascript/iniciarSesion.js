/* ============================================================
   REPARIFY – iniciarSesion.js

   Flujo:
   1. Valida que los campos no estén vacíos
   2. Busca el email en localStorage ('reparify_usuarios')
   3. Si existe y la contraseña coincide → inicia sesión
   4. Guarda la sesión activa en localStorage ('reparify_sesion')
   5. Redirige al index

   Si el email no existe o la contraseña no coincide → error.

   Solo se carga en iniciarSesion.html
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------
       REFERENCIAS AL DOM
    -------------------------------------------------------- */
    const form        = document.getElementById('formLogin');
    const inputEmail  = document.getElementById('emailLogin');
    const inputPass   = document.getElementById('passwordLogin');
    const btnSubmit   = document.querySelector('.btn-login-submit');
    const formMensaje = document.getElementById('formMensajeLogin');

    if (!form) return;


    /* FUNCIONES */
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


    /* LOCALSTORAGE – HELPERS */
    function obtenerUsuarios() {
        return JSON.parse(localStorage.getItem('reparify_usuarios') || '[]');
    }

    /* Busca el usuario por email */
    function buscarUsuario(email) {
        const usuarios = obtenerUsuarios();
        return usuarios.find(u => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
    }

    /* Guarda la sesión activa (sin la contraseña) */
    function guardarSesion(usuario) {
        const sesion = {
            email:        usuario.email,
            fechaLogin:   new Date().toISOString()
        };
        localStorage.setItem('reparify_sesion', JSON.stringify(sesion));
    }


    /* Validaciones individuales- */
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


    /* Validacion en tiempo real */
    inputEmail.addEventListener('blur',  validarEmailLogin);
    inputPass.addEventListener('blur',   validarPasswordLogin);

    inputEmail.addEventListener('input', () => limpiar(inputEmail, 'error-emailLogin'));
    inputPass.addEventListener('input',  () => limpiar(inputPass,  'error-passwordLogin'));


    /*submit */
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        formMensaje.textContent = '';
        formMensaje.className = 'form-mensaje';

        /* Validamos formato de los campos */
        const emailOk = validarEmailLogin();
        const passOk  = validarPasswordLogin();
        if (!emailOk || !passOk) return;

        /* Buscamos el usuario en localStorage */
        const usuario = buscarUsuario(inputEmail.value);

        /* Si el email no existe o la contraseña es incorrecta , mensaje que abarca ambos casos */
        if(!usuario || usuario.password !== inputPass.value){
            formMensaje.textContent = 'Revisá tu email y/o contraseña e intentá de nuevo.';
            formMensaje.classList.add('error');
            return;
        }
        
        /* Todo correcto → iniciamos sesión */
        guardarSesion(usuario);

        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Ingresando...';

        formMensaje.textContent = `¡Bienvenido/a de nuevo! Redirigiendo...`;
        formMensaje.classList.add('exito');

        /* Redirigir al index después de 1.5s */
        setTimeout(() => {
            window.location.href = '/index.html';
        }, 1500);
    });


    /*  VER / OCULTAR CONTRASEÑA */
    document.querySelectorAll('.toggle-pass').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = document.getElementById(btn.dataset.target);
            if (!input) return;

            const verPassword   = input.type === 'password';
            input.type          = verPassword ? 'text' : 'password';
            btn.textContent     = verPassword ? '🙈' : '👁';
            btn.setAttribute('aria-label', verPassword ? 'Ocultar contraseña' : 'Ver contraseña');
        });
    });

});