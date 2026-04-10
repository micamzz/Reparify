
document.addEventListener('DOMContentLoaded', () => {

    const form        = document.getElementById('formRegistro');
    const inputEmail  = document.getElementById('email');
    const inputPass   = document.getElementById('password');
    const inputRepeat = document.getElementById('repetirPassword');
    const formMensaje = document.getElementById('formMensaje');

    if (!form) return;

     /* Muestra borde rojo + mensaje de error debajo del input */
    function mostrarError(input, errorId, mensaje) {
        input.classList.add('input-error');
        input.classList.remove('input-ok');
        document.getElementById(errorId).textContent = mensaje;
    }

     /* Muestra borde verde cuando el campo es válido */
    function mostrarOk(input, errorId) {
        input.classList.remove('input-error');
        input.classList.add('input-ok');
        document.getElementById(errorId).textContent = '';
    }

    function limpiar(input, errorId) {
        input.classList.remove('input-error', 'input-ok');
        document.getElementById(errorId).textContent = '';
    }

    /* Regex*/
    function esEmailValido(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /* LOCALSTORAGE */
 
    /* Devuelve el array de usuarios registrados */
    function obtenerUsuarios() {
        return JSON.parse(localStorage.getItem('reparify_usuarios') || '[]');
    }
 
    /* Verifica si un email ya está registrado (case-insensitive) */
    function emailYaRegistrado(email) {
        const usuarios = obtenerUsuarios();
        return usuarios.some(u => u.email.toLowerCase() === email.toLowerCase());
    }
 
    /* Guarda el nuevo usuario en el array del localStorage */
    function guardarUsuario(email, password) {
        const usuarios = obtenerUsuarios();
        usuarios.push({
            email:         email.toLowerCase().trim(),
            password:      password,
            fechaRegistro: new Date().toISOString()
        });
        localStorage.setItem('reparify_usuarios', JSON.stringify(usuarios));
    }
 

    /* VALIDACIONES FORMULARIO - MENSAJE*/
    function validarEmail() {
        const val = inputEmail.value.trim();
        if (!val) {
            mostrarError(inputEmail, 'error-email', 'El email es obligatorio.');
            return false;
        }
        if (!esEmailValido(val)) {
            mostrarError(inputEmail, 'error-email', 'Ingresá un email válido. Ej: nombre@mail.com');
            return false;
        }
        const usuarios = JSON.parse(localStorage.getItem('reparify_usuarios') || '[]');
        if (usuarios.find(u => u.email.toLowerCase() === val.toLowerCase())) {
            mostrarError(inputEmail, 'error-email', 'Este email ya está registrado. Iniciá sesión.');
            return false;
        }
        mostrarOk(inputEmail, 'error-email');
        return true;
    }

    function validarPassword() {
        const val = inputPass.value;
        if (!val) {
            mostrarError(inputPass, 'error-password', 'La contraseña es obligatoria.');
            return false;
        }
        if (val.length < 6) {
            mostrarError(inputPass, 'error-password', 'Mínimo 6 caracteres.');
            return false;
        }
        mostrarOk(inputPass, 'error-password');
        return true;
    }

    function validarRepetir() {
        const val = inputRepeat.value;
        if (!val) {
            mostrarError(inputRepeat, 'error-repetirPassword', 'Repetí tu contraseña.');
            return false;
        }
        if (val !== inputPass.value) {
            mostrarError(inputRepeat, 'error-repetirPassword', 'Las contraseñas no coinciden.');
            return false;
        }
        mostrarOk(inputRepeat, 'error-repetirPassword');
        return true;
    }


    /*VALIDACION EN TIEMPO REAL*/
    inputEmail.addEventListener('blur',  validarEmail);
    inputPass.addEventListener('blur',   validarPassword);
    inputRepeat.addEventListener('blur', validarRepetir);

    inputEmail.addEventListener('input',  () => limpiar(inputEmail,  'error-email'));
    inputPass.addEventListener('input',   () => limpiar(inputPass,   'error-password'));
    inputRepeat.addEventListener('input', () => limpiar(inputRepeat, 'error-repetirPassword'));


// SUBMIT DEL FORMULARIO
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        formMensaje.textContent = '';
        formMensaje.className = 'form-mensaje';

        const ok = validarEmail() & validarPassword() & validarRepetir();

        if (!ok) {
            return;
        }
        /* Todo válido → guardamos en localStorage */
        guardarUsuario(inputEmail.value, inputPass.value);
 
        /* Deshabilitamos el botón para evitar doble submit */
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Registrando...';
 
        /* Mostramos feedback de éxito */
        formMensaje.textContent = '¡Cuenta creada correctamente! Redirigiendo al inicio de sesión...';
        formMensaje.classList.add('exito');
 
        /* Limpiamos el formulario */
        form.reset();
        [inputEmail, inputPass, inputRepeat].forEach(el => {
            el.classList.remove('input-ok', 'input-error');
        });
 
        /* Redirigimos después de 1.5 segundos */
        setTimeout(() => {
            window.location.href = './iniciarSesion.html';
        }, 1500);
    });
      

    /* VER-OCULTAR CONTRASEÑA */
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