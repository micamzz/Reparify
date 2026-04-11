/* contacto.js
   Validación del formulario de contacto.
   Los mensajes de error aparecen debajo de cada campo en rojo.
   No usa HTML required, todo se maneja desde acá. */

document.addEventListener('DOMContentLoaded', () => {

    const form      = document.getElementById('formContacto');
    const feedback  = document.getElementById('contactoFeedback');
    const btnEnviar = document.querySelector('.btn-enviar');

    if (!form) return;

    const inputNombre  = document.getElementById('contactoNombre');
    const inputEmail   = document.getElementById('contactoEmail');
    const inputMensaje = document.getElementById('contactoMensaje');


    /* HELPERS */

    function esEmailValido(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function mostrarError(input, errorId, mensaje) {
        input.classList.add('input-error');
        document.getElementById(errorId).textContent = mensaje;
    }

    function limpiarError(input, errorId) {
        input.classList.remove('input-error');
        document.getElementById(errorId).textContent = '';
    }


    /* VALIDACIONES INDIVIDUALES */

    function validarNombre() {
        const val = inputNombre.value.trim();
        if (!val) {
            mostrarError(inputNombre, 'error-nombre', 'El nombre es obligatorio.');
            return false;
        }
        limpiarError(inputNombre, 'error-nombre');
        return true;
    }

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
        limpiarError(inputEmail, 'error-email');
        return true;
    }

    function validarMensaje() {
        const val = inputMensaje.value.trim();
        if (!val) {
            mostrarError(inputMensaje, 'error-mensaje', 'Escribí tu consulta antes de enviar.');
            return false;
        }
        if (val.length < 10) {
            mostrarError(inputMensaje, 'error-mensaje', 'La consulta es muy corta. Contanos más detalles.');
            return false;
        }
        limpiarError(inputMensaje, 'error-mensaje');
        return true;
    }


    /* VALIDACIÓN EN TIEMPO REAL al salir de cada campo */

    inputNombre.addEventListener('blur',  validarNombre);
    inputEmail.addEventListener('blur',   validarEmail);
    inputMensaje.addEventListener('blur', validarMensaje);

    /* Limpia el error mientras el usuario escribe */
    inputNombre.addEventListener('input',  () => limpiarError(inputNombre,  'error-nombre'));
    inputEmail.addEventListener('input',   () => limpiarError(inputEmail,   'error-email'));
    inputMensaje.addEventListener('input', () => limpiarError(inputMensaje, 'error-mensaje'));


    /* SUBMIT */

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        feedback.textContent = '';
        feedback.className   = 'contacto-feedback';

        /* Validamos todo junto para mostrar todos los errores */
        const nombreOk  = validarNombre();
        const emailOk   = validarEmail();
        const mensajeOk = validarMensaje();

        if (!nombreOk || !emailOk || !mensajeOk) {
            return;
        }

        /* Simulamos el envío (acá conectarías con un backend o servicio de email) */
        btnEnviar.disabled     = true;
  

        setTimeout(() => {
            feedback.textContent = '¡Mensaje enviado! Nos pondremos en contacto pronto.';
            feedback.classList.add('exito');

            form.reset();
            btnEnviar.disabled    = false;
            btnEnviar.textContent = 'Enviar';

            /* Limpiamos el mensaje de éxito después de 5 segundos */
            setTimeout(() => {
                feedback.textContent = '';
                feedback.className   = 'contacto-feedback';
            }, 5000);
        }, 1200);
    });

});