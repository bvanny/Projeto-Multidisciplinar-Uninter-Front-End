export const session = JSON.parse(localStorage.getItem('vidaPlus_session'));

const ADMIN_EMAIL = "admin@admin";

export function checkAuth() {
    if (!session || !session.active) {
        window.location.href = 'index.html';
        return;
    }

    const currentPage = window.location.pathname;
    if (currentPage.includes('admin.html') && session.userEmail !== ADMIN_EMAIL) {
        alert("Acesso restrito ao Administrador.");
        window.location.href = 'dashboard.html';
    }
}

export function logout() {
    localStorage.removeItem('vidaPlus_session');
    sessionStorage.removeItem('vidaPlus_current_patients');
    window.location.href = 'index.html';
}

export function showMsg(element, text, color, duration = 3000) {
    if (!element) return;
    element.textContent = text;
    element.style.color = color;
    element.classList.remove('hidden');
    setTimeout(() => { element.classList.add('hidden'); }, duration);
}

export function updateSidebar() {
    const display = document.getElementById('userName');
    if (display && session) display.textContent = session.userName || "Doutor(a)";
    
    const btn = document.getElementById('btnLogout');
    if (btn) btn.onclick = logout;

    if (session && session.userEmail !== ADMIN_EMAIL) {
        const adminMenuItem = document.querySelector('a[href="admin.html"]');
        if (adminMenuItem && adminMenuItem.parentElement) {
            adminMenuItem.parentElement.style.display = 'none';
        }
    }
}