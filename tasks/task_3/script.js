document.addEventListener('DOMContentLoaded', function() {
    var flexContainer = document.querySelector('.flexbox-container');
    console.log(flexContainer)

    var boyImageRight = flexContainer.querySelector('.boy-right'); // предполагаем, что есть такой класс
    boyImageRight.style.display = 'none';

    var boyImageLeft = flexContainer.querySelector('.boy-left'); // предполагаем, что есть такой класс
    boyImageLeft.style.display = 'none';

    var stick = flexContainer.querySelector('.stick');
    stick.style.display = 'none';

    var spinner = flexContainer.querySelector('.spinner');
    spinner.style.display = 'none';

    // Устанавливаем начальное положение для изображений
    boyImageRight.style.left = '0px';
    boyImageLeft.style.left = '0px';
    

    let moving = false;
    let direction = 'right';

    let activeImage = boyImageRight;

    // При наведении мыши показываем изображение мальчика
    flexContainer.addEventListener('mouseenter', function() {
        
        flexContainer.classList.remove('sepia-effect'); // Удаляем эффект сепии
        activeImage.style.display = 'block';
        moving = true;
        moveBoy();
        
    });
    
    flexContainer.addEventListener('mouseleave', function() {
        moving = false;
        stick.style.display = 'none';
        spinner.style.display = 'none';
        spinner.classList.remove('spinner-spinning'); // Удаляем класс для остановки вращения
        flexContainer.classList.remove('sepia-effect'); // Удаляем эффект сепии
        flexContainer.classList.add('sepia-effect'); // Добавляем эффект сепии
    });

    // При нажатии показываем палочку и спиннер и начинаем анимацию
    flexContainer.addEventListener('mousedown', function() {
        stick.style.display = 'block';
        spinner.style.display = 'block';
        spinner.classList.add('spinner-spinning'); // Добавляем класс для вращения
    });

    // При отпускании кнопки мыши останавливаем анимацию и скрываем палочку и спиннер
    flexContainer.addEventListener('mouseup', function() {
        stick.style.display = 'none';
        spinner.style.display = 'none';
        spinner.classList.remove('spinner-spinning'); // Удаляем класс для остановки вращения
    });

    function moveBoy() {
        if (moving) {
            let currentLeft = parseInt(activeImage.style.left) || 0;
            let containerWidth = flexContainer.offsetWidth;
            let imageWidth = activeImage.offsetWidth;

            let residualDistance = direction === 'right' ? containerWidth - currentLeft - imageWidth : currentLeft;
            let speed = Math.max(residualDistance / 50, 1); // Регулировка замедления

            if (direction === 'right') {
                if (currentLeft + imageWidth < containerWidth) {
                    activeImage.style.left = (currentLeft + speed) + 'px';
                    stick.style.left = (parseInt(activeImage.style.left) + 62) + 'px';
                    spinner.style.left = (parseInt(stick.style.left) - 6) + 'px'; // Смещение для spinner
                    stick.style.transform = 'scaleX(1)';
                } else {
                    boyImageRight.style.display = 'none'; // Скрываем правый образ мальчика
                    boyImageLeft.style.display = 'block'; // Показываем левый образ мальчика
                    activeImage = boyImageLeft;
                    direction = 'left';
                    activeImage.style.left = (containerWidth - imageWidth) + 'px';
                }
            } else if (direction === 'left') {
                if (currentLeft > 0) {
                    activeImage.style.left = (currentLeft - speed) + 'px';
                    stick.style.left = (parseInt(activeImage.style.left) + 7) + 'px';
                    spinner.style.left = (parseInt(stick.style.left) + 6) + 'px'; // Смещение для spinner
                    stick.style.transform = 'scaleX(-1)';
                } else {
                    boyImageLeft.style.display = 'none'; // Скрываем левый образ мальчика
                    boyImageRight.style.display = 'block'; // Показываем правый образ мальчика
                    activeImage = boyImageRight;
                    direction = 'right';
                    activeImage.style.left = '0px';
                }
            }

            requestAnimationFrame(moveBoy);
        }
    }

});