export const saveUsers = (users) => localStorage.setItem('vidaPlus_users', JSON.stringify(users));
export const getUsers = () => JSON.parse(localStorage.getItem('vidaPlus_users')) || [];

export const saveLog = (action, user) => {
    const logs = JSON.parse(localStorage.getItem('vidaPlus_logs')) || [];
    logs.unshift({
        date: new Date().toLocaleString('pt-BR'),
        user: user || "Sistema",
        action: action
    });
    localStorage.setItem('vidaPlus_logs', JSON.stringify(logs.slice(0, 100)));
};

export const getFinancialData = () => {
    return JSON.parse(localStorage.getItem('vidaPlus_finance')) || {
        faturamento: 0,
        consultasTotal: 0,
        despesas: 0
    };
};

export const addRevenueFromDischarge = () => {
    const data = getFinancialData();
    const VALOR_CONSULTA = 250.00;
    data.faturamento += VALOR_CONSULTA;
    data.consultasTotal += 1;
    data.despesas = data.faturamento * 0.3;
    localStorage.setItem('vidaPlus_finance', JSON.stringify(data));
};

export const getBedsStatus = () => {
    const totalBeds = 50;
    const occupied = JSON.parse(localStorage.getItem('vidaPlus_occupied_beds')) || [];
    return {
        total: totalBeds,
        occupied: occupied.length,
        available: totalBeds - occupied.length
    };
};

export const occupyBed = (patientId, patientName, bedNumber, currentUser) => {
    const occupied = JSON.parse(localStorage.getItem('vidaPlus_occupied_beds')) || [];
    if (occupied.find(b => b.patientId == patientId)) return false;

    occupied.push({
        patientId,
        patientName,
        bedNumber,
        date: new Date().toLocaleString('pt-BR')
    });
    localStorage.setItem('vidaPlus_occupied_beds', JSON.stringify(occupied));

    const currentQueue = JSON.parse(sessionStorage.getItem('vidaPlus_current_patients')) || [];
    const updatedQueue = currentQueue.filter(p => p.id != patientId);
    sessionStorage.setItem('vidaPlus_current_patients', JSON.stringify(updatedQueue));

    const history = JSON.parse(localStorage.getItem('vidaPlus_all_patients')) || [];
    const histIndex = history.findIndex(p => p.id == patientId);
    if (histIndex !== -1) {
        history[histIndex].status = "Internado";
        localStorage.setItem('vidaPlus_all_patients', JSON.stringify(history));
    }

    saveLog(`Internação: ${patientName} no leito ${bedNumber}`, currentUser);
    return true;
};

export const releaseBed = (patientId) => {
    let occupied = JSON.parse(localStorage.getItem('vidaPlus_occupied_beds')) || [];
    occupied = occupied.filter(b => b.patientId != patientId);
    localStorage.setItem('vidaPlus_occupied_beds', JSON.stringify(occupied));
};

export const savePatient = (patientData, currentUser) => {
    const history = JSON.parse(localStorage.getItem('vidaPlus_all_patients')) || [];
    const currentQueue = JSON.parse(sessionStorage.getItem('vidaPlus_current_patients')) || [];
    const newPatient = {
        id: Date.now(),
        name: patientData.fullName,
        cpf: patientData.cpf,
        time: patientData.time || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        type: "Presencial",
        status: "Aguardando",
        allergy: patientData.allergies || "Nenhuma"
    };
    history.push(newPatient);
    currentQueue.push(newPatient);
    localStorage.setItem('vidaPlus_all_patients', JSON.stringify(history));
    sessionStorage.setItem('vidaPlus_current_patients', JSON.stringify(currentQueue));
    saveLog(`Cadastrou paciente: ${newPatient.name}`, currentUser);
    return newPatient;
};

export const dischargePatient = (patientId, currentUser) => {
    const currentQueue = JSON.parse(sessionStorage.getItem('vidaPlus_current_patients')) || [];
    const history = JSON.parse(localStorage.getItem('vidaPlus_all_patients')) || [];
    const patient = currentQueue.find(p => p.id == patientId) || history.find(p => p.id == patientId);
    
    const updatedQueue = currentQueue.filter(p => p.id != patientId);
    sessionStorage.setItem('vidaPlus_current_patients', JSON.stringify(updatedQueue));
    
    const histIndex = history.findIndex(p => p.id == patientId);
    if (histIndex !== -1) {
        history[histIndex].status = "Alta";
        localStorage.setItem('vidaPlus_all_patients', JSON.stringify(history));
    }
    
    releaseBed(patientId);
    addRevenueFromDischarge();
    if (patient) saveLog(`Alta e faturamento: ${patient.name}`, currentUser);
};

export const reschedulePatient = (patientId, newTime, currentUser) => {
    const history = JSON.parse(localStorage.getItem('vidaPlus_all_patients')) || [];
    const currentQueue = JSON.parse(sessionStorage.getItem('vidaPlus_current_patients')) || [];
    const updateList = (list) => {
        const idx = list.findIndex(p => p.id == patientId);
        if (idx !== -1) {
            list[idx].time = newTime;
            list[idx].status = "Confirmado";
        }
        return list;
    };
    const patient = history.find(p => p.id == patientId);
    const inQueue = currentQueue.find(p => p.id == patientId);
    if (!inQueue && patient) {
        const reactivatedPatient = { ...patient, time: newTime, status: "Confirmado" };
        currentQueue.push(reactivatedPatient);
    } else {
        updateList(currentQueue);
    }
    localStorage.setItem('vidaPlus_all_patients', JSON.stringify(updateList(history)));
    sessionStorage.setItem('vidaPlus_current_patients', JSON.stringify(currentQueue));
    saveLog(`Reagendou paciente ID: ${patientId} para ${newTime}`, currentUser);
};

export const getAllPatientsHistory = () => {
    return JSON.parse(localStorage.getItem('vidaPlus_all_patients')) || [];
};

export const savePrescription = (patientId, doctorName, medications, instructions) => {
    const prescriptions = JSON.parse(localStorage.getItem('vidaPlus_prescriptions')) || {};
    if (!prescriptions[patientId]) prescriptions[patientId] = [];
    const newPrescription = {
        id: Date.now(),
        date: new Date().toLocaleString('pt-BR'),
        doctor: doctorName,
        meds: medications,
        obs: instructions,
        digitalSignature: `VP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    };
    prescriptions[patientId].unshift(newPrescription);
    localStorage.setItem('vidaPlus_prescriptions', JSON.stringify(prescriptions));
    saveLog(`Emitiu receita digital para ID: ${patientId}`, doctorName);
    return newPrescription;
};

export const getPatientPrescriptions = (patientId) => {
    const prescriptions = JSON.parse(localStorage.getItem('vidaPlus_prescriptions')) || {};
    return prescriptions[patientId] || [];
};

export const generateRandomPatients = () => {
    let patients = JSON.parse(sessionStorage.getItem('vidaPlus_current_patients')) || [];
    if (patients.length > 0) return patients;
    const names = ["Ana Silva", "Bruno Souza", "Carla Dias", "David Luiz", "Elena Roari", "Fabio Jr", "Gisele B", "Hugo Gloss", "Iara Sol", "João Alencar", "Katia Abreu", "Leonardo M", "Maria Oliveira", "Nivaldo P", "Otavio Mesquita", "Paula Fernandes", "Ricardo T", "Sandra Rosa", "Tiago Iorc", "Vanessa Camargo"];
    for (let i = 0; i < 20; i++) {
        patients.push({
            id: i + 1,
            name: names[i % names.length],
            time: `${Math.floor(Math.random() * 11 + 8).toString().padStart(2, '0')}:00`,
            type: Math.random() > 0.5 ? "Presencial" : "Telemedicina",
            status: "Confirmado",
            allergy: "Nenhuma"
        });
    }
    sessionStorage.setItem('vidaPlus_current_patients', JSON.stringify(patients));
    localStorage.setItem('vidaPlus_all_patients', JSON.stringify(patients)); 
    return patients;
};

export const getSessionPatients = () => {
    const data = JSON.parse(sessionStorage.getItem('vidaPlus_current_patients')) || [];
    return data.sort((a, b) => a.time.localeCompare(b.time));
};

export const updatePatientStatus = (patientId, newStatus) => {
    const queue = getSessionPatients();
    const history = getAllPatientsHistory();
    const qIdx = queue.findIndex(p => p.id == patientId);
    if (qIdx !== -1) {
        queue[qIdx].status = newStatus;
        sessionStorage.setItem('vidaPlus_current_patients', JSON.stringify(queue));
    }
    const hIdx = history.findIndex(p => p.id == patientId);
    if (hIdx !== -1) {
        history[hIdx].status = newStatus;
        localStorage.setItem('vidaPlus_all_patients', JSON.stringify(history));
    }
};

export const savePatientEvolution = (patientId, text, doctor, type) => {
    const evolutions = JSON.parse(sessionStorage.getItem('vidaPlus_evolutions')) || {};
    if (!evolutions[patientId]) evolutions[patientId] = [];
    evolutions[patientId].unshift({
        date: new Date().toLocaleString('pt-BR'),
        text, doctor, type
    });
    sessionStorage.setItem('vidaPlus_evolutions', JSON.stringify(evolutions));
    saveLog(`Evolução clínica ID: ${patientId}`, doctor);
};

export const getPatientHistory = (patientId) => {
    const evolutions = JSON.parse(sessionStorage.getItem('vidaPlus_evolutions')) || {};
    return evolutions[patientId] || [];
};