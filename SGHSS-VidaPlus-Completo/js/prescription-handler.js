import { checkAuth, updateSidebar, session } from './core.js';
import { savePrescription, getPatientPrescriptions } from './database.js';

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    updateSidebar();
    
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('id');
    const patientName = urlParams.get('name');

    if(patientName) {
        document.getElementById('patientTargetName').innerText = patientName;
    }

    const form = document.getElementById('formPrescription');
    if(form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            
            const meds = document.getElementById('medicationList').value;
            const obs = document.getElementById('usageInstructions').value;

            if(!meds) return alert("Adicione ao menos um medicamento.");

            savePrescription(patientId, session.userName, meds, obs);
            alert("Receita Digital Emitida com Sucesso!");
            window.history.back(); // Volta para o prontuário ou lista
        };
    }
});