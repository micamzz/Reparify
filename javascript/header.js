/* header.js
   Carga el navbar y gestiona los 3 estados:
   - Sin sesión → muestra Iniciar sesión / Registrarse
   - Sesión usuario → muestra Mi perfil / Cerrar sesión
   - Sesión profesional → muestra Mi perfil (pro) / Cerrar sesión */

export async function cargarNavbar() {
    try {
        const response = await fetch('/components/navbar.html');
        if (!response.ok) throw new Error('Navbar no encontrado');

        const data = await response.text();
        document.getElementById('nav-placeholder').innerHTML = data;

        marcarPaginaActiva();
        actualizarEstadoSesion();
        configurarHamburguesa();

    } catch (error) {
        console.error('Error cargando navbar:', error);
    }
}

/* Muestra u oculta los bloques según la sesión activa */
function actualizarEstadoSesion() {
    const sesion = JSON.parse(localStorage.getItem('reparify_sesion') || 'null');

    /* Referencias desktop */
    const navGuest      = document.getElementById('navGuest');
    const navUser       = document.getElementById('navUser');
    const navProfesional = document.getElementById('navProfesional');

    /* Referencias mobile */
    const navMobileGuest = document.getElementById('navMobileGuest');
    const navMobileUser  = document.getElementById('navMobileUser');
    const navMobilePro   = document.getElementById('navMobilePro');

    function ocultarTodos() {
        [navGuest, navUser, navProfesional,
         navMobileGuest, navMobileUser, navMobilePro]
            .forEach(el => { if (el) el.style.display = 'none'; });
    }

    ocultarTodos();

    if (!sesion) {
        /* Sin sesión */
        if (navGuest)       navGuest.style.display       = 'flex';
        if (navMobileGuest) navMobileGuest.style.display = 'flex';
        return;
    }

    if (sesion.tipo === 'profesional') {
        /* Profesional logueado */
        if (navProfesional) navProfesional.style.display = 'flex';
        if (navMobilePro)   navMobilePro.style.display   = 'flex';

        /* Cerrar sesión desktop */
        document.getElementById('btnLogoutPro')
            ?.addEventListener('click', cerrarSesion);

        /* Cerrar sesión mobile */
        document.getElementById('btnLogoutMobilePro')
            ?.addEventListener('click', cerrarSesion);

    } else {
        /* Usuario regular logueado */
        if (navUser)       navUser.style.display       = 'flex';
        if (navMobileUser) navMobileUser.style.display = 'flex';

        /* Cerrar sesión desktop */
        document.getElementById('btnLogout')
            ?.addEventListener('click', cerrarSesion);

        /* Cerrar sesión mobile */
        document.getElementById('btnLogoutMobile')
            ?.addEventListener('click', cerrarSesion);
    }
}

function cerrarSesion() {
    localStorage.removeItem('reparify_sesion');
    window.location.href = '/index.html';
}

/* Marca el link activo según la URL */
// function marcarPaginaActiva() {
//     const path = window.location.pathname;
//     document.querySelectorAll('.nav-link').forEach(link => {
//         const href = link.getAttribute('href')
//             .replace('./', '/')
//             .replace('../', '/');
//         if (href !== '/' && path.includes(href)) {
//             link.classList.add('active');
//         }
//     });
// }

function marcarPaginaActiva() {
    const path = window.location.pathname;
    const hash = window.location.hash;

    document.querySelectorAll('.nav-link').forEach(link => {
        const href = (link.getAttribute('href') || '').split('?')[0];

        const [linkPath, linkHash] = href.split('#');

        // con Hash #
        if (linkHash) {
            if (path === linkPath && hash === '#' + linkHash) {
                link.classList.add('active');
            }
            return;
        }

        // Sin Hash
        if (path === href && hash === '') {
            link.classList.add('active');
        }
    });
}


/* Hamburguesa */
function configurarHamburguesa() {
    const hamburger   = document.getElementById('hamburger');
    const mobilePanel = document.getElementById('menuMobile');
    const navbar      = document.querySelector('.navbar');

    if (!hamburger || !mobilePanel) return;

    function abrirMenu() {
        mobilePanel.classList.add('mobile-open');
        hamburger.classList.add('is-active');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function cerrarMenu() {
        mobilePanel.classList.remove('mobile-open');
        hamburger.classList.remove('is-active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
        mobilePanel.classList.contains('mobile-open') ? cerrarMenu() : abrirMenu();
    });

    mobilePanel.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', cerrarMenu);
    });

    document.addEventListener('click', (e) => {
        if (mobilePanel.classList.contains('mobile-open') && !navbar.contains(e.target)) {
            cerrarMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') cerrarMenu();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) cerrarMenu();
    });
}

 /* 
       3. NAVBAR HIDE/SHOW EN SCROLL
       Oculta el navbar al bajar, lo muestra al subir.
       Cierra el menú móvil antes de ocultar el navbar.
     */
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    if (navbar) {
        navbar.style.transition = 'transform 0.3s ease';

        window.addEventListener('scroll', () => {
            const navLinks = document.querySelector('.nav-links');
            /* No ocultar el navbar si el menú móvil está abierto */
            if (navLinks && navLinks.classList.contains('mobile-open')) return;

            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 80) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    //  Scroll suave para links internos tipo href="#seccion".
     document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });