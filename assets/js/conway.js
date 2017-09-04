/*
  A live cell with zero or one neighbours will die from loneliness
  A live cell with more than three neighbours will die from overcrowding
  A live cell with two or three neighbours will remain alive
  A dead cell with three live neighbours will spring into life
*/

/*
  -1,-1     -1,0    -1,+1

   0,-1     *us*     0,+1
  
  +1,-1     +1,0    +1,+1
*/

'use strict';

const CONSTANTS = {
  cell_size: 6,
  states: {
    alive: 1,
    dead: 0
  },
  colors: {
    alive: '#000',
    dead:  '#fff'
  },
  directions: [
    boardPosition(-1, -1),
    boardPosition(-1,  0),
    boardPosition(-1,  1),
    boardPosition( 0, -1),
    boardPosition( 0,  1),
    boardPosition( 1, -1),
    boardPosition( 1,  0),
    boardPosition( 1,  1)
  ],
  boardSize: {
    height: 100,
    width: 150
  }
};

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const pieces = [
  boardPosition(1, 5),
  boardPosition(1, 6),
  boardPosition(1, 7)
];
const board = createBoard(CONSTANTS, pieces);

function boardPosition(i, j) {
  return {i, j};
}

function checkBoardLimits(position, boardSize) {
  if (position.i < 0 || position.j < 0)
    return false;
  if (position.i >= boardSize.width || position.j >= position.height)
    return false;
  
  return true;
}

// cool words to describe the parameters in these functions: dependency injection
function countAliveNeighbourds(board, position, boardSize) {
  let count = 0;
  
  for (const direction of CONSTANTS.directions) {
    const neighbour = boardPosition(position.i + direction.i, position.j + direction.j);
    
    if (checkBoardLimits(neighbour, boardSize) && board[position.i][position.j] === CONSTANTS.states.alive)
      count++;
  }
  
  return count;
}

function init() {
  canvas.height = CONSTANTS.boardSize.height * CONSTANTS.cell_size;
  canvas.width = CONSTANTS.boardSize.width * CONSTANTS.cell_size;
  
  context.fillStyle = CONSTANTS.colors.alive;

  for (const piece of pieces) {
    context.fillRect(piece.j * CONSTANTS.cell_size, piece.i * CONSTANTS.cell_size, CONSTANTS.cell_size, CONSTANTS.cell_size)
  }
  window.requestAnimationFrame(drawingStep);
}

function drawingStep() {
  const paintingStack = [];
  
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      const count = countAliveNeighbourds(board, boardPosition(i, j), CONSTANTS.boardSize);
      
      // else if mania :(
      if (board[i][j] === CONSTANTS.states.dead) {
        if (count === 3)
          board[i][j] = 1;
          paintingStack.push(context.fillRect.bind(j * CONSTANTS.cell_size, i * CONSTANTS.cell_size, CONSTANTS.cell_size, CONSTANTS.cell_size));
      }
      else {
        console.log(count, i, j);
        if (count < 2 || count > 3) {
          board[i][j] = 0;
          paintingStack.push(context.clearRect.bind(j * CONSTANTS.cell_size, i * CONSTANTS.cell_size, CONSTANTS.cell_size, CONSTANTS.cell_size));
        }
      }
      
      if (i === CONSTANTS.boardSize.width && j === CONSTANTS.boardSize.height) {
        for (const index = 0; index < paintingStack.length; index++) {
          paintingStack[index]();
          
          if (index === paintingStack.length - 1)
            window.requestAnimationFrame(drawingStep);
        }
      }
    }
  }
}

function createBoard(CONSTANTS, pieces) {
  const board = [];
  
  console.log(pieces);
  
  for (let index = 0; index < CONSTANTS.boardSize.height; index++) {
    board[index] = [];
    
    for (let col = 0; col < CONSTANTS.boardSize.width; col++) {
      board[index][col] = CONSTANTS.states.dead;
      
      if (index === CONSTANTS.boardSize.height - 1 && col === CONSTANTS.boardSize.width - 1) {
        for (const piece of pieces) {
          board[piece.i][piece.j] = CONSTANTS.states.alive;
        }
        
        return board;
      }
    }
  }
}

init(canvas, board, CONSTANTS);