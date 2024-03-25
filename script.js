// Функция для получения случайного цвета в формате HEX
const getRandomColor = () => "#" + Math.floor(Math.random() * 0xffffff).toString(16);

// Функция для генерации массива случайных цветов
// Принимает количество цветов в массиве
const generateColors = (count) => Array.from({ length: count }, getRandomColor);

const difficulty = {
  easy: {
    size: 3,
    count: 6,
    time: 80,
    colors: generateColors(2),
  },
  medium: {
    size: 6,
    count: 12,
    time: 120,
    colors: generateColors(4),
  },
  hard: {
    size: 9,
    count: 16,
    time: 180,
    colors: generateColors(8),
  }
};

class SoundEffect {
  constructor() {
    // Проверка существования экземпляра класса
    if (SoundEffect.instance) {
      return SoundEffect.instance;
    }
    // Установка текущего экземпляра как экземпляра класса
    SoundEffect.instance = this;

    // Инициализация аудиофайлов
    this.wrong_ = new Audio("./sounds/wrong.mp3");
    this.cool_ = new Audio("./sounds/cool.mp3");
  }

  // Метод для воспроизведения звука "ошибки" с заданной громкостью
  wrong = () => {
    this.wrong_.volume = 0.5;
    this.wrong_.play();
  };

  // Метод для воспроизведения "приятного" звука с заданной громкостью
  cool = () => {
    this.cool_.volume = 0.5;
    this.cool_.play();
  };
}

new SoundEffect();

class Cube {
  constructor(index, size, chooseCubeCallback, rotate = 0) {
    this.index = index; // Индекс куба
    this.size = size; // Размер куба

    // Создание элемента куба
    this.cube = document.createElement("div");
    this.cube.classList.add("cube");
    this.cube.style.transform = `rotate${rotate}`;

    // Обработчик правого клика (контекстного меню) для вращения куба
    this.cube.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const rotateValue = parseInt(this.cube.style.transform.slice(7, -4) || 0); // Получаем текущий угол вращения
      this.cube.style.transform = `rotate(${rotateValue + 20}deg)`; // Вращаем на 20 градусов
    });

    // Добавление контента в куб
    const content = document.createElement("div");
    content.classList.add("cube__content");
    this.cube.appendChild(content);

    // Заполнение куба элементами
    for (let i = 0; i < size; i++) {
      const row = document.createElement("div");
      row.classList.add("cube__row");
      for (let j = 0; j < size; j++) {
        const div = document.createElement("div");
        div.classList.add("cube__item");
        const color = Math.floor(Math.random() * 16777215).toString(16);
        div.style.backgroundColor = `#${color === "ffffff" ? "000000" : color}`;
        row.appendChild(div);
      }
      content.appendChild(row);
    }

    this.cube.style.top = `${index / size}%`; // Позиционирование куба

    // Обработчик клика
    this.cube.addEventListener("click", chooseCubeCallback);
  }

  // Метод для добавления куба в DOM
  appendToNode = (node) => node.appendChild(this.cube);

  // Метод для установки предварительного размера куба и его элементов
  previewSize = () => {
    this.cube.style.width = "100px";
    this.cube.style.height = "100px";
    const divs = this.cube.getElementsByClassName("cube__item");
    [...divs].forEach(div => {
      div.style.width = `${100 / this.size}px`;
      div.style.height = `${100 / this.size}px`;
    });
  };

}
const style = 0;

class Game {
  constructor(cubeCount, cubeSize, trigger, rotate = false) {
    this.cubeCount = cubeCount; // Количество кубов
    this.cubeSize = cubeSize; // Размер кубов
    this.cubes = []; // Массив для хранения кубов

    this.trigger = trigger; // Функция обратного вызова
    this.board = document.getElementById("game-board"); // Игровое поле
    this.rotate = rotate; // Флаг вращения
    this.reset(); // Очистка игрового поля
    this.initializeBoard(); // Инициализация игрового поля

    // Индекс выигрышного куба выбирается случайно
    this.gameWinningCubeIndex = Math.floor(Math.random() * cubeCount);
  }

  initializeBoard = () => {
    const chooseCubeCallback = (idx) => {
      return () => {
        // Проверка, является ли куб выигрышным
        if (idx === this.gameWinningCubeIndex) {
          new SoundEffect().cool(); // Воспроизведение звука для правильного выбора
          this.trigger(true);
        } else {
          this.trigger(false);
          new SoundEffect().wrong(); // Воспроизведение звука для неправильного выбора
          this.cubes[idx].cube.classList.add("wrong");

          // Удаление класса "wrong" через 1 секунду
          setTimeout(() => {
            this.cubes[idx].cube.classList.remove("wrong");
          }, 1000);
        }
      };
    };

    // Создание и добавление кубов на игровое поле
    for (let i = 0; i < this.cubeCount; i++) {
      const rotateDeg = this.rotate ? `(${Math.floor(Math.random() * 90)}deg)` : "(0deg)";
      const cube = new Cube(i, this.cubeSize, chooseCubeCallback(i), rotateDeg);

      if (this.cubeCount >= 50) {
        cube.cube.style.width = "8%";
        cube.cube.style.padding = "0";
        cube.cube.style.paddingBottom = "8%";
      }

      this.cubes.push(cube);
    }

    this.cubes.forEach(cube => cube.appendToNode(this.board));
  };

  reset = () => {
    this.board.innerHTML = ""; // Очистка игрового поля
  };
}

class ButtonSelector {
  constructor(texts, styles = {}) {
    this.btns = []; // Массив для хранения кнопок
    this.state = null; // Текущее состояние (выбранная кнопка)
    this.appender = document.createElement("div");
    this.appender.className = "button-selector";

    // Создание кнопок на основе предоставленных текстов и стилей
    texts.forEach((t, i) => {
      const btn = document.createElement("button");
      btn.innerHTML = t;
      btn.style = styles[t]; // Применение стилей к кнопке
      btn.className = "picker";
      btn.value = t;

      this.appender.appendChild(btn);
      this.btns.push(btn);
    });

    // Добавление обработчика клика для каждой кнопки
    this.btns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.state = e.target.value;
        this.btns.forEach(btn => btn.classList.remove("active"));
        e.target.classList.add("active");
      });
    });
  }

  appendTo = (nodeId) => {
    document.getElementById(nodeId).appendChild(this.appender);
  };
}

class Input {
  constructor() {
    // Создание элемента input и настройка его свойств
    this.input = document.createElement("input");
    this.input.className = "input";
    this.input.type = "text";
    this.input.placeholder = "Enter your name";

    // Слушатель изменений значения input
    this.input.addEventListener("change", (e) => {
      this.state = e.target.value; // Обновление состояния при изменении input
    });
  }

  // Метод для добавления input в DOM
  appendTo = (nodeId) => document.getElementById(nodeId).appendChild(this.input);
}


class State {
  constructor() {
    this.listeners = []; // Список слушателей состояния
  }

  // Установка нового состояния и оповещение слушателей
  setState = (state) => {
    this.state = state;
    this.notify();
  };

  // Получение текущего состояния
  getState = () => this.state;

  // Добавление слушателей. Поддержка добавления как одного слушателя, так и массива слушателей
  addListener = (listener) => {
    if (Array.isArray(listener)) {
      this.listeners.push(...listener);
    } else {
      this.listeners.push(listener);
    }
  };

  // Оповещение всех слушателей о изменении состояния
  notify = () => this.listeners.forEach(listener => listener(this));
}


class Timer extends State {
  constructor(time = 180, listeners = []) {
    super(); // Вызов конструктора базового класса

    this.interval = null; // Идентификатор интервала
    this.addListener(listeners); // Добавление переданных слушателей
    this.setState(time); // Инициализация таймера с начальным временем

    // Установка интервала уменьшения времени таймера каждую секунду
    this.interval = setInterval(() => {
      this.setState(this.state - 1);
      if (this.state <= 0) {
        clearInterval(this.interval); // Очистка интервала при достижении 0
      }
    }, 1000);
  }
}

// HTML-разметка для стартовой формы
const startHTML = `
  <form id="start">
    <button type="submit" id="start">Start</button>
  </form>
`;


class LocalSTORAGE {
  constructor() {
    // Попытка извлечь таблицу лидеров из localStorage или инициализация пустым массивом
    this.leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

    // Сохранение начального состояния таблицы лидеров, если она была пустой
    if (!this.leaderboard.length) {
      localStorage.setItem("leaderboard", JSON.stringify(this.leaderboard));
    }
  }

  sortAndTrim = () => {
    // Сортировка по убыванию счета и фильтрация невалидных записей
    this.leaderboard.sort((a, b) => b[1] - a[1]);
    this.leaderboard = this.leaderboard.filter((l) => l[0] !== "" && l[0]);

    // Обрезка до первых 10 записей
    this.leaderboard = this.leaderboard.slice(0, 10);

    // Сохранение обновленной таблицы лидеров в localStorage
    localStorage.setItem("leaderboard", JSON.stringify(this.leaderboard));
  };

  add = (res) => {
    // Поиск существующей записи с таким же именем
    const existingIndex = this.leaderboard.findIndex((l) => l[0] === res[0]);

    if (existingIndex > -1) {
      // Если счет новой записи больше, обновляем запись
      if (this.leaderboard[existingIndex][1] < res[1]) {
        this.leaderboard[existingIndex] = res;
        this.sortAndTrim();
      }
      // В противном случае (счет меньше или равен), ничего не делаем
    } else {
      // Если такой записи нет, просто добавляем новую запись
      this.leaderboard.push(res);
      this.sortAndTrim();
    }
  };

  set = (board) => {
    this.leaderboard = board;
    this.sortAndTrim();
  };
}

const endHTML = `
<div id="end">
  <h1>Game over</h1>
  <p>Your score is: <span id='game-score'></span></p>
</div>
`;

const ls = new LocalSTORAGE();

class Error {
  constructor(message) {
    const body = document.getElementById("app");

    const error = document.createElement("p");
    error.innerHTML = message;
    error.className = "error";

    body.appendChild(error);

    setTimeout(() => {
      body.removeChild(error);
    }, 2000);
  }
}

// Определение класса AppState, управляющего основным состоянием игры.
class AppState {
  // Конструктор класса, инициализирующий начальное состояние игры.
  constructor() {
    // Инициализация начального состояния приложения.
    this.state = {
      time: 180, // Время на игру в секундах.
      score: 0, // Начальный счет.
      difficulty: "easy", // Уровень сложности по умолчанию.
      stage: 0, // Текущий этап игры.
      leaderboard: [], // Таблица лидеров.
    };

    // Вызов функции для рендеринга стартового экрана.
    this.renderStart();
  }

  renderStart = () => {
    document.body.innerHTML = ""; // Очистка содержимого тела документа.
    const body = document.getElementById("app"); // Получение элемента, в который будет рендериться игра.
  
    const body_ = document.createElement("div"); // Создание нового div-элемента для стартового экрана.
    body_.className = "start_container";
    body_.id = "start_container";
    body_.innerHTML = "";
    body.append(body_); // Добавление контейнера в DOM.
  
    // Создание div для дополнительного контента и добавление его перед элементами управления.
    const div = document.createElement("div");
    div.innerHTML = startHTML; // Настройка HTML содержимого.
    body_.appendChild(div); // Добавление div в контейнер стартового экрана.
  
    // Создание и добавление элементов управления на стартовый экран.
    const input = new Input();
    input.appendTo("start_container"); // Добавление поля ввода для имени игрока.
  
    const select = new ButtonSelector(Object.keys(difficulty)); // Создание селектора сложности.
    select.appendTo("start_container"); // Добавление селектора на экран.
  
    // Обработчик события отправки формы.
    const form = document.getElementById("start");
    form.onsubmit = (e) => {
      e.preventDefault(); // Предотвращение стандартного действия формы.
  
      // Проверка введенных данных и установка состояния приложения.
      if (input.state && input.state.length > 0) {
        this.state.name = input.state ?? "ANONYMOUS USER"; // Установка имени игрока.
        this.state.difficulty = select.state; // Установка выбранной сложности.
        // Настройка параметров игры в соответствии с выбранной сложностью.
        this.state.size = difficulty[select.state].size;
        this.state.time = difficulty[select.state].time;
  
        this.cubeCount = difficulty[select.state].count; // Количество кубов.
        this.renderGame(); // Переход к рендерингу игры.
      } else {
        // Вывод ошибки, если данные не введены.
        new Error("Выберите сложность или введите имя игрока, данные не введены");
      }
    };
  };
  

  // Функция для изменения размера куба и добавления его на доску счета.
  changeCubeSizeAndAppendToScoreBoard = (cubeSize) => {
    const winningCube = this.game_.cubes[this.game_.gameWinningCubeIndex]; // Получение выигрышного куба.
    const node = winningCube.cube.cloneNode(true); // Клонирование куба.

    const scoreBoard = document.getElementById("score-board"); // Получение доски счета.

    // Настройка стилей куба для отображения в доске счета.
    node.style.width = `${this.previewSize}px`;
    node.style.height = `${this.previewSize}px`;
    node.style.rotate = "0deg";
    node.style.transform = "rotate(0deg)";

    // Изменение размеров элементов куба.
    const divs = node.getElementsByClassName("cube__item");
    for (let i = 0; i < divs.length; i++) {
      divs[i].style.width = `${this.previewSize / cubeSize}px`;
      divs[i].style.height = `${this.previewSize / cubeSize}px`;
    }

    // Удаление предыдущего куба с доски счета, если он есть.
    const el = scoreBoard.getElementsByClassName("cube")[0];
    if (el) {
      scoreBoard.removeChild(el);
    }

    // Добавление нового куба на доску счета.
    this.cube = node;
    scoreBoard.appendChild(node);
  };

  // Функция для проверки размера предварительного просмотра.
  checkPreviewSize = () => {
    // Вычисление размера предварительного просмотра на основе ширины доски счета.
    this.previewSize =
      document.getElementById("score-board").getBoundingClientRect().width - 50;
  };

  // Функция для рендеринга никнейма игрока на доске счета.
  renderNickanme = () => {
    const scoreBoard = document.getElementById("score-board"); // Получение доски счета.
    const nickname = document.createElement("p"); // Создание элемента для никнейма.
    nickname.id = "nickname";
    nickname.style.textAlign = "center";
    nickname.innerHTML = "Player: " + this.state.name; // Установка текста никнейма.
    scoreBoard.append(nickname); // Добавление никнейма на доску счета.
  };

  // Функция для рендеринга кнопки окончания игры.
  renderEndGameButton = () => {
    const button = document.createElement("button"); // Создание кнопки.
    button.innerHTML = "End game"; // Установка текста кнопки.

    // Обработчик нажатия на кнопку для завершения игры.
    button.onclick = () => {
      this.state.leaderboard.push([this.state.name, this.state.score]); // Добавление результата игры в таблицу лидеров.
      this.stopGame(); // Остановка игры.
      this.renderEnd(); // Переход к рендерингу окончания игры.
    };
    this.scoreBoard.append(button); // Добавление кнопки на доску счета.
  };

  // Функция для рендеринга таймера и счета на доске счета.
  renderTimerAndScore = () => {

    const scoreBoard = document.getElementById("score-board"); // Получение доски счета.

    // Создание и настройка элемента таймера.
    const timer = document.createElement("p");
    timer.id = "timer";
    timer.style.textAlign = "center";
    timer.innerHTML = "Оставшееся время: " + this.state.time;
    scoreBoard.append(timer); // Добавление таймера на доску счета.

    // Создание и настройка элемента для отображения счета.
    const score = document.createElement("p");
    score.id = "score";
    score.style.textAlign = "center";
    score.innerHTML = "Score: " + this.state.score;
    scoreBoard.append(score); // Добавление счета на доску счета.

  };

  // Функция для остановки игры.
  stopGame = () => {
    this.timer.listeners = []; // Очистка слушателей таймера.
    this.timer = null; // Удаление таймера.
    this.score = 0; // Сброс счета.
  };

  // Функция для рендеринга кнопки сброса игры.
  renderResetButton = (id = "score-board", title = "Reset game") => {
    const button = document.createElement("button"); // Создание кнопки сброса.
    button.innerHTML = title; // Установка текста кнопки.

    // Обработчик нажатия на кнопку сброса.
    button.onclick = () => {
      if (this.game_ && this.timer) {
        delete this.game_; // Удаление текущей игры.
        this.stopGame(); // Остановка игры.
      }
      this.renderStart(); // Возвращение к стартовому экрану.
    };
    const element = document.getElementById(id ?? "score-board"); // Получение элемента для добавления кнопки.
    element.append(button); // Добавление кнопки в элемент.

  };

  // Основная функция для отображения игрового интерфейса и управления игровым процессом.
  SCOREBOARD = (cubeSize) => {
    const scoreBoard = document.getElementById("score-board"); // Получение доски счета.
    scoreBoard.innerHTML = ""; // Очистка доски счета.

    this.checkPreviewSize(); // Проверка и обновление размера предварительного просмотра.
    this.changeCubeSizeAndAppendToScoreBoard(cubeSize); // Изменение размера куба и добавление его на доску счета.
    this.renderNickanme(); // Рендеринг никнейма игрока.
    this.renderTimerAndScore(); // Рендеринг таймера и счета.
    this.renderResetButton(); // Добавление кнопки сброса игры.
    this.renderEndGameButton(); // Добавление кнопки завершения игры.

    // Обработчик изменения размера окна, для корректировки размера предварительного просмотра.
    window.onresize = () => {
      this.checkPreviewSize(); // Повторная проверка размера предварительного просмотра.
      // Обновление стилей куба в соответствии с новым размером.
      this.cube.style.width = this.previewSize + "px";
      this.cube.style.height = this.previewSize + "px";
    };

  };

  // Функция-триггер, вызываемая при успешном или неуспешном завершении действия в игре.
  trigger = (okay) => {
    if (okay) {
      this.state.score += 1; // Увеличение счета при успешном действии.
      // Создание новой игры с обновленными параметрами.
      this.game_ = new Game(
        this.cubeCount,
        this.cubeSize,
        this.trigger,
        this.rotate
      );
      this.SCOREBOARD(this.cubeSize); // Обновление игрового интерфейса.
    } else {
      // Наказание за неуспешное действие, например, уменьшение времени.
      this.timer.setState(this.timer.state - 10);
    }
  };

  // Функция для обновления таймера и проверки условий окончания игры.
  UPDATE_TIMER = (state) => {
    this.state.time = state.getState(); // Обновление времени игры.
    const time = document.getElementById("timer"); // Получение элемента таймера.
    time.innerHTML = "Оставшееся время: " + this.state.time; // Обновление отображаемого времени.

    if (this.state.time <= 0) {
      // Действия при окончании времени: сохранение результата и переход к экрану завершения игры.
      this.state.leaderboard.push([this.state.name, this.state.score]);
      this.stopGame();
      this.renderEnd();
    }

  };

  // Функция для рендеринга основного игрового экрана.
  renderGame = () => {
    document.body.innerHTML = ""; // Очистка содержимого тела документа.
    const game = document.createElement("div"); // Создание контейнера для игры.
    game.id = "game"; // Установка идентификатора для контейнера.
    document.body.appendChild(game); // Добавление контейнера в документ.
  
    // Создание и настройка доски игры и доски счета.
    this.board = document.createElement("div");
    this.board.id = "game-board";
    this.scoreBoard = document.createElement("div");
    this.scoreBoard.id = "score-board";
    this.cubeSize = this.state.size; // Установка размера куба в соответствии с выбранной сложностью.
  
    // Создание и настройка таймера.
    const timer = document.createElement("p");
    timer.id = "timer";
    timer.style.textAlign = "center";
    game.appendChild(timer); // Добавление таймера в контейнер игры в самом начале.
  
    // Добавление доски счета в DOM перед доской игры.
    game.appendChild(this.scoreBoard);
  
    // Добавление доски игры в DOM.
    game.appendChild(this.board);
  
    // Определение необходимости вращения кубов в зависимости от количества кубов.
    const rotate = this.cubeCount > 10 ? true : false;
    this.rotate = rotate;
  
    // Инициализация новой игры с текущими параметрами состояния.
    this.game_ = new Game(this.cubeCount, this.cubeSize, this.trigger, rotate);
    // Рендеринг игрового интерфейса с обновленными данными.
    this.SCOREBOARD(this.cubeSize);
  
    // Если таймер не был ранее запущен, создаем и запускаем его.
    if (!this.timer) {
      this.timer = new Timer(this.state.time, this.UPDATE_TIMER);
    }
  };
  

  // Функция для рендеринга экрана окончания игры.
  renderEnd = () => {
    document.body.innerHTML = endHTML; // Установка HTML содержимого для экрана окончания игры.

    const gameEnd = document.getElementById("end"); // Получение контейнера для экрана окончания игры.
    const gameScoreId = "game-score";
    const score = document.getElementById(gameScoreId); // Получение элемента для отображения итогового счета.
    score.innerHTML = this.state.score; // Вывод итогового счета.

    const leaderboard_ = document.createElement("div");
    leaderboard_.id = "leaderboard";
    gameEnd.appendChild(leaderboard_); // Добавление раздела для таблицы лидеров.

    const h1 = document.createElement("h1");
    h1.innerHTML = "Leaderboard"; // Заголовок для таблицы лидеров.
    leaderboard_.appendChild(h1);

    // Добавление результатов текущей игры в хранилище и обновление таблицы лидеров.
    ls.add([this.state.name, this.state.score]);
    ls.set(ls.leaderboard);

    const board = document.createElement("div");
    board.id = "res-board"; // Контейнер для отображения результатов игры.
    leaderboard_.appendChild(board);

    // Формирование шапки таблицы лидеров.
    let p = document.createElement("p");
    p.innerHTML = `<div class="line" style="border-bottom: 1px solid black;"> 
  <p>name</p>
  <p>score</p>
</div>`;
    board.appendChild(p);

    // Добавление записей о каждом участнике в таблицу лидеров.
    for (let l of ls.leaderboard) {
      let p = document.createElement("p");
      p.innerHTML = `<div class="line"> 
    <p>${l[0]}</p>
    <p>${l[1]}</p>
  </div>`;
      board.appendChild(p);
    }

    // Добавление кнопки для возврата к главному меню.
    this.renderResetButton();

  };
}

// Создание экземпляра класса AppState для запуска приложения.
const appState = new AppState();
