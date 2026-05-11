// Efeito de scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Mensagem de boas-vindas
console.log("%cProjeto Prêmio Jovem Cientista 2026 - IA & Arte carregado com sucesso!", "color: #667eea; font-size: 14px;");// Efeito de scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Mensagem de boas-vindas
console.log("%cProjeto Prêmio Jovem Cientista 2026 - IA & Arte carregado com sucesso!", "color: #667eea; font-size: 14px;");