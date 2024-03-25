const phrases = [
    ["Consuetudo est altera natura", "Привычка - вторая натура"],
    ["Nota bene", "Заметьте хорошо!"],
    ["Nulla calamitas sola", "Беда не приходит одна"],
    ["Per aspera ad astra", "Через тернии к звёздам"],
    ["Alea iacta est", "Жребий брошен"],
    ["Amor vincit omnia", "Любовь побеждает все"],
    ["Carpe diem", "Лови момент"],
    ["Cave canem", "Остерегайся собаки"],
    ["Cogito ergo sum", "Я мыслю, следовательно, существую"],
    ["Divide et impera", "Разделяй и властвуй"],
    ["Dulce et decorum est pro patria mori", "Сладко и почётно умереть за отечество"],
    ["Errare humanum est", "Человеку свойственно ошибаться"],
    ["Et tu, Brute?", "И ты, Брут?"],
    ["Ex nihilo nihil fit", "Из ничего ничего не происходит"],
    ["Festina lente", "Спеши медленно"],
    ["Homo homini lupus est", "Человек человеку волк"],
    ["In vino veritas", "В вине истина"],
    ["Labor omnia vincit", "Труд побеждает все"],
    ["Memento mori", "Помни о смерти"],
    ["Non scholae, sed vitae discimus", "Мы учимся не для школы, а для жизни"],
    ["Panem et circenses", "Хлеба и зрелищ"],
    ["Quod erat demonstrandum", "Что и требовалось доказать"],
    ["Sic transit gloria mundi", "Так проходит мирская слава"],
    ["Tempus fugit", "Время бежит"],
    ["Veni, vidi, vici", "Пришёл, увидел, победил"],
    ["Veritas vincit", "Истина побеждает"],
    ["Vox populi, vox Dei", "Голос народа, голос Божий"]
];


let usedPhrases = [];
let clickCount = 0;

function displayPhrase() {
    if (phrases.length === 0) {
        alert("Фразы закончились");
        return;
    }

    let phraseIndex = Math.floor(Math.random() * phrases.length);
    let selectedPhrase = phrases.splice(phraseIndex, 1)[0];
    usedPhrases.push(selectedPhrase);

    let phraseContainer = document.getElementById('phrase-container');
    phraseContainer.textContent = `${selectedPhrase[0]} - ${selectedPhrase[1]}`;
    phraseContainer.className = clickCount % 2 === 0 ? 'class1' : 'class2';

    clickCount++;
}

function changeStyle() {
    let listElements = document.querySelectorAll('#phrase-list .class2');
    listElements.forEach(el => el.classList.toggle('bold'));
}

function createList() {
    let phraseList = document.getElementById('phrase-list');
    phraseList.innerHTML = '';

    usedPhrases.forEach((phrase, index) => {
        let li = document.createElement('li');
        li.textContent = phrase[0];
        li.className = index % 2 === 0 ? 'class1' : 'class2';

        let subList = document.createElement('ul');
        let subLi = document.createElement('li');
        subLi.textContent = phrase[1];
        subList.appendChild(subLi);
        li.appendChild(subList);

        phraseList.appendChild(li);
    });
}

document.getElementById('next-phrase').addEventListener('click', displayPhrase);
document.getElementById('change-style').addEventListener('click', changeStyle);
document.getElementById('create-list').addEventListener('click', createList);
