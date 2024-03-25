document.addEventListener('DOMContentLoaded', () => {
    const animalImagesDiv = document.getElementById('animal-images');
    const animals = ['img/bird_1.png', 'img/bird_2.png', 'img/bird_3.png', 'img/cat_1.png', 'img/cat_2.png', 'img/bug_1.png', 'img/bug_2.png'];

    // Категории для проверки
    const categories = {
        bird: document.getElementById('category1'),
        mammal: document.getElementById('category2'),
        insect: document.getElementById('category3')
    };

    animals.forEach((src, index) => {

        const img = document.createElement('img');
        img.src = src;
        img.id = `animal-${index + 1}`;
        animalImagesDiv.appendChild(img);

        img.currentRotation = Math.random() * 360; // Инициализация текущего угла вращения

        img.onload = function () {
            // Рассчитываем диагональ изображения
            const diagonal = Math.sqrt(img.offsetWidth * img.offsetWidth + img.offsetHeight * img.offsetHeight) / 2;

            // Получаем размеры и позицию контейнера main
            const mainRect = document.querySelector('main').getBoundingClientRect();
            const headerHeight = document.querySelector('header').offsetHeight;
            const footerHeight = document.querySelector('footer').offsetHeight;

            // Рассчитываем допустимые границы для размещения центра изображения
            const topLimit = mainRect.top + window.scrollY + headerHeight + diagonal;
            const bottomLimit = mainRect.bottom - footerHeight - diagonal + window.scrollY;
            const leftLimit = mainRect.left + window.scrollX + diagonal;
            const rightLimit = mainRect.right - diagonal + window.scrollX;

            // Размещаем изображения случайным образом в допустимых границах
            const randomTop = Math.random() * (bottomLimit - topLimit) + topLimit - img.offsetHeight / 2;
            const randomLeft = Math.random() * (rightLimit - leftLimit) + leftLimit - img.offsetWidth / 2;

            img.style.top = `${randomTop}px`;
            img.style.left = `${randomLeft}px`;
            img.style.transform = `rotate(${img.currentRotation}deg)`;
        };

        // Добавить функционал перетаскивания
        let posX = 0, posY = 0, posInitX = 0, posInitY = 0;


        img.onmousedown = function (e) {
            e.preventDefault();
            posInitX = e.clientX;
            posInitY = e.clientY;

            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;

            // Запуск вращения через 1 секунду
            img.rotationTimer = setTimeout(() => {
                img.rotatingInterval = setInterval(() => {
                    img.currentRotation = (img.currentRotation + 1) % 360;
                    img.style.transform = `rotate(${img.currentRotation}deg)`;
                }, 10);
            }, 1000);

        };

        img.onmouseup = function () {
            clearTimeout(img.rotationTimer);
            if (img.rotatingInterval) {
                clearInterval(img.rotatingInterval);
                img.rotatingInterval = null;
            }
        };


        function closeDragElement() {

            clearTimeout(img.rotationTimer);
            if (img.rotatingInterval) {
                clearInterval(img.rotatingInterval);
                img.rotatingInterval = null;
            }

            document.onmouseup = null;
            document.onmousemove = null;

            checkVictory();


        }
        function elementDrag(e) {
            e.preventDefault();

            posX = posInitX - e.clientX;
            posY = posInitY - e.clientY;
            posInitX = e.clientX;
            posInitY = e.clientY;

            let newTop = img.offsetTop - posY;
            let newLeft = img.offsetLeft - posX;

            img.style.top = newTop + "px";
            img.style.left = newLeft + "px";
                    
        }

    });


    function checkVictory() {
        // Группировка изображений по категориям
        const imagesByCategory = {
            bird: [],
            mammal: [],
            insect: []
        };
    
        document.querySelectorAll('#animal-images img').forEach(img => {
            if (img.src.includes('bird')) {
                imagesByCategory.bird.push(img);
            } else if (img.src.includes('cat')) {
                imagesByCategory.mammal.push(img);
            } else if (img.src.includes('bug')) {
                imagesByCategory.insect.push(img);
            }
        });
    
        // Функция для проверки пересечения изображений
        function isTouching(img1, img2) {
            const rect1 = img1.getBoundingClientRect();
            const rect2 = img2.getBoundingClientRect();
    
            return !(rect1.right < rect2.left || 
                     rect1.left > rect2.right || 
                     rect1.bottom < rect2.top || 
                     rect1.top > rect2.bottom);
        }
    
        let allCorrect = true;
    
        // Проверка, что все изображения в категории касаются друг друга
        Object.keys(imagesByCategory).forEach(category => {
            const images = imagesByCategory[category];
            for (let i = 0; i < images.length; i++) {
                for (let j = i + 1; j < images.length; j++) {
                    if (!isTouching(images[i], images[j])) {
                        allCorrect = false;
                    }
                }
            }
        });
    
        if (allCorrect) {
            // Логика анимации победы
            document.getElementById('victory-message').style.display = 'block';
        }
    }
    
    
});
