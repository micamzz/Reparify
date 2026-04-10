export async function cargarNavbar() {
    const prefix = window.location.pathname.includes('/Pages/') ? '../' : './';
 
    try {
        const response = await fetch(prefix + 'components/navbar.html');
        if (!response.ok) throw new Error('Navbar no encontrado');
 
        const data = await response.text();
        document.getElementById('nav-placeholder').innerHTML = data;
 
        marcarPaginaActiva();
        configurarHamburguesa();
        actualizarNavbar()
 
    } catch (error) {
        console.error('Error cargando navbar:', error);
    }
 }

 function actualizarNavbar() {
    const guest = document.getElementById('navGuest');
    const user  = document.getElementById('navUser');

    const sesion = JSON.parse(localStorage.getItem('reparify_sesion'));

    if (sesion) {
        guest.style.display = 'none';
        user.style.display  = 'flex';

        document.getElementById('btnLogout').addEventListener('click', () => {
            localStorage.removeItem('reparify_sesion');
            window.location.href = '/index.html';
        });

    } else {
        guest.style.display = 'flex';
        user.style.display  = 'none';
    }
 }
 /* Marca el link activo según la URL actual */
 function marcarPaginaActiva() {
    const path = window.location.pathname;
 
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href')
            .replace('./', '/')
            .replace('../', '/');
 
        if (href !== '/' && path.includes(href)) {
            link.classList.add('active');
        }
    });
 }
 
  /* Configura el menú hamburguesa con el nuevo panel único */
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
 
    function toggleMenu() {
        const isOpen = mobilePanel.classList.contains('mobile-open');
        isOpen ? cerrarMenu() : abrirMenu();
    }
 
    /* Abre/cierra al hacer click en el ícono */
    hamburger.addEventListener('click', toggleMenu);
 
    /* Cierra al hacer click en cualquier link del panel móvil */
    mobilePanel.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', cerrarMenu);
    });
 
    /* Cierra al hacer click fuera del navbar */
    document.addEventListener('click', (e) => {
        if (mobilePanel.classList.contains('mobile-open') && !navbar.contains(e.target)) {
            cerrarMenu();
        }
    });
 
    /* Cierra con ESC */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') cerrarMenu();
    });
 
    /* Cierra si se pasa a pantalla de escritorio */
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) cerrarMenu();
    });
}