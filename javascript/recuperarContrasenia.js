/* recuperarContrasenia.js
   Maneja el flujo de recuperación de contraseña.

   Busca el email en:
   - reparify_usuarios      (usuarios regulares)
   - reparify_profesionales (profesionales registrados)

   Independientemente de si el email existe o no, muestra
   el mismo mensaje amigable para no revelar qué emails
   están registrados (práctica de seguridad estándar).

   En un proyecto real, aquí se llamaría a un backend
   que envíe el correo. Por ahora simula el envío. */

document.addEventListener('DOMContentLoaded', () => {

    const form              = document.getElementById('formRecuperar');
    const inputEmail        = document.getElementById('emailRecuperar');
    const btnRecuperar      = document.getElementById('btnRecuperar');
    const mensajeEl         = document.getElementById('formMensajeRecuperar');
    const vistaFormulario   = document.getElementById('vistaFormulario');
    const vistaConfirmacion = document.getElementById('vistaConfirmacion');
    const emailEnviadoEl    = document.getElementById('emailEnviado');
    const btnReintentar     = document.getElementById('btnReintentar');

    if (!form) return;


    /* HELPERS */

    function esEmailValido(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function mostrarError(mensaje) {
        inputEmail.classList.add('input-error');
        inputEmail.classList.remove('input-ok');
        document.getElementById('error-emailRecuperar').textContent = mensaje;
    }

    function limpiarError() {
        inputEmail.classList.remove('input-error', 'input-ok');
        document.getElementById('error-emailRecuperar').textContent = '';
    }


    /* BUSCAR EMAIL EN AMBAS TABLAS */

    function emailExisteEnBdd(email) {
        const emailNorm = email.toLowerCase().trim();

        const usuarios = JSON.parse(localStorage.getItem('reparify_usuarios') || '[]');
        if (usuarios.some(u => u.email.toLowerCase() === emailNorm)) return true;

        const profesionales = JSON.parse(localStorage.getItem('reparify_profesionales') || '[]');
        if (profesionales.some(p => p.email?.toLowerCase() === emailNorm)) return true;

        return false;
    }


    /* VALIDACIÓN EN TIEMPO REAL */

    inputEmail.addEventListener('input', limpiarError);

    inputEmail.addEventListener('blur', () => {
        const val = inputEmail.value.trim();
        if (!val) {
            mostrarError('Ingresá tu email.');
        } else if (!esEmailValido(val)) {
            mostrarError('Ingresá un email válido. Ej: nombre@mail.com');
        } else {
            inputEmail.classList.remove('input-error');
            inputEmail.classList.add('input-ok');
            document.getElementById('error-emailRecuperar').textContent = '';
        }
    });


    /* SUBMIT */

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        mensajeEl.textContent = '';
        mensajeEl.className   = 'form-mensaje';

        const email = inputEmail.value.trim();

        /* Validación de formato */
        if (!email) {
            mostrarError('Ingresá tu email para continuar.');
            return;
        }
        if (!esEmailValido(email)) {
            mostrarError('Ingresá un email válido. Ej: nombre@mail.com');
            return;
        }

        /* Estado de carga */
        btnRecuperar.disabled    = true;
        btnRecuperar.textContent = 'Verificando...';

        /* Simulamos una pequeña demora (como si llamáramos a un backend) */
        setTimeout(() => {

            /* Verificamos si existe — pero NO lo comunicamos al usuario
               para no revelar qué emails están registrados */
            const existe = emailExisteEnBdd(email);

            /* Si existe guardamos un token simulado en localStorage
               (en producción esto lo haría el backend) */
            if (existe) {
                const token = generarToken();
                const vence = new Date(Date.now() + 30 * 60 * 1000).toISOString(); /* 30 min */
                localStorage.setItem('reparify_reset_token', JSON.stringify({
                    email:  email.toLowerCase().trim(),
                    token,
                    vence
                }));
                console.info(`[Dev] Token de reset generado para ${email}: ${token}`);
            }

            /* Siempre mostramos la vista de confirmación con el mismo mensaje */
            emailEnviadoEl.textContent = email;
            vistaFormulario.style.display   = 'none';
            vistaConfirmacion.style.display = 'block';

            btnRecuperar.disabled    = false;
            btnRecuperar.textContent = 'Recuperar contraseña';

        }, 1200);
    });


    /* BOTÓN "Intentar con otro email" */

    btnReintentar?.addEventListener('click', () => {
        vistaConfirmacion.style.display = 'none';
        vistaFormulario.style.display   = 'block';
        inputEmail.value = '';
        limpiarError();
        mensajeEl.textContent = '';
        mensajeEl.className   = 'form-mensaje';
        inputEmail.focus();
    });


    /* GENERAR TOKEN ALEATORIO (simulación) */

    function generarToken() {
        return Array.from(crypto.getRandomValues(new Uint8Array(24)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

});