import { checkAuth, updateSidebar, session } from './core.js';
import { getSessionPatients, saveLog, getBedsStatus } from './database.js';

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    updateSidebar();

    const patients = getSessionPatients();
    const beds = getBedsStatus();
    
    const finishedCount = patients.filter(p => p.status === 'Finalizado' || p.status === 'Alta').length;
    const waitingCount = patients.filter(p => p.status === 'Aguardando' || p.status === 'Confirmado').length;
    
    const totalTodayEl = document.getElementById('totalToday');
    const totalWaitingEl = document.getElementById('totalWaiting');
    const totalFinishedEl = document.getElementById('totalFinished');
    const availableBedsEl = document.getElementById('availableBeds');
    const logsContainer = document.getElementById('recentLogs');
    const welcomeEl = document.getElementById('welcomeMessage');

    if (welcomeEl && session) {
        const hora = new Date().getHours();
        const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
        welcomeEl.textContent = `${saudacao}, ${session.userName}!`;
    }

    if (totalTodayEl) totalTodayEl.textContent = patients.length;
    if (totalWaitingEl) totalWaitingEl.textContent = waitingCount;
    if (totalFinishedEl) totalFinishedEl.textContent = finishedCount;
    if (availableBedsEl) availableBedsEl.textContent = beds.available;

    const nextPatient = patients.find(p => p.status === 'Aguardando' || p.status === 'Confirmado');
    const nextCard = document.getElementById('nextPatientCard');

    if (nextCard) {
        if (nextPatient) {
            nextCard.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; width: 100%;">
                    <div>
                        <span style="font-size:0.8rem; font-weight:bold; color:var(--primary); text-transform:uppercase;">Início em breve</span>
                        <h2 style="margin:5px 0; color:#2d3748;">${nextPatient.name}</h2>
                        <p style="margin:0; font-size:1.1rem; color:#4a5568;">Horário: <strong>${nextPatient.time}</strong></p>
                        <div style="margin-top:10px;">
                            <span class="text-primary font-bold" style="background: #eef2f7; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem;">
                                ${nextPatient.type}
                            </span>
                        </div>
                    </div>
                    <div style="background:var(--bg-body); padding:15px; border-radius:50%; font-size: 1.5rem;">👤</div>
                </div>
            `;
        } else {
            nextCard.innerHTML = `
                <div style="text-align:center;">
                    <p style="font-size:1.5rem;">✨</p>
                    <p>Agenda do dia concluída!</p>
                </div>
            `;
        }
    }

    if (logsContainer) {
        const logs = JSON.parse(localStorage.getItem('vidaPlus_logs')) || [];
        logsContainer.innerHTML = logs.slice(0, 5).map(log => `
            <div style="padding: 12px; border-bottom: 1px solid #eee; font-size: 0.85rem;">
                <span style="color:var(--primary); font-weight:bold;">${log.date.split(' ')[1]}</span> - 
                <strong>${log.user}</strong>: ${log.action}
            </div>
        `).join('') || '<p style="padding:15px; color:#999;">Nenhuma atividade recente.</p>';
    }

    const btnTrigger = document.getElementById('btnTriggerEmergency');
    const btnClear = document.getElementById('btnClearEmergency');
    const emergencyPanel = document.getElementById('emergencyPanel');
    const alertArea = document.getElementById('activeAlertArea');
    const alertText = document.getElementById('alertText');
    const noteArea = document.getElementById('emergencyNote');

    const updateEmergencyUI = () => {
        const activeAlert = localStorage.getItem('vidaPlus_active_emergency');
        if (activeAlert) {
            if (emergencyPanel) emergencyPanel.classList.add('emergency-active');
            if (alertArea) alertArea.classList.remove('hidden');
            if (alertText) alertText.textContent = activeAlert;
            if (btnTrigger) btnTrigger.classList.add('hidden');
            if (noteArea) noteArea.classList.add('hidden');
            if (btnClear) btnClear.classList.remove('hidden');
        } else {
            if (emergencyPanel) emergencyPanel.classList.remove('emergency-active');
            if (alertArea) alertArea.classList.add('hidden');
            if (btnTrigger) btnTrigger.classList.remove('hidden');
            if (noteArea) noteArea.classList.remove('hidden');
            if (btnClear) btnClear.classList.add('hidden');
        }
    };

    if (btnTrigger) {
        btnTrigger.onclick = () => {
            const note = noteArea.value.trim();
            if (!note) return alert("Descreva a intercorrência.");
            if (confirm("ACIONAR CÓDIGO VERMELHO?")) {
                localStorage.setItem('vidaPlus_active_emergency', note);
                saveLog(`ACIONOU EMERGÊNCIA: ${note}`, session.userName);
                noteArea.value = "";
                updateEmergencyUI();
                location.reload();
            }
        };
    }

    if (btnClear) {
        btnClear.onclick = () => {
            localStorage.removeItem('vidaPlus_active_emergency');
            saveLog("Emergência encerrada", session.userName);
            updateEmergencyUI();
            location.reload();
        };
    }

    updateEmergencyUI();
});