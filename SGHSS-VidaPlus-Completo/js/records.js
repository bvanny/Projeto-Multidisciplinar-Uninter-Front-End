import { checkAuth, updateSidebar, session } from './core.js';
import { getSessionPatients, savePatientEvolution, getPatientHistory, dischargePatient } from './database.js';

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    updateSidebar();

    const patients = getSessionPatients();
    const patientList = document.getElementById('patientList');
    const detailsContainer = document.getElementById('patientDetails');
    const modal = document.getElementById('editRecordModal');
    const searchInput = document.getElementById('searchPatient');

    const renderHistory = (id) => {
        const history = getPatientHistory(id);
        if (history.length === 0) return '<p class="text-muted" style="padding:20px; text-align:center">Nenhum registro no histórico.</p>';
        
        return history.map(item => `
            <div style="background:#f8f9fa; padding:15px; border-radius:8px; margin-bottom:15px; border-left:5px solid ${item.type === 'Medicamento' ? '#27ae60' : '#0056b3'}; border: 1px solid #eee; border-left-width: 5px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:8px">
                    <span style="font-weight:bold; color:${item.type === 'Medicamento' ? '#27ae60' : '#0056b3'}">${item.type.toUpperCase()}</span>
                    <small class="text-muted">${item.date}</small>
                </div>
                <p style="font-size:0.95rem; color:#444; line-height:1.4">${item.text}</p>
                <div style="margin-top:10px; border-top:1px solid #eee; padding-top:5px">
                    <small>Assinado por: <strong>${item.doctor}</strong></small>
                </div>
            </div>
        `).join('');
    };

    const showDetails = (p) => {
        detailsContainer.classList.remove('empty-state-container');
        detailsContainer.innerHTML = `
            <div style="width:100%">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px">
                    <div>
                        <h2 style="color:var(--primary)">${p.name}</h2>
                        <p class="text-muted">CPF: ${p.cpf || '000.000.000-XX'} | ID: #00${p.id}</p>
                    </div>
                    <span class="tag alert" style="font-size:1rem; padding:8px 15px">⚠️ Alergia: ${p.allergy}</span>
                </div>
                <div style="margin-bottom:25px; display: flex; gap: 10px;">
                    <button class="btn-primary" id="btnOpenModal" style="flex: 2; padding:15px; font-size:1.1rem">
                        + Novo Registro Clínico
                    </button>
                    <button class="btn-logout" id="btnDischarge" style="flex: 1; background: #e67e22; color: white; border: none; font-size: 1.1rem; cursor: pointer; border-radius: 8px;">
                        Dar Alta
                    </button>
                </div>
                <h3 style="margin-bottom:15px; border-bottom:2px solid #eee; padding-bottom:10px">Histórico do Prontuário</h3>
                <div id="historyFeed" style="max-height:500px; overflow-y:auto;">
                    ${renderHistory(p.id)}
                </div>
            </div>
        `;

        document.getElementById('btnOpenModal').onclick = () => {
            modal.dataset.patientId = p.id;
            modal.classList.remove('hidden');
        };

        document.getElementById('btnDischarge').onclick = () => {
            if (confirm(`Confirmar alta médica para ${p.name}?`)) {
                dischargePatient(p.id, session.userName);
                alert('Alta registrada com sucesso!');
                window.location.reload();
            }
        };
    };

    const closeModal = () => {
        modal.classList.add('hidden');
        modal.querySelector('.modal-textarea').value = "";
    };

    document.getElementById('closeModalX').onclick = closeModal;

    document.getElementById('btnSaveRecord').onclick = () => {
        const text = modal.querySelector('.modal-textarea').value;
        const type = document.getElementById('recordType').value;
        const id = modal.dataset.patientId;

        if (!text) return alert("Preencha a descrição.");

        savePatientEvolution(id, text, session.userName, type);
        closeModal();
        const currentPatients = getSessionPatients();
        showDetails(currentPatients.find(pat => pat.id == id));
    };

    const renderList = (data) => {
        patientList.innerHTML = data.map(p => `
            <div class="patient-item" data-id="${p.id}" style="cursor:pointer; border-bottom:1px solid #eee; padding:15px;">
                <div style="font-weight:bold; color:var(--primary)">${p.name}</div>
                <small class="text-muted">Ver prontuário completo</small>
            </div>
        `).join('');
    };

    renderList(patients);

    patientList.onclick = (e) => {
        const item = e.target.closest('.patient-item');
        if (item) {
            const id = item.dataset.id;
            const currentPatients = getSessionPatients();
            const p = currentPatients.find(pat => pat.id == id);
            showDetails(p);
        }
    };

    if (searchInput) {
        searchInput.oninput = () => {
            const term = searchInput.value.toLowerCase();
            const currentPatients = getSessionPatients();
            renderList(currentPatients.filter(p => p.name.toLowerCase().includes(term) || (p.cpf && p.cpf.includes(term))));
        };
    }
});