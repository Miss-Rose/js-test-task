import './style.css';
import Game from './src/game/Game.js';

const COLUMNS = 6;
const ROWS = 7;
const ELEMENTS = ['♠', '♣', '♢', '♡'];

const game = new Game(ELEMENTS, COLUMNS, ROWS);
game.init();
