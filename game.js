'use strict';

// 1. Game Board with rendering mechanics, drawing mechanics, reset board mechanic
const gameBoard = (function () {

  // fill game board with 9 empty spaces
  const _board = ['', '', '', '', '', '', '', '', ''];

  // cache DOM
  const _boardSpaces = document.querySelectorAll('.boardSpace');
  const _reset = document.getElementById('reset');

  render();

  // bind events
  _boardSpaces.forEach((space) => {
    space.addEventListener('click', draw);
  })
  // reset bind
  _reset.addEventListener('click', reset);

  // render 
  function render() {
    // iterate over each board space and add array content to that space
    _boardSpaces.forEach((space) => {
      space.textContent = _board[space.dataset.index];
    })
  }

  function draw(event) {
    let currentSpace = event.target.dataset.index;
    let currentText = event.target.textContent;
    if (currentText == '' && !game.checkWinner()) {
      _board[currentSpace] = (player.getCurrentPlayer() == 1) ? 'X' : 'O';
      player.changePlayer();
      game.checkTie();
      render();
    }
  }

  function reset() {
    for (let i = 0; i < _board.length; i++) {
      _board[i] = '';
    }
    if (player.getCurrentPlayer() == -1) {
      player.changePlayer();
    }
    player.playerFlare[0].classList.add('current');
    game.resetGame();
    render();
  }

  function getBoard() {
    return _board;
  }

  return {
    getBoard,
  }
})();

// 2. Player object 
const player = (function () {
  const playerFlare = document.querySelectorAll('.player');

  // '1' will represent X's (player 1), '-1' will represent O's (player 2)
  let _currentPlayer = '1'; // start with player 1 (X) 
  function getCurrentPlayer() {
    return _currentPlayer;
  }
  function changePlayer() {
    _currentPlayer *= (-1); // multiply by -1 to change whose turn it is
    if (!game.checkWinner()) {
      if (_currentPlayer == '1') {
        playerFlare[0].classList.add('current');
        playerFlare[1].classList.remove('current');
      } else {
        playerFlare[1].classList.add('current');
        playerFlare[0].classList.remove('current');
      }
    } else {
      for (let i = 0; i < 2; i++) {
        playerFlare[i].classList.remove('current');
      }
    }
  }
  // return current player for board state to update?
  return {
    getCurrentPlayer,
    changePlayer,
    playerFlare
  }
})();

// 3. Game object with win state logic, legal moves, etc.
const game = (function () {

  // cach DOM
  const _modal = document.querySelector('.modal');
  const _winner = document.querySelector('.winner');
  const _tie = document.querySelector('.tie');

  // init variables
  let winner = false;
  let turnCount = 0; // use number of turns to check if there's a tie after board is full


  // bind events
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == _modal) {
      _modal.style.display = "none";
      _winner.style.display = 'none';
      _tie.style.display = 'none';
    }
  };

  function _gameOver() {
    _modal.style.display = 'block';
    _winner.style.display = 'block';
    // get winner (x or o)
    let winningPlayer = (player.getCurrentPlayer() == '1') ? 'O' : 'X';
    _winner.textContent = `${winningPlayer} wins!`;
  }
  function _resetTurnCount() {
    turnCount = 0;
  }
  function _resetWinner() {
    winner = false;
  }
  function checkTie() {
    let tie = false;
    turnCount++;
    if (!checkWinner() && turnCount >= 9) {
      tie = true;
    }
    console.log(tie, turnCount);
    return tie;
  }
  function resetGame() {
    _resetWinner();
    _resetTurnCount();
    _modal.style.display = "none";
  }
  function checkWinner() {
    let currentBoard = gameBoard.getBoard();
    // check rows 
    for (let i = 0; i <= 6; i += 3) {
      let rows = [];
      rows.push(currentBoard[i] + currentBoard[i + 1] + currentBoard[i + 2]);
      for (let j = 0; j < 3; j++) {
        if (rows[j] == 'XXX' || rows[j] == 'OOO') {
          winner = true;
        }
      }
    }
    // check cols 
    for (let i = 0; i <= 2; i++) {
      let cols = [];
      cols.push(currentBoard[i] + currentBoard[i + 3] + currentBoard[i + 6]);
      for (let j = 0; j < 3; j++) {
        if (cols[j] == 'XXX' || cols[j] == 'OOO') {
          winner = true;
        }
      }
    }
    // check diagonals
    for (let i = 0; i <= 2; i += 2) {
      let diags = [];
      if (i === 0) {
        diags.push(currentBoard[i] + currentBoard[i + 4] + currentBoard[i + 8])
      } else {
        diags.push(currentBoard[i] + currentBoard[i + 2] + currentBoard[i + 4]);
      }
      for (let j = 0; j < 3; j++) {
        if (diags[j] == 'XXX' || diags[j] == 'OOO') {
          winner = true;
        }
      }
    }
    if (winner) {
      _gameOver();
    }
    return winner;
  }
  return {
    checkWinner,
    checkTie,
    resetGame
  }

})();