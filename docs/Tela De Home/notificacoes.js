// notificacoes.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Seleciona todos os botões de exclusão
    const deleteButtons = document.querySelectorAll('.delete-btn');

    // 2. Adiciona um event listener para cada botão
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Encontra o item de notificação pai (o div inteiro)
            const notificationItem = event.target.closest('.notification-item');
            
            if (notificationItem) {
                // Remove o item da DOM
                notificationItem.remove();
                
                // OPCIONAL: Adicionar lógica de backend/API para exclusão permanente aqui
                console.log(`Notificação ID ${notificationItem.dataset.id} excluída.`);
            }
        });
    });
});