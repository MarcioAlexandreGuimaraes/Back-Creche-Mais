// chat.js

document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
    setupChatListeners();
});

let currentChat = null;
const contactListElement = document.getElementById('contact-list');
const chatWindowElement = document.getElementById('chat-window');
const chatMessagesElement = document.getElementById('chat-messages');
const noContactsElement = document.getElementById('no-contacts');

/**
 * Carrega e renderiza a lista de contatos (Creches) a partir do localStorage.
 */
// chat.js (Alteração dentro da função loadContacts)

function loadContacts() {
    const chats = JSON.parse(localStorage.getItem('chats')) || [];
    contactListElement.innerHTML = ''; 
    // ... (código existente para checar se há chats, etc.) ...

    if (chats.length === 0) {
        // ... (código para exibir "no-contacts") ...
        return;
    
    }
    
    if (chats.length === 1) {
        openChat(chats[0]);
        return;
    }
   


    chats.forEach(chat => {
        const item = document.createElement('div');
        item.classList.add('contact-item');
        item.dataset.crecheId = chat.crecheId;
        item.innerHTML = `
            <img src="${chat.crecheImage}" alt="${chat.crecheName}" class="contact-image">
            <div class="contact-info">
                <div class="contact-name">${chat.crecheName}</div>
                <div class="contact-last-msg">${chat.lastMessage}</div>
            </div>
        `;
        // Usa uma cópia do objeto chat para garantir que as referências sejam claras
        item.addEventListener('click', () => openChat(chat)); 
        contactListElement.appendChild(item);
    });
}

/**
 * Abre a janela de chat para um contato específico.
 */
function openChat(chat) {
    // Cria uma cópia profunda do objeto para evitar modificações acidentais na lista ao vivo,
    // embora o saveAndUpdateChatList já lide com isso.
    currentChat = JSON.parse(JSON.stringify(chat)); 
    document.getElementById('chat-recipient-name').textContent = currentChat.crecheName;
    
    // Transição de tela: Esconde lista, mostra chat
    contactListElement.style.display = 'none';
    chatWindowElement.style.display = 'flex';
    
    renderMessages();
}

/**
 * Renderiza todas as mensagens do chat atual na janela de conversa.
 */
function renderMessages() {
    chatMessagesElement.innerHTML = ''           ; 

    if (!currentChat || !currentChat.messages) return;

    currentChat.messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        // 'user' para mensagens enviadas por você (azul)
        // 'other' para mensagens recebidas (cinza)
        messageDiv.classList.add(msg.sender); 
        messageDiv.textContent = msg.text;
        chatMessagesElement.appendChild(messageDiv);
    }); 
    
    // Rolagem automática para a última mensagem, como no WhatsApp
    chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;
}
          
/**
 * Lida co m o envio de novas mensagens pelo usuário.
 */ 
function sendMessage() {
    const input = document.getElementById('message-input');
    const text = input.value.trim();

    if (!currentChat || text === "") return;

    // 1. Cria e adiciona a nova mensagem
    const newMessage = { 
        sender: 'user', 
        text: text, 
        timestamp: new Date().toISOString() 
    };
    currentChat.messages.push(newMessage);

    // 2. Limpa o input IMEDIATAMENTE
    input.value = '';

    // 3. Atualiza a tela e rola para baixo
    renderMessages(); 
    
    // 4. Inicia a simulação de resposta e salva
    simulateReply(text); 

    // Ocultar o teclado virtual em dispositivos móveis (se aplicável)
    input.blur(); 
}


/**
 * Simula uma resposta da creche e salva o estado do chat.
 */
function simulateReply(userMessage) {
    // Salva o estado atual do chat (após o envio da mensagem do usuário)
    saveAndUpdateChatList();

    // Simulação de resposta da Creche (simulando um pequeno delay)
    setTimeout(() => {
        const autoReply = {
            sender: 'other',
            text: `(Creche) Recebemos sua mensagem: "${userMessage}". Obrigado!`,
            timestamp: new Date().toISOString()
        };
        currentChat.messages.push(autoReply);
        
        // Salva e renderiza novamente após a resposta
        saveAndUpdateChatList();
        renderMessages();
    }, 1500); // 1.5 segundos de delay
}


/**
 * Salva o chat atualizado no localStorage e garante que ele fique no topo da lista.
 */
function saveAndUpdateChatList() {
    let chats = JSON.parse(localStorage.getItem('chats')) || [];
    
    // Atualiza a última mensagem da lista de contatos para refletir a última mensagem do chat
    currentChat.lastMessage = currentChat.messages[currentChat.messages.length - 1].text;

    // Encontra e remove a versão antiga do chat
    const existingIndex = chats.findIndex(c => c.crecheId === currentChat.crecheId);
    if (existingIndex > -1) {
        chats.splice(existingIndex, 1);
    }
    
    // Adiciona a versão atualizada no topo (tornando-o o chat mais recente)
    chats.unshift(currentChat);

    localStorage.setItem('chats', JSON.stringify(chats));
}

/**
 * Configura os listeners dos botões e eventos de teclado.
 */
function setupChatListeners() {
    // Botão Enviar
    document.getElementById('send-btn').addEventListener('click', sendMessage);
    
    // Enviar ao apertar Enter
    document.getElementById('message-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Botão Voltar para Contatos
    document.getElementById('back-to-contacts').addEventListener('click', () => {
        currentChat = null;
        chatWindowElement.style.display = 'none';
        contactListElement.style.display = 'flex';
        loadContacts(); // Recarrega para refletir a ordem e última mensagem
    });
}