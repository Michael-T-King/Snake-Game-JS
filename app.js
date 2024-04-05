
  const boardSize = 30; // Размер игрового поля
  const cellSize = 20; // Размер тайла
  let initialSnakeLength = 4; // Начальная длина змейки
  let SnakeSpeed = 400; // Начальная скорость движения змейки (в миллисекундах)
  let snake = []; // Змейка
  let direction = "right"; // Направление движения змейки
  let food = {}; // Еда
  let gameLoop; // Идентификатор цикла игры
  let counter =0;
  let isPaused = false;
  let isSettings = false;
  let pausedText = 'Pause';
  let countdownCounter = 4;
  let timer = 4;
  let difficulty = false;

  const gameField = document.querySelector('.field');
  const score = document.querySelector('.score');
  const counterText =document.querySelector('.counter__text');
  const  countdown = document.querySelector(".countdown");
  const btnStart = document.querySelector('.btn__start');
  let pausePopup = document.querySelector('.pause__popup');
  
  // Создание игрового поля
for(let row = 0; row <boardSize; row++){
  for(let col = 0; col < boardSize; col ++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.style.width = cellSize + "px";
    cell.style.height = cellSize + "px";
    gameField.appendChild(cell);
  }
}
const cells = document.getElementsByClassName("cell");
function initGame() {
  snake = []; // Очищаем змейку
  direction = "right"; // Сбрасываем направление
  clearInterval(gameLoop); // Очищаем цикл игры

  function drawSnake() {
    // Очищаем предыдущее состояние змейки
    for (let i = 0; i < cells.length; i++) {
        cells[i].classList.remove("snake");
    }
    // Рисуем новое состояние змейки
    for (let i = 0; i < snake.length; i++) {
        let cellIndex = snake[i].y * boardSize + snake[i].x;
        cells[cellIndex].classList.add("snake");
    }
  }
  // Располагаем змейку в середине поля
  const start_X = Math.floor(boardSize / 2);
  const start_Y = Math.floor(boardSize / 2);
  for (let i = 1; i <= initialSnakeLength; i++) {
      snake.push({ x: start_X - i, y: start_Y });
  }

  drawSnake();
  let pausedTextItem = document.querySelector('.paused__text');
  //gameLoop = setInterval(moveSnake, SnakeSpeed);
  let btnPause = document.querySelector('.btn__pause');
  if(!isPaused){
    gameLoop = setInterval(moveSnake, SnakeSpeed);
    //pausedTextItem.innerText = pausedText;    
  }
function pause() {
 
  btnPause.addEventListener('click', (event) => {
    isPaused = !isPaused;
      // Дополнительные действия, если необходимо, когда игра приостановлена
      if(!isSettings && !isPaused){
        pausedText = 'Pause'; 
        gameLoop = setInterval(moveSnake, SnakeSpeed);
        pausePopup.classList.remove('show');
        
      }
      else {
        pausedText = 'Resume';
        clearInterval(gameLoop);
        pausePopup.classList.add('show');
      }
      pausedTextItem.innerText = pausedText;
  });
}
pause();
let Restart = document.querySelector('.btn__restart');
Restart.addEventListener('click', (event) => {
  event.preventDefault(); // Предотвращение обновления страницы
counter =0;
score.textContent = counter;
clearInterval(gameLoop);
const countRestart = setInterval(() => {
  countdown.style.display = 'flex';
  counterText.innerText = timer-1;
  timer--;
  if (timer < 0) {  
  clearInterval(countRestart);
  for (let i = 0; i < cells.length; i++) {
    cells[i].classList.remove("snake");
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].classList.remove("food");
}
    generateFood();
    initGame();
    countdown.style.display = 'none';
  }
}, 1000);
//pause();
});
 // Проверка столкновения с границей поля или самой змейкой
 function checkCollision(x, y) {
  if (x < 0 || x >= boardSize || y < 0 || y >= boardSize) {
    return true; // Столкновение с границей поля
  }
  for (let i = 0; i < snake.length; i++) {
    if (x === snake[i].x && y === snake[i].y) {
      return true; // Столкновение с самой змейкой
    }
  }
  return false;
}
function moveSnake() {
  // Определяем новую позицию головы змейки в зависимости от направления
  let newHead_X = snake[0].x;
  let newHead_Y = snake[0].y;

  if (direction === "up") {
    newHead_Y--;
  } else if (direction === "down") {
    newHead_Y++;
  } else if (direction === "left") {
    newHead_X--;
  } else if (direction === "right") {
    newHead_X++;
  }
  // Проверяем столкновение змейки с границей поля или самой собой
  if (checkCollision(newHead_X, newHead_Y)) {
    clearInterval(gameLoop);
    alert("Game Over!                " + "Your score is: " + counter);
    return;
  }
  // Проверяем, попала ли змейка на еду
  if (newHead_X === food.x && newHead_Y === food.y) {
    // Увеличиваем длину змейки
    counter++;
    if (counter % 10 === 0 && counter !== 0) {
      SnakeSpeed = SnakeSpeed -30;
      if(SnakeSpeed < 40) SnakeSpeed = 40;
      clearInterval(gameLoop);
      gameLoop = setInterval(moveSnake, SnakeSpeed);
    }
    score.textContent = counter;

    snake.unshift({ x: newHead_X, y: newHead_Y });
    if (food) {
      const foodIndex = food.y * boardSize + food.x;
      cells[foodIndex].classList.remove("food");
    /* snake.unshift({ x: newHead_X, y: newHead_Y });*/
    }
    // Генерируем новую еду
    generateFood();
    drawSnake();
  } else {
    // Перемещаем змейку
    snake.unshift({ x: newHead_X, y: newHead_Y });
    snake.pop();
  }
  drawSnake();
}
   // Обработка нажатия клавиш
  let isChangingDirection = false;
  
  document.addEventListener('keydown', (event) => {
    const key = event.key;
  
    if (!isChangingDirection) {
      isChangingDirection = true;
  
      if (key === "ArrowUp" && direction !== "down") {
        changeDirectionWithDelay("up");
      } else if (key === "ArrowDown" && direction !== "up") {
        changeDirectionWithDelay("down");
      } else if (key === "ArrowLeft" && direction !== "right") {
        changeDirectionWithDelay("left");
      } else if (key === "ArrowRight" && direction !== "left") {
        changeDirectionWithDelay("right");
      }
    }
  });

  const touchBtns = document.querySelectorAll('.arrow__btn');
touchBtns.forEach((el) => {
  el.addEventListener('click', (event) => {
    const classList = event.currentTarget.classList;

    if (!isChangingDirection) {
      isChangingDirection = true;

      if (classList.contains("up") && direction !== "down") {
        changeDirectionWithDelay("up");
      } else if (classList.contains("down") && direction !== "up") {
        changeDirectionWithDelay("down");
      } else if (classList.contains("left") && direction !== "right") {
        changeDirectionWithDelay("left");
      } else if (classList.contains("right") && direction !== "left") {
        changeDirectionWithDelay("right");
      }
    }
  });
});
  
  function changeDirectionWithDelay(newDirection) {
    direction = newDirection;
  
    setInterval(() => {
      isChangingDirection = false;
    }, 40);
  }
let settingsPopup = document.querySelector('.settings__popup');
let buttonSettings = document.querySelector('.btn__settings');
function settings() {
  buttonSettings.addEventListener('click', (event) => {
    isSettings = !isSettings;
    console.log(difficulty);
    if (isSettings) {
      clearInterval(gameLoop);
      settingsPopup.classList.add('show');
    } else if (!isSettings) {
      isPaused = true;
      pausedText = 'Resume';
      clearInterval(gameLoop);
      pausePopup.classList.add('show');
      pausedTextItem.innerText = pausedText;
      settingsPopup.classList.remove('show');
    } else if (!isSettings && !isPaused) {
      gameLoop = setInterval(moveSnake, SnakeSpeed);
    }
  });
  let buttonDifficulty = document.querySelector('.btn__difficulty');
  let lableDifficulty = document.querySelector('.lable__difficulty');
  let foodIntervalId; // Added declaration of foodIntervalId

  buttonDifficulty.addEventListener('click', () => {
    difficulty = !difficulty;
    if (!difficulty) {
      lableDifficulty.innerText = 'Normal';
      lableDifficulty.style.color = '#000';
      SnakeSpeed += 100;
      clearInterval(foodIntervalId);
      clearInterval(gameLoop);
    } 
    else if (difficulty) {
      lableDifficulty.innerText = 'Hard';
      lableDifficulty.style.color = '#f00';
      SnakeSpeed -= 100;
      clearInterval(gameLoop);
      if (foodIntervalId) {
        clearInterval(foodIntervalId);
      }
      foodIntervalId = setInterval(() => {
        for (let i = 0; i < cells.length; i++) {
          cells[i].classList.remove('food');
        }
        generateFood();
      }, 10000);
    }
  });
  let checkBox = document.querySelector('#cell__checkbox');
checkBox.addEventListener('change', (event)=>{
console.log(checkBox);
if (event.target.checked) {
  for (let i = 0; i < cells.length; i++) {
    cells[i].style.border = '1px solid rgba(3, 3, 3, 0.2)';
  }
}
else {
  for (let i = 0; i < cells.length; i++) {
    cells[i].style.border = 'none';
        }
      }
    });
  }
settings();
}
function generateFood() {
  let emptyCells = [];
  // Находим все пустые ячейки
  for (let i = 0; i < cells.length; i++) {
      if (!cells[i].classList.contains("snake")) {
        emptyCells.push(i);
      }
  }
  // Выбираем случайную пустую ячейку
  let randomIndex = Math.floor(Math.random() * emptyCells.length);
  let foodTileIndex = emptyCells[randomIndex];
  let food_X = (foodTileIndex % boardSize);
 let food_Y = Math.floor(foodTileIndex / boardSize);

  food = { x: food_X, y: food_Y };
  // Отображаем еду на игровом поле
 cells[foodTileIndex].classList.add("food");
} 

let isButtonClicked = false;
btnStart.addEventListener('click', (event) => {
  if (!isButtonClicked) {
    isButtonClicked = true;
    countdown.style.display = 'flex';
    const countdownInterval = setInterval(() => {
      counterText.innerText = countdownCounter-1;
      countdownCounter--;
      if (countdownCounter < 0) {  
      clearInterval(countdownInterval);
        generateFood();
        initGame();
        countdown.style.display = 'none';
      }
    }, 1000);
  }
});