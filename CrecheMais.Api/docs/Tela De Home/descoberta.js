// descoberta.js
 
const crechesData = [
    { 
        id: 1, 
        name: "Creche ProInfância", 
        image: "../ImagensHome/Creche1.jpg", 
        rua: "Av. Principal",
        local: "Centro",
        tours: [
            {
                url: "https://kuula.co/share/collection/7MMJ2?logo=1&info=1&fs=1&vr=0&sd=1&thumbs=1",
                label: "Tour 1"
            },
            {
                url: "https://kuula.co/share/collection/7M3g3?logo=1&info=1&fs=1&vr=0&sd=1&thumbs=1",
                label: "Tour 2"
            }
        ]
    },
    // Para adicionar mais creches, insira aqui com o link do tour correspondente:
    // { 
    //     id: 2, 
    //     name: "Creche Municipal", 
    //     image: "../ImagensHome/Creche2.jpg", 
    //     rua: "Rua das Flores",
    //     local: "Bairro Norte",
    //     tours: [
    //         { url: "https://kuula.co/share/collection/SEU_LINK_AQUI?logo=1&info=1&fs=1&vr=0&sd=1&thumbs=1", label: "Tour 1" }
    //     ]
    // },
];

let currentTourIndex = 0;
 
document.addEventListener('DOMContentLoaded', () => {
    setupTourNavigation();
    loadKuulaTour(1);
    loadCrecheDetails(1);
    setupContactButton();
});
 
/**
 * Insere o tour 360° do Kuula no container via iframe.
 */
function loadKuulaTour(crecheId) {
    const mapContainer = document.getElementById('map-iframe-container');
    const creche = crechesData.find(c => c.id === crecheId);
 
    mapContainer.innerHTML = '';
 
    if (!creche || !creche.tours || creche.tours.length === 0) {
        mapContainer.innerHTML = '<p class="tour-unavailable">Tour 360° não disponível para esta creche.</p>';
        return;
    }

    // Obtém o tour atual pelo índice
    const currentTour = creche.tours[currentTourIndex];
    
    const iframe = document.createElement('iframe');
    iframe.src = currentTour.url;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.border = 'none';
    iframe.style.display = 'block';
    iframe.allowFullscreen = true;
    iframe.allow = 'xr-spatial-tracking; gyroscope; accelerometer';
    iframe.loading = 'lazy';

    mapContainer.appendChild(iframe);
    
    // Atualiza os indicadores de tour
    updateTourIndicators(creche);
    document.getElementById('map-creche-image').src = creche.image;
    document.getElementById('map-creche-name').textContent = `${creche.local}: ${creche.name} (Próxima)`;
    document.getElementById('contact-map-btn').dataset.id = creche.id;
}
 
/**
 * Configura o botão de contato para redirecionar à conversa.
 */
function setupContactButton() {
    const contactBtn = document.getElementById('contact-map-btn');

    contactBtn.addEventListener('click', (e) => {
        const crecheId = e.currentTarget.dataset.id;
        if (crecheId) {
            window.location.href = `chatlist.html?id=${crecheId}`;
        } else {
            alert("Nenhuma creche selecionada para contato.");
        }
    });
}

/**
 * Atualiza os indicadores de qual tour está sendo exibido.
 */
function updateTourIndicators(creche) {
    const indicators = document.querySelectorAll('.tour-indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentTourIndex);
    });
    
    // Mostra/esconde os botões de navegação
    const prevBtn = document.getElementById('tour-prev-btn');
    const nextBtn = document.getElementById('tour-next-btn');
    
    if (prevBtn) {
        prevBtn.style.visibility = currentTourIndex > 0 ? 'visible' : 'hidden';
    }
    if (nextBtn) {
        nextBtn.style.visibility = currentTourIndex < creche.tours.length - 1 ? 'visible' : 'hidden';
    }
}

/**
 * Configura os botões de navegação entre tours.
 */
function setupTourNavigation() {
    const prevBtn = document.getElementById('tour-prev-btn');
    const nextBtn = document.getElementById('tour-next-btn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => prevTour(1));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => nextTour(1));
    }
}

/**
 * Avança para o próximo tour.
 */
function nextTour(crecheId) {
    const creche = crechesData.find(c => c.id === crecheId);
    if (!creche || !creche.tours) return;
    
    if (currentTourIndex < creche.tours.length - 1) {
        currentTourIndex++;
        loadKuulaTour(crecheId);
    }
}

/**
 * Volta para o tour anterior.
 */
function prevTour(crecheId) {
    if (currentTourIndex > 0) {
        currentTourIndex--;
        loadKuulaTour(crecheId);
    }
}