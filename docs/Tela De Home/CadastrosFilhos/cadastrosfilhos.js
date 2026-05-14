// Arquivo: cadastrosfilhos.js (Versão Final Corrigida - CPF Visível)

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('parentForm');
    const btnContinuar = document.getElementById('btnContinuar');
    const gridContainer = document.getElementById('gridContainer');
    const gridBody = document.getElementById('gridBody');
    const noDataMessage = document.getElementById('noDataMessage');
    const btnVoltar = document.getElementById('btnVoltar');
    const campoTipoDeficiencia = document.getElementById('campoTipoDeficiencia');
    const radioButtonsDeficiencia = document.querySelectorAll('input[name="deficiencia"]');
    const cpfInput = document.getElementById('CPF');
    const card = document.querySelector('.card');

    // ✅ Máscara CPF (Para o input, não para a exibição)
    cpfInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
        e.target.value = value;
    });

    // ✅ Mostrar / esconder campo tipo de deficiência
    function toggleCampoTipoDeficiencia() {
        const checkedRadio = document.querySelector('input[name="deficiencia"]:checked');
        const deficienciaSelecionada = checkedRadio ? checkedRadio.value : 'nao';

        campoTipoDeficiencia.style.display = deficienciaSelecionada === 'sim' ? 'block' : 'none';
        
        if (deficienciaSelecionada === 'nao') document.getElementById('tipoDeficiencia').value = '';
    }
    radioButtonsDeficiencia.forEach(r => r.addEventListener('change', toggleCampoTipoDeficiencia));
    toggleCampoTipoDeficiencia();

    // ✅ Habilitar botão Continuar apenas se houver filhos
    function checkContinuarButton() {
        const cadastros = carregarCriancas();
        btnContinuar.disabled = cadastros.length < 1;
    }

    // ✅ CRUD LocalStorage
    function salvarCrianca(crianca) {
        let cadastros = carregarCriancas();
        cadastros.push(crianca);
        localStorage.setItem('dadosFilhos', JSON.stringify(cadastros));
        
        // 🔹 Dispara evento storage para atualizar perfil.js se estiver aberto
        window.dispatchEvent(new Event('storage')); 
    }

    function carregarCriancas() {
        return JSON.parse(localStorage.getItem('dadosFilhos')) || [];
    }

    function removerCrianca(index) {
        let cadastros = carregarCriancas();
        cadastros.splice(index, 1);
        localStorage.setItem('dadosFilhos', JSON.stringify(cadastros));
        window.dispatchEvent(new Event('storage'));
    }

    // ✅ Exibir Grid de Filhos
    function exibirGrid() {
        const cadastros = carregarCriancas();

        if (cadastros.length === 0) {
            noDataMessage.style.display = 'block';
            gridBody.innerHTML = '';
        } else {
            noDataMessage.style.display = 'none';
            gridBody.innerHTML = cadastros.map((crianca, index) => {
                const isPcd = crianca.pcd === 'sim';
                const deficienciaColuna = isPcd ? 'Sim' : 'Não';
                const tipoDeficienciaColuna = isPcd ? crianca.tipoDeficiencia || '-' : '-';
                
                // ⭐ CORREÇÃO: CPF TOTALMENTE VISÍVEL
                const cpfCompleto = crianca.cpf; 

                return `
                    <tr class="table-row-container">
                        <td>${crianca.nome}</td>
                        <td>${crianca.idade}</td>
                        <td class="cpf">${cpfCompleto}</td>
                        <td class="${isPcd ? 'pcd-yes' : ''}">${deficienciaColuna}</td>
                        <td>${tipoDeficienciaColuna}</td>
                        <td style="text-align: center;">
                            <span class="removerCriancaGrid" onclick="removerCriancaGrid(${index})">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#FF0000" viewBox="0 0 24 24">
                                    <path d="M3 6h18v2H3V6zm3 3h12v12H6V9zm2 2v8h8v-8H8zm2-6V2h4v3h5v2H5V5h5z"/>
                                </svg>
                            </span>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        card.style.display = 'none';
        gridContainer.style.display = 'block';
    }

    // ✅ Expor remover globalmente
    window.removerCriancaGrid = function(index) {
        if (confirm('Tem certeza que deseja remover esta criança?')) {
            removerCrianca(index);
            exibirGrid(); 
            checkContinuarButton(); 
        }
    };

    // ✅ Submit do Formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const nome = document.getElementById('NomedoFilho').value.trim();
        const idade = document.getElementById('Idade').value.trim();
        const cpf = document.getElementById('CPF').value.trim();
        const deficiencia = document.querySelector('input[name="deficiencia"]:checked').value;
        const tipoDeficiencia = deficiencia === 'sim' ? document.getElementById('tipoDeficiencia').value.trim() : '';

        if (!nome || !idade || !cpf) {
            alert('Preencha todos os campos obrigatórios!');
            return;
        }
        if (deficiencia === 'sim' && !tipoDeficiencia) {
            alert('Descreva o tipo de deficiência!');
            return;
        }

        const crianca = { nome, idade, cpf, pcd: deficiencia, tipoDeficiencia };
        salvarCrianca(crianca); 

        form.reset();
        document.getElementById('deficienciaNao').checked = true;
        toggleCampoTipoDeficiencia(); 
        checkContinuarButton();

        // ⭐ CORREÇÃO DA SINCRONIZAÇÃO: Chama exibirGrid() imediatamente após salvar
        exibirGrid(); 
        
        alert(`Criança ${nome} cadastrada com sucesso!`);
    });

    // ✅ Botões
    btnContinuar.addEventListener('click', function() {
        if (!btnContinuar.disabled) {
            window.location.href = '../home.html';
        }
    });

    document.getElementById('btnRegistroFilhos')?.addEventListener('click', exibirGrid);

    document.getElementById('btnVoltar')?.addEventListener('click', function() {
        gridContainer.style.display = 'none';
        card.style.display = 'block';
    });

    // ✅ Inicialização
    checkContinuarButton();
});