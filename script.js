// Функция для получения случайного цвета в формате HEX
const getRandomColor = () => "#" + Math.floor(Math.random() * 0xffffff).toString(16);

// Функция для генерации массива случайных цветов
// Принимает количество цветов в массиве
const getArrayOfRandomColors = (count) => Array.from({ length: count }, getRandomColor);

const levelsOfDifficulty = {
  easy: {
    size: 3,
    count: 6,
    time: 80,
    colors: getArrayOfRandomColors(2),
  },
  medium: {
    size: 4,
    count: 8,
    time: 80,
    colors: getArrayOfRandomColors(3),
  },
  hard: {
    size: 5,
    count: 10,
    time: 80,
    colors: getArrayOfRandomColors(4),
  }
};

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
          this.trigger(true);
        } else {
          this.trigger(false);
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
    this.input.placeholder = "Введите ваше имя";

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
    <button type="submit" id="start">Начать игру</button>
  </form>
`;


class LocalStorage {
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
  <h1>Игра окончена</h1>
  <p>Your score is: <span id='game-score'></span></p>
</div>
`;

const ls = new LocalStorage();

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

class AppState {
  constructor() {
    this.state = {
      time: 180,
      score: 0,
      difficulty: "easy",
      stage: 0,
      leaderboard: [],
    };

    this.renderStart();
  }

  renderStart = () => {
    document.body.innerHTML = "";
    const body = document.getElementById("app");

    const body_ = document.createElement("div");

    body_.className = "start_container";
    body_.id = "start_container";
    body_.innerHTML = "";

    body.append(body_);

    const input = new Input();
    input.appendTo("start_container");

    const select = new ButtonSelector(Object.keys(levelsOfDifficulty));
    select.appendTo("start_container");
    const div = document.createElement("div");
    div.innerHTML = startHTML;
    body_.appendChild(div);

    const form = document.getElementById("start");
    form.onsubmit = (e) => {
      e.preventDefault();

      if (input.state && input.state.length > 0) {
        this.state.name = input.state ?? "ANONYMOUS USER";
        this.state.difficulty = select.state;
        this.state.size = levelsOfDifficulty[select.state].size;
        this.state.time = levelsOfDifficulty[select.state].time;

        this.cubeCount = levelsOfDifficulty[select.state].count;
        this.renderGame();
      } else {
        new Error(
          "Выберите сложность или введите имя игрока, данные не введены"
        );
      }
    };
  };

  changeCubeSizeAndAppendToScoreBoard = (cubeSize) => {
    const winningCube = this.game_.cubes[this.game_.gameWinningCubeIndex];
    const node = winningCube.cube.cloneNode(true);

    const scoreBoard = document.getElementById("score-board");

    node.style.width = `${this.previewSize}px`;
    node.style.height = `${this.previewSize}px`;
    node.style.rotate = "0deg";
    node.style.transform = "rotate(0deg)";

    const divs = node.getElementsByClassName("cube__item");

    for (let i = 0; i < divs.length; i++) {
      divs[i].style.width = `${this.previewSize / cubeSize}px`;
      divs[i].style.height = `${this.previewSize / cubeSize}px`;
    }

    const el = scoreBoard.getElementsByClassName("cube")[0];
    if (el) {
      scoreBoard.removeChild(el);
    }

    this.cube = node;
    scoreBoard.appendChild(node);
  };

  checkPreviewSize = () => {
    this.previewSize =
      document.getElementById("score-board").getBoundingClientRect().width - 50;
  };

  renderNickanme = () => {
    const scoreBoard = document.getElementById("score-board");
    const nickname = document.createElement("p");
    nickname.id = "nickname";
    nickname.style.textAlign = "center";
    nickname.innerHTML = "Player: " + this.state.name;
    scoreBoard.append(nickname);
  };

  renderEndGameButton = () => {
    const button = document.createElement("button");
    button.innerHTML = "End game";

    button.onclick = () => {
      this.state.leaderboard.push([this.state.name, this.state.score]);
      this.stopGame();
      this.renderEnd();
    };

    this.scoreBoard.append(button);
  };

  renderTimerAndScore = () => {
    const scoreBoard = document.getElementById("score-board");
    const timer = document.createElement("p");
    timer.id = "timer";
    timer.style.textAlign = "center";
    timer.innerHTML = "Оставшееся время: " + this.state.time;
    scoreBoard.append(timer);

    const score = document.createElement("p");
    score.id = "score";
    score.style.textAlign = "center";
    score.innerHTML = "Score: " + this.state.score;

    scoreBoard.append(score);
  };

  stopGame = () => {
    this.timer.listeners = [];
    this.timer = null;
    this.score = 0;
  };

  renderResetButton = (id = "score-board", title = "Reset game") => {
    const button = document.createElement("button");
    button.innerHTML = title;

    button.onclick = () => {
      if (this.game_ && this.timer) {
        delete this.game_;
        this.stopGame();
      }
      this.renderStart();
    };
    const element = document.getElementById(id ?? "score-board");
    element.append(button);
  };

  SCOREBOARD = (cubeSize) => {
    const scoreBoard = document.getElementById("score-board");
    scoreBoard.innerHTML = "";

    this.checkPreviewSize();
    this.changeCubeSizeAndAppendToScoreBoard(cubeSize);
    this.renderNickanme();
    this.renderTimerAndScore();
    this.renderResetButton();
    this.renderEndGameButton();

    window.onresize = () => {
      this.checkPreviewSize();
      this.cube.style.width = this.previewSize + "px";
      this.cube.style.height = this.previewSize + "px";
    };
  };

  trigger = (okay) => {
    if (okay) {
      this.state.score += 1;
      this.game_ = new Game(
        this.cubeCount,
        this.cubeSize,
        this.trigger,
        this.rotate
      );
      this.SCOREBOARD(this.cubeSize);
    } else {
      this.timer.setState(this.timer.state - 10);
    }
  };

  UPDATE_TIMER = (state) => {
    this.state.time = state.getState();
    const time = document.getElementById("timer");
    time.innerHTML = "Оставшееся время: " + this.state.time;

    if (this.state.time <= 0) {
      this.state.leaderboard.push([this.state.name, this.state.score]);
      this.stopGame();
      this.renderEnd();
    }
  };

  renderGame = () => {
    document.body.innerHTML = "";
    const game = document.createElement("div");
    game.id = "game";
    document.body.appendChild(game);
  
    this.board = document.createElement("div");
    this.board.id = "game-board";
    this.scoreBoard = document.createElement("div");
    this.scoreBoard.id = "score-board";
    this.cubeSize = this.state.size;
  
    const timer = document.createElement("p");
    timer.id = "timer";
    timer.style.textAlign = "center";
  
    // Переместите timer перед добавлением game-board и score-board
    document.getElementById("game").appendChild(timer);
    document.getElementById("game").appendChild(this.scoreBoard);
    document.getElementById("game").appendChild(this.board);
  
    const rotate = this.cubeCount > 10 ? true : false;
    this.rotate = rotate;
    this.game_ = new Game(this.cubeCount, this.cubeSize, this.trigger, rotate);
    this.SCOREBOARD(this.cubeSize);
  
    if (!this.timer) {
      this.timer = new Timer(this.state.time, this.UPDATE_TIMER);
    }
  };
  

  renderEnd = () => {
    document.body.innerHTML = endHTML;

    const gameEnd = document.getElementById("end");
    const gameScoreId = "game-score";
    const score = document.getElementById(gameScoreId);
    score.innerHTML = this.state.score;

    const leaderboard_ = document.createElement("div");
    leaderboard_.id = "leaderboard";
    gameEnd.appendChild(leaderboard_);

    const h1 = document.createElement("h1");
    h1.innerHTML = "Leaderboard";
    leaderboard_.appendChild(h1);

    ls.add([this.state.name, this.state.score]);
    ls.set(ls.leaderboard);

    const board = document.createElement("div");
    board.id = "res-board";
    leaderboard_.appendChild(board);

    let p = document.createElement("p");
    p.innerHTML = `<div class="line" style="border-bottom: 1px solid black;"> 
      <p>name</p>
      <p>score</p>
    </div>`;
    board.appendChild(p);

    for (let l of ls.leaderboard) {
      let p = document.createElement("p");
      p.innerHTML = `<div class="line"> 
        <p>${l[0]}</p>
        <p>${l[1]}</p>
      </div>`;
      board.appendChild(p);
    }

    this.renderResetButton("Таблица лидеров", "Вернуться в главное меню");
  };
}

const appState = new AppState();

