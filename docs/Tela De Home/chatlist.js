// chatlist.js
let allChats = [];
const NO_MESSAGE_PLACEHOLDER = "Iniciar Conversa...";

// Dados das creches
function getCrecheDataById(id) {
    const allCreches = [
        { id: 1, name: "Creche ProInfância", image: "../ImagensHome/Creche1.jpg" },
        { id: 2, name: "Creche Wanda Cruz", image: "../ImagensHome/Creche2.jpg" },
        { id: 3, name: "CEMEI Armindo Barbosa", image: "../ImagensHome/Creche3.jpg" },
        { id: 4, name: "Creche Santa Luzia", image: "../ImagensHome/Creche4.jpg" },
        { id: 5, name: "Creche Praia Baby", image: "../ImagensHome/Creche5.png" }
    ];
    return allCreches.find(c => c.id === id);
}

// Carrega chats do localStorage
function loadAllChats() {
    let storedChats = JSON.parse(localStorage.getItem('chats')) || [];
    allChats = storedChats;
}

// Renderiza lista de contatos
function renderContactList() {
    const contactList = document.getElementById('contact-list');
    const noContacts = document.getElementById('no-contacts');

    // Filtra chats: só exibe se houver ao menos uma mensagem
    const displayChats = allChats.filter(chat => chat.messages && chat.messages.length > 0);

    contactList.innerHTML = '';

    if (displayChats.length === 0) {
        if (noContacts) noContacts.style.display = 'block';
    } else {
        if (noContacts) noContacts.style.display = 'none';

        // Ordena pelo timestamp da última mensagem
        displayChats.sort((a, b) => {
            const timeA = a.messages.length > 0 ? new Date(a.messages[a.messages.length - 1].timestamp).getTime() : 0;
            const timeB = b.messages.length > 0 ? new Date(b.messages[b.messages.length - 1].timestamp).getTime() : 0;
            return timeB - timeA;
        });

        displayChats.forEach(chat => {
            const card = createContactCard(chat);
            contactList.appendChild(card);
        });
    }
}

// Cria cartão de contato
function createContactCard(chat) {
    const div = document.createElement('div');
    div.classList.add('contact-item');
    div.dataset.id = chat.crecheId;

    div.addEventListener('click', () => openSpecificChat(chat.crecheId));

    const lastMessageTimestamp = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].timestamp : null;
    const timeDisplay = lastMessageTimestamp
        ? new Date(lastMessageTimestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        : '';

    const imageUrl = chat.crecheImage || getCrecheDataById(chat.crecheId)?.image || '../ImagensHome/placeholder-creche.png';

    div.innerHTML = `
        <img src="${imageUrl}" alt="Foto da Creche" class="contact-image">
        <div class="contact-info">
            <p class="contact-name">${chat.crecheName}</p>
            <p class="contact-last-msg">${chat.lastMessage || 'Nenhuma mensagem'}</p>
        </div>
        <div class="contact-time">${timeDisplay}</div>
    `;

    return div;
}

// Abre chat específico
function openSpecificChat(crecheId) {
    window.location.href = `conversaunica.html?id=${crecheId}`;
}

// Botão de voltar
function setupChatListEventListeners() {
    const backButton = document.getElementById('back-to-contacts');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = 'home.html';
        });
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadAllChats();
    renderContactList();
    setupChatListEventListeners();
});
