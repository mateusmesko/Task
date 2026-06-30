# 📋 Tarefas App (Electron)

Aplicação desktop simples para gerenciamento de tarefas, com:

- Ícone na bandeja do Windows (Tray)
- status de tarefas pendentes
- 🪟 interface simples
- salvamento em arquivo local (`tarefas.json`)
- notificações automáticas
- intervalo de notificação configurável via popup

---

# 🚀 Tecnologias

- Electron
- Node.js
- JavaScript puro
- File System (fs)
- HTML/CSS básico

---

# 📁 Estrutura do projeto

tarefas/
│
├── main.js
├── index.html
├── script.js
├── tarefas.json
│
├── icons/
│   ├── green.png
│   ├── red.png
│   └── icon.ico
│
├── package.json
└── dist/

---

# ⚙️ Instalação

## 1. Instalar dependências
npm install

---

# Rodar

npm start

---

# Build

npm run build

---

# tarefas.json

[
  {
    "tarefa": "Estudar inglês",
    "feito": false
  }
]

---

# Funcionalidades

- Tray icon
- Notificações
- Lista de tarefas
- Persistência local
