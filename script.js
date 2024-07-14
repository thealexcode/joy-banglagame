const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const clickSound = document.getElementById('click-sound');
const winSoundX = document.getElementById('win-sound-x');
const winSoundO = document.getElementById('win-sound-o');
const drawSound = document.getElementById('draw-sound');
const playerVsPlayerButton = document.getElementById('player-vs-player');
const playerVsAiButton = document.getElementById('player-vs-ai');
const backgroundMusic = document.getElementById('background-music');

let currentPlayer = 'X';
let gameEnded = false;
let scoreX = 0;
let scoreO = 0;
let mode = 'player-vs-player'; // Default mode

playerVsPlayerButton.addEventListener('click', () => {
  mode = 'player-vs-player';
  resetGame();
});

playerVsAiButton.addEventListener('click', () => {
  mode = 'player-vs-ai';
  resetGame();
});

cells.forEach(cell => {
  cell.addEventListener('click', handleClick);
});

resetButton.addEventListener('click', resetGame);

function handleClick() {
  if (gameEnded || this.textContent !== '') return;

  this.textContent = currentPlayer;

  // Play the click sound
  clickSound.play().catch(error => {
    console.log('Autoplay was prevented:', error);
  });

  checkWinner();
  if (mode === 'player-vs-ai' && !gameEnded) {
    // Add a delay before the AI moves
    setTimeout(aiMove, 1000); // Adjust the delay here (1000ms = 1s)
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }
}

function aiMove() {
  // Play the click sound for AI move
  clickSound.play().catch(error => {
    console.log('Autoplay was prevented:', error);
  });

  const bestMove = findBestMove();
  if (bestMove !== null) {
    cells[bestMove].textContent = 'O';
    checkWinner();
    currentPlayer = 'X';
  }
}

function findBestMove() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < cells.length; i++) {
    if (cells[i].textContent === '') {
      cells[i].textContent = 'O';
      const score = minimax(cells, 0, false);
      cells[i].textContent = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  return move;
}

function minimax(board, depth, isMaximizing) {
  const scores = {
    X: -10,
    O: 10,
    draw: 0
  };

  const winner = checkWinnerMinimax();
  if (winner) {
    return scores[winner];
  }

  if (isBoardFull()) {
    return scores.draw;
  }

  let bestScore;
  if (isMaximizing) {
    bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i].textContent === '') {
        board[i].textContent = 'O';
        const score = minimax(board, depth + 1, false);
        board[i].textContent = '';
        bestScore = Math.max(score, bestScore);
      }
    }
  } else {
    bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i].textContent === '') {
        board[i].textContent = 'X';
        const score = minimax(board, depth + 1, true);
        board[i].textContent = '';
        bestScore = Math.min(score, bestScore);
      }
    }
  }

  return bestScore;
}

function checkWinnerMinimax() {
  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (cells[a].textContent === cells[b].textContent && cells[a].textContent === cells[c].textContent) {
      if (cells[a].textContent === 'O') return 'O';
      if (cells[a].textContent === 'X') return 'X';
    }
  }

  return null;
}

function isBoardFull() {
  return [...cells].every(cell => cell.textContent !== '');
}

function checkWinner() {
  const winner = checkWinnerMinimax();
  if (winner) {
    gameEnded = true;

    // Play the win sound based on the current player
    if (winner === 'X') {
      winSoundX.play().catch(error => {
        console.log('Autoplay was prevented:', error);
      });
      scoreX++; // Increase X score
      document.getElementById('score-x').textContent = scoreX; // Update UI
    } else if (winner === 'O') {
      winSoundO.play().catch(error => {
        console.log('Autoplay was prevented:', error);
      });
      scoreO++; // Increase O score
      document.getElementById('score-o').textContent = scoreO; // Update UI
    }

    setTimeout(() => {
      alert(`${winner} তুমি জিতেছো বাবা 😁`);
    }, 100);
    return; // Stop further checking once a winner is found
  }

  if (!gameEnded && isBoardFull()) {
    gameEnded = true;

    // Play the draw sound
    drawSound.play().catch(error => {
      console.log('Autoplay was prevented:', error);
    });

    setTimeout(() => {
      alert("তুমার আব্বা ড্র শালার ভাই 👺");
    }, 100);
  }
}

function resetGame() {
  // Reset only the game board, not the scores
  cells.forEach(cell => {
    cell.textContent = '';
  });
  currentPlayer = 'X';
  gameEnded = false;
}

document.addEventListener("DOMContentLoaded", function() {
  // Show the popup
  var popup = document.getElementById("popup");
  var blurOverlay = document.getElementById("blur-overlay");
  popup.style.display = "block";
  blurOverlay.style.display = "block";

  // Add event listener to the Start Game button
  var startGameButton = document.getElementById('start-game');
  startGameButton.addEventListener('click', function() {
    // Play the welcome audio
    var audio = document.getElementById('welcome-audio');
    audio.play().catch(error => {
      console.log('Autoplay was prevented:', error);
    });

    // Hide the popup and blur overlay
    popup.style.display = "none";
    blurOverlay.style.display = "none";

    // Play the background music after welcome audio ends
    audio.addEventListener('ended', function() {
      backgroundMusic.loop = true;
      backgroundMusic.play().catch(error => {
        console.log('Autoplay was prevented:', error);
      });
    });
  });

  // Update initial scores in UI
  document.getElementById('score-x').textContent = scoreX;
  document.getElementById('score-o').textContent = scoreO;
});

// Stop background music when the user exits the page
window.addEventListener('beforeunload', function() {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
});



// EXIT BUTTON STOP MUSIC ETC.

const musicIcon = document.getElementById('music-icon');
const musicControls = document.getElementById('music-controls');

musicIcon.addEventListener('click', () => {
    musicControls.style.display = musicControls.style.display === 'none' || musicControls.style.display === '' ? 'flex' : 'none';
});

document.getElementById('stop-music').addEventListener('click', () => {
    backgroundMusic.pause();
});

document.getElementById('volume-down').addEventListener('click', () => {
    if (backgroundMusic.volume > 0) {
        backgroundMusic.volume = Math.max(0, backgroundMusic.volume - 0.1);
    }
});

document.getElementById('volume-up').addEventListener('click', () => {
    if (backgroundMusic.volume < 1) {
        backgroundMusic.volume = Math.min(1, backgroundMusic.volume + 0.1);
    }
});
