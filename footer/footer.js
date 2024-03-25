document.addEventListener('DOMContentLoaded', function() {
    fetch('./footer/footer.html') // Убедитесь, что путь указан правильно
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        });
});

