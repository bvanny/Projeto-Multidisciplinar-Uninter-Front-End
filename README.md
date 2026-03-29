# 🏥 SGHSS — Sistema de Gestão Hospitalar e de Serviços de Saúde

<p align="center">
  <img src="https://img.shields.io/badge/Status-Concluído-27ae60?style=for-the-badge" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/WCAG-2.1-003399?style=for-the-badge" />
  <img src="https://img.shields.io/badge/LGPD-Conforme-003399?style=for-the-badge" />
</p>

> Projeto Multidisciplinar — Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas (EaD)  
> **Ênfase: Desenvolvimento Front-End** | UNINTER | 2026  
> **Aluno:** Bruno Geovanny Platero Fraga | **RU:** 4424602

---

## 🌐 Acesse o Sistema

🔗 **[https://bvanny.github.io/Projeto-Multidisciplinar-Uninter-Front-End/SGHSS-VidaPlus-Completo/](https://bvanny.github.io/Projeto-Multidisciplinar-Uninter-Front-End/SGHSS-VidaPlus-Completo/)**

| Perfil | Usuário | Senha |
|--------|---------|-------|
| Administrador | `admin@admin` | `admin@admin` |

---

## 📋 Sobre o Projeto

O **SGHSS** é um sistema de gestão hospitalar desenvolvido para a instituição fictícia **VidaPlus**, que administra hospitais, clínicas, laboratórios e equipes de home care. O objetivo é centralizar processos críticos em uma plataforma web unificada, com foco em **acessibilidade**, **responsividade** e **conformidade com a LGPD**.

---

## ✨ Funcionalidades

| Módulo | Descrição |
|--------|-----------|
| 🔐 **Autenticação** | Login seguro com autenticação em dois fatores (2FA) |
| 📊 **Dashboard** | Painel de controle com indicadores em tempo real |
| 📅 **Agendamentos** | Gestão completa de consultas e horários |
| 📋 **Prontuários** | Histórico clínico e evoluções dos pacientes |
| 💊 **Prescrições** | Emissão de receitas digitais |
| 🎥 **Telemedicina** | Sala de atendimento remoto com chat clínico |
| 🛏️ **Gestão de Leitos** | Controle de ocupação hospitalar |
| 🚨 **Emergências** | Acionamento de Código Vermelho |
| 👤 **Pacientes** | Cadastro e gestão completa de pacientes |
| ⚙️ **Administração** | Painel administrativo com logs de auditoria |

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 Semântico** — Estrutura acessível e compatível com leitores de tela
- **CSS3** com Custom Properties — Design system com variáveis para a paleta VidaPlus
- **JavaScript Vanilla** — Lógica de navegação, validação e manipulação do DOM sem frameworks
- **Flexbox & Grid Layout** — Layout responsivo Mobile-First
- **LocalStorage / SessionStorage** — Persistência de sessão e dados simulados

---

## 📐 Padrões e Conformidades

- ✅ **WCAG 2.1** — Contraste adequado, navegação por teclado, labels semânticos
- ✅ **LGPD** — Exibição de termos de privacidade e proteção de dados sensíveis
- ✅ **Design Responsivo** — Testado em Desktop, Tablet e Mobile
- ✅ **HTML Semântico** — `<nav>`, `<aside>`, `<main>`, `<section>` e `<article>`

---

## 📁 Estrutura do Projeto

```
SGHSS-VidaPlus-Completo/
├── css/
│   └── style.css          # Estilos globais e variáveis CSS
├── js/
│   ├── core.js            # Autenticação e sessão
│   ├── database.js        # Banco de dados simulado (localStorage)
│   ├── dashboard.js       # Lógica do painel principal
│   ├── schedule.js        # Módulo de agendamentos
│   ├── patients.js        # Gestão de pacientes
│   ├── records.js         # Prontuários eletrônicos
│   ├── telemedicine.js    # Módulo de telemedicina
│   └── ...
├── docs/                  # Documentação do projeto
├── index.html             # Tela de login / autenticação
├── dashboard.html         # Painel principal
├── schedule.html          # Agendamentos
├── patients.html          # Gestão de pacientes
├── records.html           # Prontuários
├── telemedicine.html      # Telemedicina
├── prescription.html      # Prescrições digitais
├── admin.html             # Painel administrativo
└── settings.html          # Configurações do sistema
```

---

## 🚀 Como Executar Localmente

```bash
# Clone o repositório
git clone https://github.com/bvanny/Projeto-Multidisciplinar-Uninter-Front-End.git

# Acesse a pasta do projeto
cd Projeto-Multidisciplinar-Uninter-Front-End/SGHSS-VidaPlus-Completo

# Abra o arquivo index.html no navegador
# Ou use a extensão Live Server no VS Code
```

> Não requer instalação de dependências. Funciona diretamente no navegador.

---

## 🧪 Testes Realizados

| Teste | Ferramenta | Resultado |
|-------|-----------|-----------|
| Responsividade | Chrome DevTools | ✅ Aprovado |
| Contraste e Acessibilidade | Lighthouse | ✅ Aprovado |
| Navegação por Teclado | Manual | ✅ Aprovado |
| Autenticação 2FA | Manual | ✅ Aprovado |
| Validação de Formulários | HTML5 Validation | ✅ Aprovado |

---

## 📚 Referências

- [LGPD — Lei nº 13.709/2018](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [WCAG 2.1 — W3C](https://www.w3.org/TR/WCAG21/)
- [MDN Web Docs](https://developer.mozilla.org/)
- SOMMERVILLE, Ian. *Engenharia de Software*. 10. ed. Pearson, 2019.

---

## 👨‍💻 Autor

**Bruno Geovanny Platero Fraga**  
RU: 4424602 | Polo: PAP Guarulhos (Centro) - SP  
Curso Superior de Tecnologia em ADS — UNINTER 2026

---

<p align="center">Desenvolvido com 💙 para o Projeto Multidisciplinar — UNINTER 2026</p>
