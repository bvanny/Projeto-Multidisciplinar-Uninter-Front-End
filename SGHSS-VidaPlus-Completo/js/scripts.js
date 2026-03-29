import { showMsg } from './core.js';
import { saveUsers, getUsers, generateRandomPatients } from './database.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const resetPassForm = document.getElementById('resetPassForm');
    const twoFactorForm = document.getElementById('twoFactorForm');
    const authMessage = document.getElementById('authMessage');
    const authTitle = document.getElementById('authTitle');
    
    const input2FA = document.getElementById('twoFactorCode');
    const display2FA = document.getElementById('display2FACode');
    const timerBar = document.getElementById('timerBar');
    const timerText = document.getElementById('timerText');

    const TOKEN_VALIDO = "VIDAPLUS-2026";
    let CODIGO_2FA_ATUAL = "";
    let tempoRestante = 120;
    let intervaloTimer;

    function resetar2FA() {
        CODIGO_2FA_ATUAL = Math.floor(100000 + Math.random() * 900000).toString();
        if (display2FA) display2FA.textContent = CODIGO_2FA_ATUAL;
        tempoRestante = 120;
    }

    function iniciarTimer() {
        clearInterval(intervaloTimer);
        intervaloTimer = setInterval(() => {
            tempoRestante--;
            if (timerText) {
                const min = Math.floor(tempoRestante / 60).toString().padStart(2, '0');
                const seg = (tempoRestante % 60).toString().padStart(2, '0');
                timerText.textContent = `O código muda em: ${min}:${seg}`;
            }
            if (timerBar) timerBar.style.width = `${(tempoRestante / 120) * 100}%`;
            if (tempoRestante <= 0) resetar2FA();
        }, 1000);
    }

    function exibir2FA() {
        loginForm.classList.add('hidden');
        twoFactorForm.classList.remove('hidden');
        authTitle.textContent = 'Segurança 2FA';
        resetar2FA();
        iniciarTimer();
    }

    document.getElementById('showRegister').onclick = (e) => {
        e.preventDefault();
        [loginForm, resetPassForm].forEach(f => f.classList.add('hidden'));
        registerForm.classList.remove('hidden');
        authTitle.textContent = 'Registro de Profissional';
    };

    document.getElementById('showLogin').onclick = (e) => {
        e.preventDefault();
        [registerForm, resetPassForm, twoFactorForm].forEach(f => f.classList.add('hidden'));
        loginForm.classList.remove('hidden');
        authTitle.textContent = 'Acesso Profissional';
        clearInterval(intervaloTimer);
    };

    document.getElementById('showReset').onclick = (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        resetPassForm.classList.remove('hidden');
        authTitle.textContent = 'Recuperar Senha';
    };

    document.getElementById('backToLoginReset').onclick = (e) => {
        e.preventDefault();
        resetPassForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        authTitle.textContent = 'Acesso Profissional';
    };

    registerForm.onsubmit = (e) => {
        e.preventDefault();
        const token = document.getElementById('regToken').value;
        const pass = document.getElementById('regPass').value;
        const confirm = document.getElementById('regPassConfirm').value;
        const email = document.getElementById('regEmail').value;

        if (token !== TOKEN_VALIDO) return showMsg(authMessage, "Token inválido.", "#e74c3c");
        if (pass !== confirm) return showMsg(authMessage, "As senhas não conferem.", "#e74c3c");
        if (pass.length < 8) return showMsg(authMessage, "Mínimo 8 caracteres.", "#e74c3c");

        let users = getUsers();
        if (users.some(u => u.email === email)) return showMsg(authMessage, "E-mail já cadastrado.", "#e74c3c");

        users.push({ 
            email, 
            password: pass, 
            name: document.getElementById('regName').value, 
            crm: document.getElementById('regCRM').value,  
            spec: document.getElementById('regSpec').value
        });
        
        saveUsers(users);
        showMsg(authMessage, "Conta criada!", "#27ae60");
        setTimeout(() => document.getElementById('showLogin').click(), 1500);
    };

    resetPassForm.onsubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById('resetEmail').value;
        const token = document.getElementById('resetToken').value;
        const newPass = document.getElementById('newPass').value;

        if (token !== TOKEN_VALIDO) return showMsg(authMessage, "Token inválido.", "#e74c3c");
        
        let users = getUsers();
        const userIndex = users.findIndex(u => u.email === email);

        if (userIndex === -1) return showMsg(authMessage, "E-mail não encontrado.", "#e74c3c");
        if (newPass.length < 8) return showMsg(authMessage, "Mínimo 8 caracteres.", "#e74c3c");

        users[userIndex].password = newPass;
        saveUsers(users);
        showMsg(authMessage, "Senha alterada com sucesso!", "#27ae60");
        setTimeout(() => document.getElementById('backToLoginReset').click(), 1500);
    };

    loginForm.onsubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const pass = document.getElementById('loginPass').value;

        if (email === "admin@admin" && pass === "admin@admin") {
            exibir2FA();
            return;
        }

        const users = getUsers();
        const userFound = users.find(u => u.email === email && u.password === pass);

        if (userFound) {
            exibir2FA();
        } else {
            showMsg(authMessage, "Credenciais inválidas.", "#e74c3c");
        }
    };

    twoFactorForm.onsubmit = (e) => {
        e.preventDefault();
        if (input2FA.value === CODIGO_2FA_ATUAL) {
            const emailLogin = document.getElementById('loginEmail').value;
            let nomeExibicao = "Profissional";

            if (emailLogin === "admin@admin") {
                nomeExibicao = "Administrador Geral";
            } else {
                const user = getUsers().find(u => u.email === emailLogin);
                if (user) nomeExibicao = user.name;
            }
            
            generateRandomPatients();

            localStorage.setItem('vidaPlus_session', JSON.stringify({ 
                userEmail: emailLogin, 
                userName: nomeExibicao, 
                active: true 
            }));
            
            window.location.href = 'dashboard.html';
        } else {
            showMsg(authMessage, "Código incorreto.", "#e74c3c");
        }
    };
});