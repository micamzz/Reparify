export async function cargarFooter() {
    const prefix = window.location.pathname.includes('/Pages/') ? '../' : './';
 
    try {
        const response = await fetch('/components/footer.html');
        if (!response.ok) throw new Error('Footer no encontrado');
 
        const data = await response.text();
        const placeholder = document.getElementById('footer-placeholder');
        if (placeholder) placeholder.innerHTML = data;
 
    } catch (error) {
        console.error('Error cargando footer:', error);
    }
}