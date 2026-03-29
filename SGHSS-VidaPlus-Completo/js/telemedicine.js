import { checkAuth, updateSidebar, session } from './core.js';
import { getSessionPatients, getPatientHistory, savePatientEvolution, updatePatientStatus } from './database.js';

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    updateSidebar();

    const urlParams = new URLSearchParams(window.location.search);
    const patientNameFromUrl = urlParams.get('patient');
    const modal = document.getElementById('editRecordModal');
    
    let activePatient = JSON.parse(sessionStorage.getItem('vidaPlus_active_tele_patient'));

    if (patientNameFromUrl) {
        const patients = getSessionPatients();
        activePatient = patients.find(p => p.name === patientNameFromUrl);
        if (activePatient) {
            sessionStorage.setItem('vidaPlus_active_tele_patient', JSON.stringify(activePatient));
        }
    }

    const renderTeleUI = () => {
        const displayElement = document.getElementById('patientName');
        const allergyElement = document.getElementById('patientAllergy');
        const container = document.getElementById('teleTimeline');

        if (activePatient) {
            displayElement.textContent = activePatient.name;
            allergyElement.textContent = `⚠️ Alergia: ${activePatient.allergy}`;
            const history = getPatientHistory(activePatient.id);
            
            if (history.length > 0) {
                container.classList.remove('text-center');
                container.innerHTML = history.map(h => `
                    <div class="history-item" style="border-left: 4px solid ${h.type === 'Medicamento' ? '#27ae60' : '#0056b3'};">
                        <small><strong>${h.type}</strong> - ${h.date}</small>
                        <p style="font-size: 0.85rem; margin-top: 3px">${h.text}</p>
                    </div>
                `).join('');
            } else {
                container.classList.add('text-center');
                container.innerHTML = '<p class="text-muted mt-2">Sem histórico.</p>';
            }
        } else {
            displayElement.textContent = "Nenhum paciente em chamada";
            allergyElement.textContent = "";
            container.innerHTML = '<p class="text-muted mt-2">Aguardando início...</p>';
        }
    };

    renderTeleUI();

    document.getElementById('btnSaveTele').onclick = () => {
        if (!activePatient) return alert("Não há nenhum paciente em atendimento para registrar evolução.");
        modal.classList.remove('hidden');
    };

    document.getElementById('closeModalX').onclick = () => {
        modal.classList.add('hidden');
    };

    document.getElementById('btnSaveRecord').onclick = () => {
        const text = modal.querySelector('.modal-textarea').value;
        const type = document.getElementById('recordType').value;
        if (!text) return alert("Preencha a descrição.");
        
        savePatientEvolution(activePatient.id, text, session.userName, type);
        
        modal.querySelector('.modal-textarea').value = "";
        modal.classList.add('hidden');
        renderTeleUI();
    };

    document.getElementById('btnEndCall').onclick = () => {
        if (!activePatient) {
            alert("Não há nenhuma chamada ativa para encerrar.");
            return;
        }
        
        if (confirm("Encerrar consulta e marcar como finalizada?")) {
            updatePatientStatus(activePatient.id, 'Finalizado');
            sessionStorage.removeItem('vidaPlus_active_tele_patient');
            activePatient = null;
            window.location.href = 'dashboard.html';
        }
    };
});