// Arquivo: perfil.js (Versão Final e Completa - CPF Visível e Creches Carregadas)

// --- DADOS DAS CRECHES ---
// Simula o banco de dados de creches para mapear o ID ao Nome.
const crechesData = [
    { id: 1, name: "Creche ProInfância", location: "Centro", vagas: 20 },
    { id: 2, name: "Creche Wanda Cruz", location: "Zona Sul", vagas: 15 },
    { id: 3, name: "CEMEI Armindo Barbosa", location: "Zona Norte", vagas: 10 },
    { id: 4, name: "Creche Santa Luzia", location: "Jardins", vagas: 5 },
    { id: 5, name: "Creche Praia Baby", location: "Centro", vagas: 0 }
];

document.addEventListener('DOMContentLoaded', () => {

    // -------------------- ELEMENTOS DO DOM --------------------
    const openChildModalBtn = document.getElementById('openChildModalBtn');
    const childModal = document.getElementById('childModal');
    const closeBtn = document.querySelector('.close-btn');
    const modalChildForm = document.getElementById('modalChildForm');
    const childTableBody = document.getElementById('children-table-body');
    const noDataMessage = document.getElementById('noDataMessage');
    const modalDeficienciaSim = document.getElementById('modalDeficienciaSim');
    const modalCampoTipoDeficiencia = document.getElementById('modalCampoTipoDeficiencia');
    const modalDeficienciaNao = document.getElementById('modalDeficienciaNao');
    const parentInfoList = document.getElementById('parent-info-list');
    const logoutBtn = document.getElementById('logoutBtn');
    const inputCPF = document.getElementById('modalCPF');
    const childrenTable = document.getElementById('children-table');
    const crechesCadastradasList = document.getElementById('creches-cadastradas-list');
    const crechesListaEsperaList = document.getElementById('creches-lista-espera-list');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const saveProfileBtn = document.getElementById('saveProfileBtn');


    // -------------------- LOCALSTORAGE / DADOS --------------------
    let dadosPais = JSON.parse(localStorage.getItem('dadosPais')) || {};
    let dadosLogin = JSON.parse(localStorage.getItem('dadosLogin')) || {};
    let childrenData = []; 
    // CARREGA DIRETAMENTE OS DADOS SALVOS NA HOME (ou vazios)
    let crechesCadastradas = JSON.parse(localStorage.getItem('crechesCadastradas')) || []; 
    let crechesListaEspera = JSON.parse(localStorage.getItem('crechesListaEspera')) || []; 

    // -------------------- FUNÇÕES DE CRUD E CARREGAMENTO DO FILHO --------------------
    
    function carregarCriancas() {
        childrenData = JSON.parse(localStorage.getItem('dadosFilhos')) || [];
        return childrenData;
    }

    function removerCrianca(index) {
        let cadastros = carregarCriancas();
        cadastros.splice(index, 1);
        localStorage.setItem('dadosFilhos', JSON.stringify(cadastros));
    }
    
    window.removerCriancaPerfil = function(index) {
        if (confirm('Tem certeza que deseja remover esta criança? Essa ação não pode ser desfeita.')) {
            removerCrianca(index);
            renderChildrenTable();
            alert('Criança removida com sucesso!');
        }
    };
    
    // -------------------- CRIANÇAS CADASTRADAS - RENDERIZAÇÃO --------------------
    const renderChildrenTable = () => {
        carregarCriancas();
        childTableBody.innerHTML = '';

        if (childrenData.length === 0) {
            noDataMessage.style.display = 'block';
            childrenTable.style.display = 'none';
            return;
        }

        noDataMessage.style.display = 'none';
        childrenTable.style.display = 'table';

        childrenData.forEach((child, index) => {
            const row = childTableBody.insertRow();
            
            row.insertCell().textContent = child.nome;
            row.insertCell().textContent = child.idade;
            
            // CPF TOTALMENTE VISÍVEL
            row.insertCell().textContent = child.cpf; 
            
            const pcdCell = row.insertCell();
            const isPcd = child.pcd === 'sim';
            pcdCell.textContent = isPcd ? 'Sim' : 'Não';
            if (isPcd) pcdCell.classList.add('pcd-yes');

            const tipoDeficienciaCell = row.insertCell();
            tipoDeficienciaCell.textContent = isPcd ? (child.tipoDeficiencia || 'Não Informado') : '-';
            
            const actionCell = row.insertCell();
            actionCell.className = 'action-cell';
            actionCell.innerHTML = `
                <button class="remove-child-btn" onclick="removerCriancaPerfil(${index})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#FF0000" viewBox="0 0 24 24">
                        <path d="M3 6h18v2H3V6zm3 3h12v12H6V9zm2 2v8h8v-8H8zm2-6V2h4v3h5v2H5V5h5z"/>
                    </svg>
                </button>
            `;
        });
    };

    // -------------------- PERFIL DO RESPONSÁVEL (Mantido) --------------------
    const renderParentInfoEditable = (isEditing = false) => {
        parentInfoList.innerHTML = '';
        
        const fields = [
            { label: 'Nome Completo', key: 'nome', source: dadosPais },
            { label: 'E-mail', key: 'email', source: dadosLogin },
            { label: 'Telefone', key: 'telefone', source: dadosPais },
            { label: 'Endereço', key: 'endereco', source: dadosPais }
        ];

        if (isEditing) {
            const inputGroup = document.createElement('div');
            inputGroup.className = 'input-group';

            fields.forEach(f => {
                const label = document.createElement('label');
                label.htmlFor = `input-${f.key}`;
                label.textContent = f.label;
                label.className = 'edit-label';

                const input = document.createElement('input');
                input.type = 'text';
                input.id = `input-${f.key}`;
                input.value = f.source[f.key] || '';
                input.className = 'edit-input';

                inputGroup.appendChild(label);
                inputGroup.appendChild(input);
            });

            parentInfoList.appendChild(inputGroup);
        } else {
            fields.forEach(f => {
                const div = document.createElement('div');
                div.className = 'info-item';

                div.innerHTML = `
                    <span class="info-label">${f.label}</span>
                    <span class="info-value">${f.source[f.key] || 'N/A'}</span>
                `;

                parentInfoList.appendChild(div);
            });
        }

        saveProfileBtn.style.display = isEditing ? 'inline-block' : 'none';
        editProfileBtn.style.display = isEditing ? 'none' : 'inline-block';
    };

    // -------------------- RENDERIZAÇÃO DA LISTA DE CRECHES (NOME E STATUS) --------------------
    /**
     * Exibe as creches salvas, mostrando apenas o Nome e o Status.
     */
    const renderCrechesList = (targetListElement, crecheIds, noDataElementId) => {
        targetListElement.innerHTML = '';
        const noDataElement = document.getElementById(noDataElementId);

        // 1. Verifica se há IDs para renderizar
        if (crecheIds.length === 0) {
            if (noDataElement) {
                noDataElement.style.display = 'block';
                if (!targetListElement.contains(noDataElement)) { 
                    targetListElement.appendChild(noDataElement);
                }
            }
            return;
        }

        // Mapeia os IDs para os objetos de creche (obtendo o nome)
        const creches = crecheIds.map(id => crechesData.find(c => c.id === id)).filter(Boolean);
        if (creches.length === 0) return;

        if (noDataElement) noDataElement.style.display = 'none';

        // 2. Itera e exibe APENAS o nome e o status
        creches.forEach(creche => {
            const div = document.createElement('div');
            div.className = 'info-item creche-item'; 
            
            // Define o status e a classe de cor
            const isListaEspera = targetListElement.id === 'creches-lista-espera-list';
            const statusText = isListaEspera ? 'Aguardando Vaga' : 'Matriculado';
            const statusClass = isListaEspera ? 'pcd-yes' : 'status-cadastrado'; 

            // Exibe o nome e o status.
            div.innerHTML = `
                <span class="info-label">${creche.name}</span>
                <span class="info-value ${statusClass}">${statusText}</span>
            `;
            targetListElement.appendChild(div);
        });
    };

    // -------------------- MODAL FILHO (Mantido) --------------------
    const toggleDeficienciaField = () => {
        modalCampoTipoDeficiencia.style.display = modalDeficienciaSim.checked ? 'block' : 'none';
    };

    modalDeficienciaSim?.addEventListener('change', toggleDeficienciaField);
    modalDeficienciaNao?.addEventListener('change', toggleDeficienciaField);
    toggleDeficienciaField();

    openChildModalBtn?.addEventListener('click', () => childModal.style.display = 'block');
    closeBtn?.addEventListener('click', () => {
        childModal.style.display = 'none';
        modalChildForm.reset();
        toggleDeficienciaField();
    });
    window.onclick = e => {
        if (e.target === childModal) {
            childModal.style.display = 'none';
            modalChildForm.reset();
            toggleDeficienciaField();
        }
    };

    // -------------------- SALVAR FILHO NO MODAL --------------------
    modalChildForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = document.getElementById('modalNomedoFilho').value.trim();
        const idade = document.getElementById('modalIdade').value.trim();
        const cpf = document.getElementById('modalCPF').value.trim(); 
        const pcd = document.querySelector('input[name="modalDeficiencia"]:checked').value;
        const tipoDeficiencia = pcd === 'sim' ? document.getElementById('modalTipoDeficiencia').value.trim() : '';

        if (!nome || !idade || !cpf) {
            alert('Preencha todos os campos obrigatórios!');
            return;
        }

        if (pcd === 'sim' && !tipoDeficiencia) {
            alert('Descreva o tipo de deficiência.');
            return;
        }

        let currentChildren = JSON.parse(localStorage.getItem('dadosFilhos')) || [];
        currentChildren.push({ nome, idade, cpf, pcd, tipoDeficiencia });
        localStorage.setItem('dadosFilhos', JSON.stringify(currentChildren));
        
        renderChildrenTable(); 
        window.dispatchEvent(new Event('storage')); 
        
        childModal.style.display = 'none';
        modalChildForm.reset();
        toggleDeficienciaField();
        alert(`Criança ${nome} cadastrada com sucesso!`);
    });

    // -------------------- MÁSCARA CPF NO MODAL (Mantida) --------------------
    inputCPF?.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 3) value = value.replace(/^(\d{3})(\d)/, "$1.$2");
        if (value.length > 6) value = value.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
        if (value.length > 9) value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
        e.target.value = value;
    });

    // -------------------- EDITAR / SALVAR PERFIL (Mantido) --------------------
    renderParentInfoEditable(false);

    editProfileBtn?.addEventListener('click', () => renderParentInfoEditable(true));

    saveProfileBtn?.addEventListener('click', () => {
        dadosPais.nome = document.getElementById('input-nome').value.trim();
        dadosPais.telefone = document.getElementById('input-telefone').value.trim();
        dadosPais.endereco = document.getElementById('input-endereco').value.trim();
        dadosLogin.email = document.getElementById('input-email').value.trim();

        localStorage.setItem('dadosPais', JSON.stringify(dadosPais));
        localStorage.setItem('dadosLogin', JSON.stringify(dadosLogin));

        alert('Perfil atualizado com sucesso!');
        renderParentInfoEditable(false);
    });

    // -------------------- LOGOUT (Mantido) --------------------
logoutBtn?.addEventListener('click', () => {
        // NÃO remova dadosPais ou dadosFilhos, pois eles são o seu "Banco de Dados" local.
        // Se você remover, o usuário perde o cadastro para sempre neste navegador.
        
        // Apenas redirecionamos para a tela de autenticação.
        // Se quiser "deslogar" de fato no Firebase:
        // auth.signOut(); // (Necessário importar o auth do firebase)
        
        if (confirm('Deseja realmente sair da conta? Seus dados permanecerão salvos neste dispositivo.')) {
            window.location.href = '../Tela de Autenticacao/autenticacao.html';
        }
    });
    
    // -------------------- SINCRONIZAÇÃO DE DADOS (Mantida) --------------------
    window.addEventListener('storage', (e) => {
        // Recarrega as tabelas de filhos e creches se os dados forem alterados em outra aba/janela
        if (e.key === 'dadosFilhos' || e.key === 'crechesCadastradas' || e.key === 'crechesListaEspera' || e.key === null) { 
            crechesCadastradas = JSON.parse(localStorage.getItem('crechesCadastradas')) || []; 
            crechesListaEspera = JSON.parse(localStorage.getItem('crechesListaEspera')) || [];
            renderChildrenTable();
            renderCrechesList(crechesCadastradasList, crechesCadastradas, 'noCrechesCadastradas');
            renderCrechesList(crechesListaEsperaList, crechesListaEspera, 'noCrechesListaEspera');
        }
    });

    // -------------------- INICIALIZAÇÃO --------------------
    renderChildrenTable();
    // Chamadas para renderizar as listas de creches (nome e status)
    renderCrechesList(crechesCadastradasList, crechesCadastradas, 'noCrechesCadastradas');
    renderCrechesList(crechesListaEsperaList, crechesListaEspera, 'noCrechesListaEspera');
});