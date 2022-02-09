"use strict";
// 1. Game Board with rendering mechanics, drawing mechanics, reset board mechanic
const gameBoard = (function () {
  // fill game board with 9 empty spaces
  const _board = ["", "", "", "", "", "", "", "", ""];

  // cache DOM
  const _boardSpaces = document.querySelectorAll(".boardSpace");
  const _resetBtn = document.getElementById("reset");
  let _currentSpace;

  _render();

  // bind events
  _boardSpaces.forEach((space) => {
    space.addEventListener('click', setCurrentSpace);
    space.addEventListener("click", _draw);
  });

  _resetBtn.addEventListener("click", reset);

  function _render() {
    // iterate over each board space and add array content to that space
    _boardSpaces.forEach((space) => {
      space.textContent = _board[space.dataset.index];
    });
  }
  function setCurrentSpace(event) {
    _currentSpace = event.target.dataset.index;
  }
  function getCurrentSpace() {
    return _currentSpace;
  }
  function _draw(event) {
    let currentText = event.target.textContent;
    if (currentText == "" && !game.checkWinner()) {
      _board[_currentSpace] = player.getCurrentPlayer() == 1 ? "X" : "O";
      player.changePlayer();
      game.checkTie();
      _render();
    }
  }

  function reset() {
    for (let i = 0; i < _board.length; i++) {
      _board[i] = "";
    }
    if (player.getCurrentPlayer() == -1) {
      player.changePlayer();
    }
    player.playerFlare[0].classList.add("current");
    game.resetGame();
    _render();
  }

  function getBoard() {
    return _board;
  }

  return {
    getBoard,
    getCurrentSpace,
  };
})();

// 2. Player object
const player = (function () {
  const playerFlare = document.querySelectorAll(".player");

  // '1' will represent X's (player 1), '-1' will represent O's (player 2)
  let _currentPlayer = "1"; // start with player 1 (X)
  function getCurrentPlayer() {
    return _currentPlayer;
  }
  function changePlayer() {
    _currentPlayer *= -1; // multiply by -1 to change whose turn it is
    if (!game.getWinner()) {
      if (_currentPlayer == "1") {
        playerFlare[0].classList.add("current");
        playerFlare[1].classList.remove("current");
      } else {
        playerFlare[1].classList.add("current");
        playerFlare[0].classList.remove("current");
      }
    } else {
      for (let i = 0; i < 2; i++) {
        playerFlare[i].classList.remove("current");
      }
    }
  }
  // return current player for board state to update?
  return {
    getCurrentPlayer,
    changePlayer,
    playerFlare,
  };
})();

// 3. Game object with win state logic, legal moves, etc.
const game = (function () {
  // cach DOM
  const _modal = document.querySelector(".modal");
  const _winner = document.querySelector(".winner");
  const _tie = document.querySelector(".tie");
  const _close = document.querySelector(".close");

  // init variables
  let winner = false;
  let turnCount = 0; // use number of turns to check if there's a tie after board is full

  // bind events

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == _modal) {
      closeModal();
    }
  };
  _close.addEventListener('click', () => {
    closeModal();
  })
  function _gameOver() {
    _modal.style.display = "block";
    _winner.style.display = "block";
    // get winner (x or o)
    let winningPlayer = player.getCurrentPlayer() == "1" ? "O" : "X";
    _winner.textContent = `${winningPlayer} wins!`;
  }
  function _resetTurnCount() {
    turnCount = 0;
  }
  function _resetWinner() {
    winner = false;
  }
  function closeModal() {
    _modal.style.display = "none";
    _winner.style.display = "none";
    _tie.style.display = "none";
  }
  function checkTie() {
    let tieCheck = false;
    turnCount++;
    if (!checkWinner() && turnCount >= 9) {
      tieCheck = true;
      _modal.style.display = "block";
      _tie.style.display = "block";
    }
    return tieCheck;
  }
  function resetGame() {
    _resetWinner();
    _resetTurnCount();
    _modal.style.display = "none";
    _winner.style.display = "none";
    _tie.style.display = "none";
  }

  // Modularize check winner into checking rows, diagonals, and columns

  function checkRows(boardArr) {

    for (let i = 0; i <= 6; i += 3) {
      let rows = [];
      rows.push(boardArr[i] + boardArr[i + 1] + boardArr[i + 2]);
      for (let j = 0; j < 3; j++) {
        if (rows[j] == "XXX" || rows[j] == "OOO") {
          winner = true;
        }
      }
    }
  }
  function checkCols(boardArr) {
    for (let i = 0; i <= 2; i++) {
      let cols = [];
      cols.push(boardArr[i] + boardArr[i + 3] + boardArr[i + 6]);
      for (let j = 0; j < 3; j++) {
        if (cols[j] == "XXX" || cols[j] == "OOO") {
          winner = true;
        }
      }
    }
  }
  function checkDiagonals(boardArr) {
    for (let i = 0; i <= 2; i += 2) {
      let diagonals = [];
      if (i === 0) {
        diagonals.push(boardArr[i] + boardArr[i + 4] + boardArr[i + 8]);
      } else {
        diagonals.push(boardArr[i] + boardArr[i + 2] + boardArr[i + 4]);
      }
      for (let j = 0; j < 3; j++) {
        if (diagonals[j] == "XXX" || diagonals[j] == "OOO") {
          winner = true;
        }
      }
    }
  }
  function checkWinner() {
    // let currentSpace = gameBoard.getCurrentSpace(); // plan to check specific win conditions based on which space was currently played in
    // no need to check until someone is logically able to win
    let currentBoard = gameBoard.getBoard();
    if (turnCount > 4) {
      checkRows(currentBoard);
      checkCols(currentBoard);
      checkDiagonals(currentBoard);
    }

    if (winner) {
      _gameOver();
    }
    return winner;
  }

  function getWinner() {
    return winner;
  }
  return {
    checkWinner,
    checkTie,
    resetGame,
    getWinner,
  };
})();
