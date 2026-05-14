// Arquivo: home.js (Ajuste Final para Filtros: Esconder Recomendadas no Favorito/Histórico)

// Dados das creches (Simulados)
const crechesData = [
    { id: 1, name: "Creche ProInfância", description: "Creche moderna e bem equipada.", location: "Centro", rating: 4.8, reviews: 125, image: "../ImagensHome/Creche1.jpg", category: "próxima", rua: "Av. Principal", bairro: "Centro", cidade: "São Paulo", estado: "SP", numero: 1234, vagas: 20, diretor: "Sra. Ana Paula", manha: "07:30 - 11:30", tarde: "13:00 - 17:00" },
    { id: 2, name: "Creche Wanda Cruz", description: "Ambiente acolhedor e seguro.", location: "Zona Sul", rating: 4.9, reviews: 89, image: "../ImagensHome/Creche2.jpg", category: "próxima", rua: "Rua das Flores", bairro: "Jardim América", cidade: "Campinas", estado: "SP", numero: 500, vagas: 15, diretor: "Sr. João Silva", manha: "08:00 - 12:00", tarde: "13:30 - 17:30" },
    { id: 3, name: "CEMEI Armindo Barbosa", description: "Creche pública com ótima estrutura.", location: "Zona Norte", rating: 4.7, reviews: 203, image: "../ImagensHome/Creche3.jpg", category: "próxima", rua: "Rua da Paz", bairro: "Ana Pinto", cidade: "Araxá", estado: "MG", numero: 88, vagas: 10, diretor: "Dra. Carla Mendes", manha: "07:00 - 11:00", tarde: "14:00 - 18:00" },
    { id: 4, name: "Creche Santa Luzia", description: "Excelência no atendimento infantil.", location: "Jardins", rating: 5.0, reviews: 67, image: "../ImagensHome/Creche4.jpg", category: "recomendada", rua: "Alameda das Rosas", bairro: "Jardins", cidade: "São Paulo", estado: "SP", numero: 101, vagas: 5, diretor: "Prof. Ricardo Alves", manha: "08:30 - 12:30", tarde: "14:00 - 18:00" },
    { id: 5, name: "Creche Praia Baby", description: "Perfeita para famílias do litoral.", location: "Centro", rating: 4.6, reviews: 142, image: "../ImagensHome/Creche5.png", category: "recomendada", rua: "Rua Sete de Setembro", bairro: "Centro", cidade: "Belo Horizonte", estado: "MG", numero: 2020, vagas: 0, diretor: "Sra. Helena Costa", manha: "07:00 - 11:30", tarde: "12:30 - 17:00" }
];

// Estado global (Favoritos e Histórico)
let favoritedCreches = JSON.parse(localStorage.getItem('favoritedCreches')) || [];
let detailsHistory = JSON.parse(localStorage.getItem('detailsHistory')) || [];

// NOVOS ESTADOS PARA O TOGGLE
let isShowingFavorites = false;
let isShowingHistory = false;

document.addEventListener('DOMContentLoaded', () => {
    loadCreches();
    setupSearch();
    setupButtons();
    setupModalListeners();
});

// ==============================
// Funções Auxiliares de Feedback e Navegação
// ==============================

// NOVO: Adiciona a creche ao localStorage e retorna a mensagem
function saveCrecheToProfile(crecheId, storageKey, message) {
    let currentList = JSON.parse(localStorage.getItem(storageKey)) || [];
    
    if (currentList.includes(crecheId)) {
        return `A Creche ID ${crecheId} já está na sua lista!`;
    }

    currentList.push(crecheId);
    localStorage.setItem(storageKey, JSON.stringify(currentList));
    
    return message;
}

// NOVO: Exibe mensagem de sucesso e fecha o modal
function showSuccessAndClose(modal, successMsg, message) {
    const actionBtn = document.getElementById('action-btn');
    
    // 1. Exibir a mensagem de sucesso
    successMsg.textContent = message;
    successMsg.style.display = 'block';

    // 2. Ocultar o botão de ação
    actionBtn.style.display = 'none';

    // 3. Fechar o modal após um curto período de tempo
    setTimeout(() => {
        modal.style.display = 'none';
        
        // 4. Resetar o estado do botão para a próxima abertura
        actionBtn.style.display = 'block'; 
        successMsg.style.display = 'none'; 
        
    }, 1500); 
}

// Lógica de Criação do Chat (Função Centralizada)
function handleInitialContact(crecheId) {
    const creche = crechesData.find(c => c.id === crecheId);
    if (!creche) return;

    let chats = JSON.parse(localStorage.getItem('chats') || '[]'); 
    
    const initialMessage = { 
        sender: 'system', 
        text: `Bem-vindo(a) ao chat com a ${creche.name}. Digite sua primeira mensagem.`,
        timestamp: new Date().toISOString()
    };

    const newChat = {
        crecheId: creche.id,
        crecheName: creche.name,
        crecheImage: creche.image,
        lastMessage: initialMessage.text,
        messages: [initialMessage]
    };

    const existingChatIndex = chats.findIndex(c => c.crecheId === crecheId);

    if (existingChatIndex === -1) {
        chats.unshift(newChat);
    } else {
        const existingChat = chats[existingChatIndex];
        chats.splice(existingChatIndex, 1); 
        chats.unshift(existingChat);
    }

    localStorage.setItem('chats', JSON.stringify(chats));

    // Redireciona para o chat para comunicações gerais
    window.location.href = `conversaunica.html?id=${crecheId}`; 
}

function addToHistory(creche) {
    const historyItem = { id: creche.id, name: creche.name, date: new Date().toLocaleString() };
    detailsHistory = detailsHistory.filter(h => h.id !== creche.id);
    detailsHistory.unshift(historyItem);
    localStorage.setItem('detailsHistory', JSON.stringify(detailsHistory));
}

function toggleFavorite(e) {
    const btn = e.target.closest('.favorite-btn');
    if (!btn) return;

    const id = parseInt(btn.dataset.id);
    if (favoritedCreches.includes(id)) {
        favoritedCreches = favoritedCreches.filter(f => f !== id);
    } else {
        favoritedCreches.push(id);
    }

    localStorage.setItem('favoritedCreches', JSON.stringify(favoritedCreches));
    
    if (isShowingFavorites) {
        handleFilterFavorites();
    } else {
        loadCreches(); 
    }
}

function resetFilters() {
    isShowingFavorites = false;
    isShowingHistory = false;
    document.getElementById('favoritos-btn').classList.remove('active');
    document.getElementById('historico-btn').classList.remove('active');
    
    loadCreches();
}


// ==============================
// Funções de Renderização
// ==============================
function loadCreches(list = crechesData) {
    const nearby = document.getElementById('creches-list');
    const recommendedList = document.getElementById('recommended-list'); // Renomeado
    const recommendedSection = recommendedList.closest('.creches-section').previousElementSibling; // Pega o <h2> "Creches Recomendadas"
    const title = document.getElementById('creches-title');
    
    nearby.innerHTML = '';
    recommendedList.innerHTML = '';
    
    // Se a lista passada for a lista de creches original, renderiza em duas colunas.
    if (list === crechesData) {
        title.textContent = "Creches";
        
        // Exibe a seção de recomendadas e a linha divisória
        recommendedList.closest('.creches-section').style.display = 'block';
        if (recommendedSection && recommendedSection.classList.contains('divider')) {
             recommendedSection.style.display = 'block';
        }

        list.forEach(creche => {
            const card = createCrecheCard(creche);
            if (creche.category === "próxima") {
                nearby.appendChild(card);
            } else if (creche.category === "recomendada") {
                recommendedList.appendChild(card); // Usa o novo nome da variável
            }
        });

    } else {
        // Se a lista for filtrada (Favoritos, Histórico ou Busca):
        
        // Oculta a seção de recomendadas e a linha divisória
        recommendedList.closest('.creches-section').style.display = 'none';
        if (recommendedSection && recommendedSection.classList.contains('divider')) {
            recommendedSection.style.display = 'none';
        }

        if (list.length === 0) {
            nearby.innerHTML = '<div style="padding: 20px; text-align: center; width: 100%;">Nenhuma creche encontrada.</div>';
            return;
        }
        
        // Renderiza toda a lista filtrada na seção principal (creches-list)
        list.forEach(creche => {
            nearby.appendChild(createCrecheCard(creche));
        });
    }
}

function renderFilteredList(titleText, list) {
    const title = document.getElementById('creches-title');
    title.textContent = titleText;
    
    // NOTA: A função loadCreches é chamada aqui com a lista filtrada,
    // garantindo que 'recommended-list' será ocultada conforme a lógica acima.
    loadCreches(list);
}

function createCrecheCard(creche) {
    const isFav = favoritedCreches.includes(creche.id);
    const div = document.createElement('div');
    div.classList.add('creche-card');

    div.innerHTML = `
        <div class="creche-image-container">
            <img src="${creche.image}" alt="${creche.name}" class="creche-image">
        </div>
        <div class="creche-info">
            <h3 class="creche-name">${creche.name}</h3>
            <p class="creche-description">${creche.description}</p>
            <div class="creche-details">
                <span>📍 ${creche.location}</span>
                <span>⭐ ${creche.rating} (${creche.reviews} avaliações)</span>
            </div>
            <div class="creche-actions">
                <button class="favorite-btn ${isFav ? 'favorited' : ''}" data-id="${creche.id}">
                    <img src="${isFav ? '../ImagensHome/heartred.png' : '../ImagensHome/like.png'}" alt="Favoritar">
                </button>
                <button class="contact-btn" data-id="${creche.id}">Entrar em Contato</button>
                <button class="details-btn" data-id="${creche.id}">&#8801;</button>
            </div>
        </div>
    `;
    return div;
}

// ==============================
// Modal de detalhes (ATUALIZADO PARA SALVAR CRECHES)
// ==============================
function showCrecheDetails(e) {
    const btn = e.target.closest('.details-btn');
    if (!btn) return;

    const creche = crechesData.find(c => c.id === parseInt(btn.dataset.id));
    if (!creche) return;

    const modal = document.getElementById('creche-modal');
    const actionBtn = document.getElementById('action-btn');
    const successMsg = document.getElementById('success-message');
    
    // Garantir estado inicial correto do modal
    successMsg.style.display = 'none';
    actionBtn.style.display = 'block';

    // PREENCHIMENTO DOS CAMPOS DE INFORMAÇÃO
    document.getElementById('modal-name').textContent = creche.name;
    document.getElementById('modal-image').src = creche.image;
    document.getElementById('modal-rua').textContent = creche.rua;
    document.getElementById('modal-numero').textContent = creche.numero;
    document.getElementById('modal-bairro').textContent = creche.bairro;
    document.getElementById('modal-cidade').textContent = creche.cidade;
    document.getElementById('modal-estado').textContent = creche.estado;
    document.getElementById('modal-vagas').textContent = creche.vagas;
    document.getElementById('modal-diretor').textContent = creche.diretor;
    document.getElementById('modal-manha').textContent = creche.manha;
    document.getElementById('modal-tarde').textContent = creche.tarde;

    // LÓGICA DE VAGAS PARA O BOTÃO PRINCIPAL (action-btn)
    const vagasDisponiveis = creche.vagas > 0;
    
    if (vagasDisponiveis) {
        // Se houver vagas (> 0): Cadastrar
        actionBtn.textContent = "Cadastrar na Creche";
        actionBtn.style.backgroundColor = "#4CAF50"; 
        
        // CHAMA A FUNÇÃO DE SALVAR COMO CADASTRADA
        actionBtn.onclick = () => {
            const message = saveCrecheToProfile(
                creche.id, 
                'crechesCadastradas', 
                `Cadastro na ${creche.name} enviado com sucesso!`
            );
            showSuccessAndClose(modal, successMsg, message);
        };
        
    } else {
        // Se NÃO houver vagas (0): Lista de Espera
        actionBtn.textContent = "Entrar na Lista de Espera";
        actionBtn.style.backgroundColor = "#FF9800"; 
        
        // CHAMA A FUNÇÃO DE SALVAR COMO LISTA DE ESPERA
        actionBtn.onclick = () => {
            const message = saveCrecheToProfile(
                creche.id, 
                'crechesListaEspera', 
                `Solicitação de Lista de Espera para ${creche.name} enviada com sucesso!`
            );
            showSuccessAndClose(modal, successMsg, message);
        };
    }
    
    addToHistory(creche);
    modal.style.display = 'flex';
}

// ==============================
// Funções de Filtro
// ==============================

function handleFilterFavorites() {
    isShowingHistory = false;
    document.getElementById('historico-btn').classList.remove('active');

    isShowingFavorites = true;
    document.getElementById('favoritos-btn').classList.add('active');

    const favs = crechesData.filter(c => favoritedCreches.includes(c.id));
    renderFilteredList(`Favoritos (${favs.length})`, favs);
}

function handleFilterHistory() {
    isShowingFavorites = false;
    document.getElementById('favoritos-btn').classList.remove('active');

    isShowingHistory = true;
    document.getElementById('historico-btn').classList.add('active');

    const historyList = detailsHistory
        .map(h => crechesData.find(c => c.id === h.id))
        .filter(Boolean);
        
    renderFilteredList(`Histórico (${historyList.length})`, historyList);
}

// ==============================
// Setup de Listeners
// ==============================

function setupSearch() {
    const input = document.getElementById('search-input');
    
    document.getElementById('search-btn').addEventListener('click', triggerSearch);
    input.addEventListener('input', triggerSearch);

    function triggerSearch() {
        resetFilters(); 
        
        const term = input.value.toLowerCase();
        if (term.trim() === '') {
            loadCreches(); 
            return;
        }

        const results = crechesData.filter(c =>
            c.name.toLowerCase().includes(term) ||
            c.bairro.toLowerCase().includes(term) ||
            c.cidade.toLowerCase().includes(term)
        );

        renderFilteredList(results.length > 0 ? `Resultados para "${term}"` : `Nenhuma creche encontrada para "${term}"`, results);
    }
}

function setupButtons() {
    document.getElementById('favoritos-btn').addEventListener('click', () => {
        isShowingFavorites ? resetFilters() : handleFilterFavorites();
    });

    document.getElementById('historico-btn').addEventListener('click', () => {
        isShowingHistory ? resetFilters() : handleFilterHistory();
    });

    document.getElementById('chat-btn').addEventListener('click', () => {
        window.location.href = "chatlist.html";
    });
}

function setupModalListeners() {
    const modal = document.getElementById('creche-modal');
    
    const closeBtn = document.querySelector('.modal-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Delegação global de eventos
document.addEventListener('click', (e) => {
    if (e.target.closest('.details-btn')) showCrecheDetails(e);
    if (e.target.closest('.favorite-btn')) toggleFavorite(e); 
    
    // O botão "Entrar em Contato" nos CARDS (visão geral) deve levar para o CHAT
    const contactBtn = e.target.closest('.contact-btn');
    if (contactBtn) {
        const crecheId = parseInt(contactBtn.dataset.id);
        handleInitialContact(crecheId); 
    }
});