// Arquivo: cadastrospais.js

document.addEventListener('DOMContentLoaded', () => {
    const parentForm = document.getElementById('parentForm');
    const emailInput = document.getElementById('email');
    const nomeInput = document.getElementById('nome');
    const telefoneInput = document.getElementById('telefone');
    const enderecoInput = document.getElementById('endereco');
    const senhaInput = document.getElementById('senha'); 

    // 1. CARREGA dadosLogin para pré-preencher o e-mail
    const dadosLoginStr = localStorage.getItem('dadosLogin');
    let dadosLogin = dadosLoginStr ? JSON.parse(dadosLoginStr) : null;

    if (dadosLogin && dadosLogin.email) {
        emailInput.value = dadosLogin.email;
        emailInput.readOnly = true; // Impede a edição do e-mail de login
    } else {
        alert('E-mail não encontrado. Por favor, faça login novamente.');
        // Redireciona de volta em caso de erro
        window.location.href = '../TelaDeLogin/login.html'; 
    }
    
    // 2. Lógica de Submissão
    if (parentForm) {
        parentForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // 2.1 Coleta os valores
            const email = emailInput.value.trim();
            const nome = nomeInput.value.trim();
            const telefone = telefoneInput.value.trim();
            const endereco = enderecoInput.value.trim();
            const senha = senhaInput.value; // Pega a senha criada aqui

            if (email && nome && telefone && endereco && senha) {
                
                // 2.2 Cria o objeto de dados do Pai/Mãe
                const dadosPais = {
                    nome: nome,
                    telefone: telefone,
                    endereco: endereco,
                };
                
                // 2.3 ATUALIZA A SENHA no objeto dadosLogin e salva
                dadosLogin.senha = senha;
                localStorage.setItem('dadosLogin', JSON.stringify(dadosLogin));
                
                // 2.4 Salva os dados do Pai/Mãe em sua chave
                localStorage.setItem('dadosPais', JSON.stringify(dadosPais));

                console.log('Dados do login (com senha) e do pai salvos localmente.');

                // 2.5 Redireciona para a página de cadastro dos filhos
                window.location.href = '../Tela De Home/CadastrosFilhos/cadastrosfilhos.html';
            } else {
                alert('Por favor, preencha todos os campos.');
            }
        });
    }

    // Máscara de Telefone (Opcional, mas recomendado para UX)
    telefoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 2) value = value.replace(/^(\d{2})(\d)/, "($1) $2");
        if (value.length > 7) value = value.replace(/(\d{5})(\d)/, "$1-$2");
        e.target.value = value;
    });
});