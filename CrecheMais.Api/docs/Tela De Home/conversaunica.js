// conversaunica.js (Para conversaunica.html)

let activeChatId = null; 
let allChats = [];
const NO_MESSAGE_PLACEHOLDER = "Iniciar Conversa..."; 

// 1. Mover funções auxiliares para o topo (melhor prática de organização)
function getCrecheDataById(id) {
    // ESTES DADOS PRECISAM BATER COM crechesData DO home.js
    const allCreches = [
        { id: 1, name: "Creche ProInfância", image: "../ImagensHome/Creche1.jpg" },
        { id: 2, name: "Creche Wanda Cruz", image: "../ImagensHome/Creche2.jpg" },
        { id: 3, name: "CEMEI Armindo Barbosa", image: "../ImagensHome/Creche3.jpg" },
        { id: 4, name: "Creche Santa Luzia", image: "../ImagensHome/Creche4.jpg" },
        { id: 5, name: "Creche Praia Baby", image: "../ImagensHome/Creche5.png" }
    ];
    return allCreches.find(c => c.id === id);
}

function loadAllChats() {
    let storedChats = JSON.parse(localStorage.getItem('chats'));
    
    // CORREÇÃO: Inicializa com array vazio se não houver chats, sem criar um chat de teste.
    if (!storedChats || !Array.isArray(storedChats)) {
        storedChats = [];
    } 
    allChats = storedChats;
}

document.addEventListener('DOMContentLoaded', () => {
    // Carrega os chats do LocalStorage. Esta é a primeira ação.
    loadAllChats(); 
    setupEventListeners();

    const urlParams = new URLSearchParams(window.location.search);
    const initialCrecheId = urlParams.get('id');

    if (initialCrecheId) {
        activeChatId = parseInt(initialCrecheId);
    } 
    // Se não houver ID na URL, o activeChatId permanece nulo.

    if (activeChatId !== null) {
        let chat = allChats.find(c => c.crecheId === activeChatId);
        
        // Se o chat NÃO for encontrado aqui, é porque o home.js
        // falhou ao salvar o chat antes de redirecionar.
        if (!chat) {
             console.error(`Chat com ID ${activeChatId} não encontrado no localStorage.`);
             // voltamos para a lista de chats.
             window.location.href = 'chatlist.html';
             return;
        }

        document.getElementById('chat-recipient-name').textContent = chat.crecheName;
        renderMessages(chat.messages);
    } else {
        // Redireciona se não houver ID na URL para evitar tela vazia
        window.location.href = 'chatlist.html';
    }
});


function renderMessages(messages) {
    const messagesContainer = document.getElementById('chat-messages-area'); 
    messagesContainer.innerHTML = '';

    messages.forEach(msg => {
        const div = document.createElement('div');
        // O sender 'system' deve ser tratado como 'other' para estilo
        const senderClass = msg.sender === 'user' ? 'user' : 'other';
        div.classList.add('message', senderClass);
        div.textContent = msg.text;
        messagesContainer.appendChild(div);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Função SendMessage Sem Resposta Automática
function sendMessage() {
    const inputElement = document.getElementById('message-input');
    const text = inputElement.value.trim();

    if (!text || activeChatId === null) return; 

    const chatIndex = allChats.findIndex(c => c.crecheId === activeChatId);
    if (chatIndex === -1) { return; }
    
    const chat = allChats[chatIndex];
    const newMessage = { sender: 'user', text: text, timestamp: new Date().toISOString() };

    chat.messages.push(newMessage);
    chat.lastMessage = text;
    
    // Move o chat para o topo da lista (última atividade)
    allChats.splice(chatIndex, 1);
    allChats.unshift(chat);

    localStorage.setItem('chats', JSON.stringify(allChats));
    
    renderMessages(chat.messages);
    inputElement.value = '';
}


function setupEventListeners() {
    // **NAV: Botão Voltar (conversaunica.html -> chatlist.html)**
    const backButton = document.getElementById('back-to-chats');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = 'chatlist.html'; // CORRETO
        });
    }

    document.getElementById('send-btn').addEventListener('click', sendMessage);

    document.getElementById('message-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
            e.preventDefault(); 
        }
    });
}