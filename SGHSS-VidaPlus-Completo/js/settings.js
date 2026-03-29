import { checkAuth, updateSidebar, session } from './core.js';
import { getUsers } from './database.js';

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    updateSidebar();

    const users = getUsers();
    const currentUser = users.find(u => u.email === session.email);

    if (currentUser) {
        document.getElementById('setUserName').value = currentUser.name || "Não informado";
        document.getElementById('setUserCRM').value = currentUser.crm || "Não informado";
        document.getElementById('setUserEmail').value = currentUser.email;
        document.getElementById('setUserSpec').value = currentUser.spec || "Clínico Geral";
    }

    const modal = document.getElementById('supportModal');
    const btnOpen = document.getElementById('btnOpenSupport');
    const btnClose = document.getElementById('btnCloseModal');

    btnOpen.onclick = () => {
        modal.classList.remove('hidden');
    };

    btnClose.onclick = () => {
        modal.classList.add('hidden');
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.classList.add('hidden');
        }
    };
});