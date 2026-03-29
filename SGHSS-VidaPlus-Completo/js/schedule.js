import { checkAuth, updateSidebar } from './core.js';
import { getSessionPatients, updatePatientStatus } from './database.js';

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    updateSidebar();

    const tableBody = document.getElementById('scheduleList');
    const searchInput = document.getElementById('searchSchedule');

    window.handleAction = (id, type, name) => {
        if (type === 'Telemedicina') {
            updatePatientStatus(id, 'Em Atendimento');
            window.location.href = `telemedicine.html?patient=${encodeURIComponent(name)}`;
        } else {
            if(confirm(`Chamar ${name} ao consultório e marcar como atendido?`)) {
                updatePatientStatus(id, 'Finalizado');
                renderTable();
            }
        }
    };

    window.cancelAppointment = (id, name) => {
        if(confirm(`Tem certeza que deseja cancelar a consulta de ${name}?`)) {
            updatePatientStatus(id, 'Cancelado');
            renderTable();
        }
    };

    const renderTable = () => {
        if (!tableBody) return;
        
        const allPatients = getSessionPatients();
        const activePatients = allPatients.filter(p => p.status !== 'Finalizado' && p.status !== 'Cancelado');
        
        const term = searchInput?.value.toLowerCase() || "";
        const filtered = activePatients.filter(p => p.name.toLowerCase().includes(term));

        if (filtered.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:30px;">Fila de espera vazia.</td></tr>';
            return;
        }

        tableBody.innerHTML = filtered.map(p => {
            const isTele = p.type === 'Telemedicina';
            return `
                <tr>
                    <td style="padding:15px; font-weight:bold">${p.time}</td>
                    <td><strong>${p.name}</strong></td>
                    <td><span style="color:${isTele ? '#0056b3' : '#27ae60'}; font-weight:bold">${p.type}</span></td>
                    <td><span class="tag ${p.status === 'Confirmado' || p.status === 'Aguardando' ? 'wait' : 'alert'}">${p.status}</span></td>
                    <td>
                        <div style="display:flex; gap:8px">
                            <button class="btn-primary" style="width:auto; padding:6px 15px; font-size:0.8rem; background:${isTele ? '' : '#27ae60'}" 
                                    onclick="handleAction('${p.id}', '${p.type}', '${p.name}')">
                                ${isTele ? 'Iniciar Teleconsulta' : 'Atender e Finalizar'}
                            </button>
                            <button class="btn-logout" style="width:auto; padding:6px 15px; font-size:0.8rem; background:#e74c3c; border:none; color:white; border-radius:4px; cursor:pointer" 
                                    onclick="cancelAppointment('${p.id}', '${p.name}')">
                                Cancelar
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    };

    renderTable();

    if (searchInput) {
        searchInput.oninput = () => renderTable();
    }
});