import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

// --- CONFIGURAÇÃO FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyDq00U1RYcWd1x5dLC6cqYhHikgBgPuwMM",
    authDomain: "creche-mais.firebaseapp.com",
    projectId: "creche-mais",
    storageBucket: "creche-mais.firebasestorage.app",
    messagingSenderId: "431728403505",
    appId: "1:431728403505:web:1ae60ab505d9d285d8a110"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// --- CONFIGURAÇÃO DA API (BACKEND C#) ---
// Aponta explicitamente para o backend ASP.NET
const API_BASE_URL = "http://localhost:5035/api";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const googleBtn = document.getElementById('googleBtn');
    const btnCriarConta = document.getElementById('btnCriarConta');

    // 1. LOGIN MANUAL (E-mail e Senha) via Backend C#
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const loginData = {
                Email: emailInput.value.trim(),
                Password: senhaInput.value
            };

            try {
                // Chamada para o Endpoint Login no Controller C#
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(loginData)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    // O Backend validou as credenciais com sucesso
                    console.log('Login validado pelo servidor:', result.message);
                    
                    // Guardamos apenas info básica da sessão
                    localStorage.setItem('userSession', JSON.stringify({
                        logged: true,
                        email: loginData.email,
                        userType: result.userType
                    }));

                    window.location.href = '../Tela De Home/home.html';
                } else {
                    // O servidor devolveu um erro (ex: e-mail ou senha errados)
                    alert(result.message || 'Dados de acesso inválidos.');
                }

            } catch (error) {
                console.error('Erro ao conectar com a API:', error);
                alert('Erro de ligação com o servidor. Verifique se a sua API C# está ativa.');
            }
        });
    }

    // 2. LOGIN COM GOOGLE (Integrado com o Backend)
    if (googleBtn) {
        googleBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const provider = new GoogleAuthProvider();

            try {
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                console.log('Firebase login bem-sucedido:', user.email);

                try {
                    // Enviamos o email para o C# verificar se o utilizador já completou o cadastro
                    const response = await fetch(`${API_BASE_URL}/auth/google-check`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: user.email })
                    });

                    const apiResult = await response.json();
                    console.log('Resposta do servidor:', apiResult);

                    if (apiResult.isNewUser) {
                        alert('Usuário Google não encontrado no banco de dados. Será necessário cadastrar uma conta.');
                        // Salva o email do Google para pré-preencher no cadastro
                        localStorage.setItem('dadosLogin', JSON.stringify({
                            email: user.email,
                            senha: '' // Senha vazia, será definida no cadastro
                        }));
                        window.location.href = '../CadastrosPais/cadastrospais.html';
                    } else {
                        localStorage.setItem('userSession', JSON.stringify({
                            logged: true,
                            email: user.email,
                            authProvider: 'google'
                        }));
                        window.location.href = '../Tela De Home/home.html';
                    }
                } catch (apiError) {
                    console.error('Erro ao conectar com a API:', apiError);
                    alert('Erro de ligação com o servidor. Verifique se a sua API C# está ativa.');
                }

            } catch (error) {
                console.error('Erro na autenticação Google:', error);
                alert('Ocorreu um erro ao tentar entrar com o Google: ' + error.message);
            }
        });
    }

    // 3. BOTÃO CRIAR CONTA
    if (btnCriarConta) {
        btnCriarConta.addEventListener('click', () => {
            window.location.href = '../Tela de Login/login.html'; 
        });
    }
});