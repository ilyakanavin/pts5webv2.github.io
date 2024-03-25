document.addEventListener('DOMContentLoaded', function() {
    fetch('./header/header.html') // Убедитесь, что путь указан правильно
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
            initializeHeaderButtons();
        });
});

function initializeHeaderButtons() {

    const homeBtn = document.querySelector('.home');
    const backBtn = document.querySelector('.back');

    homeBtn.addEventListener('click', () => window.location.href = '/index.html') // Убедитесь, что URL корректен
    backBtn.addEventListener('click', () => window.history.back())

}
