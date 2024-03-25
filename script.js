const getRandomColor = () => {
  return "#" + Math.floor(Math.random() * 16777211).toString(16);
};

const difficulty = {
  easy: {
    size: 3,
    count: 6,
    time: 80,
    colors: [getRandomColor(), getRandomColor()],
  },
  medium: {
    size: 6,
    count: 12,
    time: 120,
    colors: [
      getRandomColor(),
      getRandomColor(),
      getRandomColor(),
      getRandomColor(),
    ],
  },
  hard: {
    size: 9,
    count: 16,
    time: 180,
    colors: [
      getRandomColor(),
      getRandomColor(),
      getRandomColor(),
      getRandomColor(),
      getRandomColor(),
      getRandomColor(),
      getRandomColor(),
      getRandomColor(),
    ],
  },
  impossible: {
    size: 22,
    count: 25,
    time: 200,
  },
};

class SoundEffect {
  constructor() {
    if (SoundEffect.instance) {
      return SoundEffect.instance;
    } else {
      SoundEffect.instance = this;
      this.wrong_ = new Audio("./sounds/wrong.mp3");

      this.cool_ = new Audio("./sounds/cool.mp3");
    }
  }

  wrong = () => {
    this.wrong_.volume = 0.5;
    this.wrong_.play();
  };

  cool = () => {
    this.cool_.volume = 0.5;
    this.cool_.play();
  };
}
new SoundEffect();

class Cube {
  constructor(index, size, chooseCubeCallback, rotate = 0) {
    this.index = index;
    this.size = size;

    this.cube = document.createElement("div");
    this.cube.classList.add("cube");
    this.cube.style.transform = `rotate${rotate}`;

    this.cube.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const rotate = this.cube.style.transform;
      const rotate_ = rotate.split("(")[1].split(")")[0];
      const rotate__ = parseInt(rotate_);
      this.cube.style.transform = `rotate(${rotate__ + 20}deg)`;
    });

    const content = document.createElement("div");
    content.classList.add("cube__content");
    this.cube.appendChild(content);
    for (let i = 0; i < size; i++) {
      const row = document.createElement("div");
      row.classList.add("cube__row");

      for (let j = 0; j < size; j++) {
        const div = document.createElement("div");
        div.classList.add("cube__item");
        div.style.backgroundColor =
          "#" + Math.floor(Math.random() * 16777215).toString(16);
        const color = Math.floor(Math.random() * 16777215).toString(16);
        div.style.backgroundColor =
          color === "ffffff" ? "#000000" : "#" + color;
        row.appendChild(div);
      }

      this.cube.style.top = index / size + "%";
      content.appendChild(row);
    }

    this.cube.addEventListener("click", chooseCubeCallback);
    this.dragElement(this.cube);
  }

  appendToNode = (node) => node.appendChild(this.cube);

  previewSize = () => {
    this.cube.style.width = "100px";
    this.cube.style.height = "100px";
    const divs = this.cube.getElementsByClassName("cube__item");
    for (let i = 0; i < divs.length; i++) {
      divs[i].style.width = `${100 / this.size}px`;
      divs[i].style.height = `${100 / this.size}px`;
    }
  };

  dragElement = (elmnt) => {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    elmnt.addEventListener("mousedown", dragMouseDown);
    function dragMouseDown(e) {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    const elementDrag = (e) => {
      e = e;
      e.preventDefault();
      elmnt.style.position = "absolute";

      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      // calculate new position
      var newTop = elmnt.offsetTop - pos2;
      var newLeft = elmnt.offsetLeft - pos1;

      elmnt.style.top = newTop + "px";
      elmnt.style.left = newLeft + "px";
    };
    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  };
}
const style = 0;

class Game {
  constructor(cubeCount, cubeSize, trigger, rotate = false) {
    this.cubeCount = cubeCount;
    this.cubeSize = cubeSize;
    this.cubes = [];

    this.trigger = trigger;
    this.board = document.getElementById("game-board");
    this.rotate = rotate;
    this.reset();
    this.initailizeBoard();

    const randomCube = Math.floor(Math.random() * cubeCount);

    this.gameWinningCubeIndex = randomCube;
  }

  initailizeBoard = () => {
    const chooseCubeCallback = (idx) => {
      return () => {
        if (idx === this.gameWinningCubeIndex) {
          new SoundEffect().cool();
          this.trigger(true);
        } else {
          this.trigger(false);
          new SoundEffect().wrong();
          this.cubes[idx].cube.classList.add("wrong");

          setTimeout(() => {
            this.cubes[idx].cube.classList.remove("wrong");
          }, 1000);
        }
      };
    };

    for (let i = 0; i < this.cubeCount; i++) {
      const rotate = this.rotate
        ? `(${Math.floor(Math.random() * 90)}deg)`
        : "(0deg)";

      const cybe = new Cube(i, this.cubeSize, chooseCubeCallback(i), rotate);
      if (this.cubeCount >= 50) {
        cybe.cube.style.width = "8%";
        cybe.cube.style.padding = "0";
        cybe.cube.style.paddingBottom = "8%";
      }
      this.cubes.push(cybe);
    }

    for (let cube of this.cubes) {
      cube.appendToNode(this.board);
    }
  };

  reset = () => (this.board.innerHTML = "");
}

class ButtonSelector {
  constructor(texts, styles = {}) {
    this.btns = [];
    this.state = null;
    const appender = document.createElement("div");

    this.appender = appender;
    this.appender.className = "button-selector";
    for (let [i, t] of texts.entries()) {
      const btn = document.createElement("button");
      btn.innerHTML = t;
      btn.style = styles[t];
      btn.className = "picker";
      btn.value = t;

      appender.appendChild(btn);
      this.btns.push(btn);
    }

    for (let btn of this.btns) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.state = e.target.value;
        for (let btn of this.btns) {
          btn.classList.remove("active");
        }
        this.state = e.target.value;
        e.target.classList.add("active");
      });
    }
  }

  appendTo = (nodeId) =>
    document.getElementById(nodeId).appendChild(this.appender);
}

class Input {
  constructor() {
    this.input = document.createElement("input");
    this.input.className = "input";
    this.input.type = "text";
    this.input.placeholder = "Enter your name";

    this.input.addEventListener("change", (e) => {
      this.state = e.target.value;
    });
  }

  appendTo = (nodeId) =>
    document.getElementById(nodeId).appendChild(this.input);
}

class State {
  constructor() {
    this.listeners = [];
  }

  setState = (state) => {
    this.state = state;
    this.notify();
  };

  getState = () => this.state;

  addListener = (l) => {
    if (l instanceof Array) {
      this.listeners.push(...l);
    } else {
      this.listeners.push(l);
    }
  };

  notify = () => {
    for (let listener of this.listeners) {
      listener(this);
    }
  };
}

class Timer extends State {
  constructor(time = 180, listeners = []) {
    super();

    this.interval = null;
    this.addListener(listeners);
    this.setState(time);

    const interval = setInterval(() => {
      this.setState(this.state - 1);
      if (this.state <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    this.interval = interval;
  }
}

const startHTML = `
  <form id="start">
    <button type="submit" id="start">Start</button>
  </form>
`;

class LocalSTORAGE {
  constructor() {
    this.leaderboard = [];
    if (!localStorage.getItem("leaderboard")) {
      localStorage.setItem("leaderboard", JSON.stringify(this.leaderboard));
    } else {
      this.leaderboard = JSON.parse(localStorage.getItem("leaderboard"));
    }
  }

  sort = () => {
    this.leaderboard.sort((a, b) => b[1] - a[1]);
    this.leaderboard = this.leaderboard.filter((l) => l[0] !== "" && l[0]);
    this.leaderboard = this.leaderboard.slice(0, 10);
    localStorage.setItem("leaderboard", JSON.stringify(this.leaderboard));
  };

  add = (res) => {
    this.leaderboard.push(res);
    this.sort();
  };

  set = (board) => {
    this.leaderboard = board;
    this.sort();
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

    const select = new ButtonSelector(Object.keys(difficulty));
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
        this.state.size = difficulty[select.state].size;
        this.state.time = difficulty[select.state].time;

        this.cubeCount = difficulty[select.state].count;
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

    // Score
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

      // this.cube.style.paddingTop = this.previewSize + "px";
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
    // Check width of the score board and set preview size
    this.scoreBoard = document.createElement("div");
    this.scoreBoard.id = "score-board";
    this.cubeSize = this.state.size;

    const timer = document.createElement("p");
    timer.id = "timer";
    timer.style.textAlign = "center";

    document.getElementById("game").appendChild(this.board);
    document.getElementById("game").appendChild(this.scoreBoard);

    // button

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

    this.renderResetButton("leaderboard", "Go back to main menu");
  };
}

const appState = new AppState();
