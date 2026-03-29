import { checkAuth, updateSidebar, session } from './core.js';
import { 
    getAllPatientsHistory, 
    savePatient, 
    dischargePatient, 
    reschedulePatient,
    occupyBed
} from './database.js';

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    updateSidebar();
    renderTable();

    const modal = document.getElementById('modalPatient');
    const btnOpen = document.getElementById('btnOpenModal');
    const btnClose = document.getElementById('closeModal');
    const form = document.getElementById('formNewPatient');

    if (btnOpen) btnOpen.onclick = () => modal.classList.remove('hidden');
    if (btnClose) btnClose.onclick = () => modal.classList.add('hidden');

    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const data = {
                fullName: document.getElementById('regName').value,
                cpf: document.getElementById('regCpf').value,
                time: document.getElementById('regTime').value,
                allergies: document.getElementById('regAllergy').value
            };
            savePatient(data, session.userName);
            if (modal) modal.classList.add('hidden');
            form.reset();
            renderTable();
        };
    }

    const searchInput = document.getElementById('searchPatient');
    if (searchInput) {
        searchInput.oninput = (e) => renderTable(e.target.value);
    }
});

function renderTable(filter = "") {
    const tbody = document.getElementById('allPatientsList');
    if (!tbody) return;

    const allPatients = getAllPatientsHistory();
    tbody.innerHTML = "";

    const filtered = allPatients.filter(p => 
        p.status !== "Alta" && 
        (p.name.toLowerCase().includes(filter.toLowerCase()) || (p.cpf && p.cpf.includes(filter)))
    );

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px; color:#999;">Nenhum paciente ativo encontrado.</td></tr>`;
        return;
    }

    filtered.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="padding:15px"><strong>${p.name}</strong></td>
            <td>${p.cpf || '---'}</td>
            <td><span class="status-badge">${p.status}</span></td>
            <td>${p.time}</td>
            <td>
                <div class="flex gap-10">
                    <button class="btn-sm btn-receita" data-id="${p.id}" data-name="${p.name}" style="background:#9b59b6; color:white; border:none; padding:5px 8px; border-radius:4px; cursor:pointer;">Receita</button>
                    <button class="btn-sm btn-internar" data-id="${p.id}" data-name="${p.name}" style="background:#3498db; color:white; border:none; padding:5px 8px; border-radius:4px; cursor:pointer;">Internar</button>
                    <button class="btn-sm btn-reagenda" data-id="${p.id}" data-name="${p.name}" style="background:#f39c12; color:white; border:none; padding:5px 8px; border-radius:4px; cursor:pointer;">Horário</button>
                    <button class="btn-sm btn-alta" data-id="${p.id}" data-name="${p.name}" style="background:#27ae60; color:white; border:none; padding:5px 8px; border-radius:4px; cursor:pointer;">Alta</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    setupActions();
}

function setupActions() {
    // Ação do botão Receita (Leva para uma página de prescrição)
    document.querySelectorAll('.btn-receita').forEach(btn => {
        btn.onclick = () => {
            // Você precisará criar a página prescription.html
            window.location.href = `prescription.html?id=${btn.dataset.id}&name=${btn.dataset.name}`;
        };
    });

    document.querySelectorAll('.btn-alta').forEach(btn => {
        btn.onclick = () => {
            if(confirm(`Confirmar alta para ${btn.dataset.name}?`)) {
                dischargePatient(btn.dataset.id, session.userName);
                renderTable();
            }
        };
    });

    document.querySelectorAll('.btn-internar').forEach(btn => {
        btn.onclick = () => {
            const leito = prompt(`Número do leito para ${btn.dataset.name}:`);
            if(leito) {
                occupyBed(btn.dataset.id, btn.dataset.name, leito, session.userName);
                alert("Internação realizada.");
                renderTable();
            }
        };
    });

    document.querySelectorAll('.btn-reagenda').forEach(btn => {
        btn.onclick = () => {
            const novoHorario = prompt(`Novo horário para ${btn.dataset.name}:`);
            if (novoHorario) {
                reschedulePatient(btn.dataset.id, novoHorario, session.userName);
                renderTable();
            }
        };
    });
}