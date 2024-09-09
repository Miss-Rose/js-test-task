export default class Game {
  #array;
  #container;
  #size;

  constructor(elements, cols, rows) {
    this.elements = elements;
    this.cols = cols;
    this.rows = rows;
    this.#array = null;
    this.#container = document.getElementById('gameBoard');
    this.target = null;
    this.#size = this.cols * this.rows;
  }

  generateRandomArray() {
    const arr = [];
    for (let i = 0; i < this.rows; i++) {
      const row = [];
      for (let j = 0; j < this.cols; j++) {
        const randomElement =
          this.elements[Math.floor(Math.random() * this.elements.length)];
        row.push(randomElement);
      }
      arr.push(row);
    }
    return arr;
  }

  createPlayBoard() {
    this.#container.style.display = 'grid';
    this.#container.style.gridTemplateColumns = `repeat(${this.cols}, 50px)`;
    this.#container.style.gridTemplateRows = `repeat(${this.rows}, 50px)`;

    this.#array.forEach((col, indexR) => {
      col.forEach((row, indexC) => {
        const cellDiv = document.createElement('div');
        cellDiv.textContent = row;
        cellDiv.setAttribute('data-key', `${indexR}-${indexC}`);
        this.#container.appendChild(cellDiv);
      });
    });
  }

  init() {
    if (!this.#container) {
      alert('Container "gameBoard" is not found');
      return;
    }

    this.#array = this.generateRandomArray();

    this.createPlayBoard();
    this.initClickEvent();
  }

  initClickEvent() {
    this.#container.addEventListener('click', this.onClick);
  }

  onClick = (e) => {
    const clickedElement = e.target;
    if (!clickedElement) return;

    this._target = clickedElement;

    if (this._target.innerText !== '') {
      this.findGroup(this._target);
    }
  };

  searchBFS(array, indexR, indexC) {
    const targetValue = this.#array[indexR][indexC];
    const visited = Array.from({ length: this.rows }, () =>
      Array(this.cols).fill(false)
    );
    visited[indexR][indexC] = true;

    let queue = [[indexR, indexC]];
    let result = [[indexR, indexC]];

    const steps = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ];

    while (queue.length > 0) {
      const [currentRow, currentCol] = queue.shift();

      for (let [nextRow, nextCol] of steps) {
        const newRow = currentRow + nextRow;
        const newCol = currentCol + nextCol;

        if (
          newRow >= 0 &&
          newRow < this.rows &&
          newCol >= 0 &&
          newCol < this.cols &&
          !visited[newRow][newCol] &&
          array[newRow][newCol] === targetValue
        ) {
          visited[newRow][newCol] = true;
          queue.push([newRow, newCol]);
          result.push([newRow, newCol]);
        }
      }
    }

    return result;
  }

  findGroup(targetElement) {
    const [indexR, indexC] = targetElement
      .getAttribute('data-key')
      .split('-')
      .map(Number);
    const res = this.searchBFS(this.#array, indexR, indexC);
    this.removeGroup(res);
  }

  removeGroup(group) {
    this.#size -= group.length;

    group.forEach(([r, c]) => {
      const cell = this.#container.querySelector(`[data-key='${r}-${c}']`);
      if (cell) {
        cell.style.backgroundColor = 'lightgray';
      }
    });

    setTimeout(() => {
      group.forEach(([row, col]) => {
        const cell = this.#container.querySelector(
          `[data-key='${row}-${col}']`
        );
        if (cell) {
          cell.textContent = '';
          this.#array[row][col] = '';
          cell.style.backgroundColor = 'white';
        }
      });
    }, 200);

    if (this.#size === 0) {
      setTimeout(() => this.gameIsOver(), 250);
    }
  }

  gameIsOver() {
    alert('Game is over');
    this.#container.removeEventListener('click', this.onClick);
    this.#container.innerHTML = '';
    this.#size = this.rows * this.cols;
    this.init();
  }
}
