import { checkAuth, updateSidebar } from './core.js';
import { getFinancialData, getBedsStatus } from './database.js';

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    updateSidebar();
    refreshAdminDashboard();
});

function refreshAdminDashboard() {
    const finance = getFinancialData();
    const beds = getBedsStatus();

    const revEl = document.getElementById('totalRevenue');
    if (revEl) {
        revEl.innerText = `R$ ${finance.faturamento.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    }

    const profitEl = document.getElementById('netProfit');
    if (profitEl) {
        const liquid = finance.faturamento - finance.despesas;
        profitEl.innerText = `R$ ${liquid.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    }

    const countEl = document.getElementById('totalConsults');
    if (countEl) {
        countEl.innerText = finance.consultasTotal;
    }

    const bedsEl = document.getElementById('availableBeds');
    const occupiedEl = document.getElementById('occupiedBeds');
    if (bedsEl) bedsEl.textContent = beds.available;
    if (occupiedEl) occupiedEl.textContent = beds.occupied;

    const supplyList = [
        { id: 1, item: "Dipirona 500mg", stock: 120, unit: "frascos" },
        { id: 2, item: "Soro Fisiológico 500ml", stock: 85, unit: "unidades" },
        { id: 3, item: "Gaze Estéril", stock: 450, unit: "pacotes" },
        { id: 4, item: "Luvas de Procedimento", stock: 30, unit: "caixas" }
    ];

    const tableBody = document.getElementById('supplyTableBody');
    if (tableBody) {
        tableBody.innerHTML = supplyList.map(s => `
            <tr>
                <td>${s.item}</td>
                <td style="font-weight:bold; color:${s.stock < 50 ? '#e74c3c' : '#2c3e50'}">${s.stock} ${s.unit}</td>
                <td>
                    <button class="btn-primary" style="padding:5px 10px; font-size:0.8rem;" onclick="alert('Pedido de reposição enviado!')">Repor</button>
                </td>
            </tr>
        `).join('');
    }
}