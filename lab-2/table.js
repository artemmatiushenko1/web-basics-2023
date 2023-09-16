'use strict';

class TableView {
  refs = {
    table: document.querySelector('.table'),
    colorPicker: document.querySelector('.color-picker'),
  };

  preventClick = false;

  timer = null;

  CLICK_EVENT_DELAY = 100;

  constructor(cols, rows, variant) {
    this.cols = cols;
    this.rows = rows;
    this.variantNumber = variant % (rows * cols);
  }

  generateCells() {
    let counter = 1;

    for (let i = 0; i < this.rows; i++) {
      const row = document.createElement('tr');

      for (let j = 0; j < this.cols; j++) {
        const col = document.createElement('td');
        col.dataset['id'] = counter;
        col.textContent = counter;
        row.appendChild(col);
        counter++;
      }

      this.refs.table.appendChild(row);
    }
  }

  getRandomColor() {
    const red = this.getRandomNumber(256);
    const green = this.getRandomNumber(256);
    const blue = this.getRandomNumber(256);

    return `rgb(${red},${green},${blue})`;
  }

  getRandomNumber(max) {
    return Math.floor(Math.random() * max);
  }

  handleCellMouseOver(e) {
    e.target.style.backgroundColor = this.getRandomColor();
  }

  handleCellClick(e) {
    e.target.style.backgroundColor = this.refs.colorPicker.value;
  }

  getCellCoordsByNumber(cellNumber) {
    const x = Math.floor((cellNumber - 1) / this.rows);
    const y = (cellNumber - 1) % this.cols;
    return [x, y];
  }

  handleDbClick(e) {
    const cells = this.refs.table.querySelectorAll('td');
    const color = this.getRandomColor();

    const targetCellNumber = Number(e.target.dataset['id']);
    const [targetCellX, tagetCellY] =
      this.getCellCoordsByNumber(targetCellNumber);

    cells.forEach((cell) => {
      const cellNumber = Number(cell.dataset['id']);
      const [cellX, cellY] = this.getCellCoordsByNumber(cellNumber);

      if (cellX <= targetCellX && cellY <= tagetCellY) {
        cell.style.backgroundColor = color;
      }
    });
  }

  init() {
    this.generateCells();

    const myCell = this.refs.table.querySelector(
      `td[data-id="${this.variantNumber}"]`
    );

    myCell.addEventListener('dblclick', (e) => {
      clearTimeout(this.timer);
      this.preventClick = true;
      this.handleDbClick(e);
    });

    myCell.addEventListener('click', (e) => {
      this.timer = setTimeout(() => {
        if (!this.preventClick) {
          this.handleCellClick.call(this, e);
        }

        this.preventClick = false;
      }, this.CLICK_EVENT_DELAY);
    });

    myCell.addEventListener('mouseover', this.handleCellMouseOver.bind(this));
  }
}

const ROWS = 6;
const COLS = 6;
const VARIANT = 66;

new TableView(COLS, ROWS, VARIANT).init();
