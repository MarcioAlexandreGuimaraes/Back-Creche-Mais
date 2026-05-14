
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
  import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

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

  const signupForm = document.getElementById('signupForm');
  const emailInput = document.getElementById('email');
  const googleBtn = document.getElementById('googleBtn');
  const termsLink = document.getElementById('termsLink');
  const privacyLink = document.getElementById('privacyLink');

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (email) {
      localStorage.setItem('userEmail', email);
      window.location.href = '../CadastrosPais/cadastrospais.html';
    } else {
      alert('Por favor, insira um e-mail válido.');
    }
  });

  googleBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem('userEmail', result.user.email);
      window.location.href = '../CadastrosPais/cadastrospais.html';
    } catch (error) {
      console.error(error);
      alert('Erro no login com o Google: ' + error.message);
    }
  });

  termsLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Termos de Serviço seriam exibidos aqui.');
  });

  privacyLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Política de Privacidade seria exibida aqui.');
  });
