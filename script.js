const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const clickSound = document.getElementById('click-sound');
const winSoundX = document.getElementById('win-sound-x');
const winSoundO = document.getElementById('win-sound-o');
const drawSound = document.getElementById('draw-sound');
let currentPlayer = 'X';
let gameEnded = false;
let scoreX = 0;
let scoreO = 0;

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
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkWinner() {
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
    if (cells[a].textContent !== '' &&
      cells[a].textContent === cells[b].textContent &&
      cells[a].textContent === cells[c].textContent) {
      gameEnded = true;

      // Play the win sound based on the current player
      if (cells[a].textContent === 'X') {
        winSoundX.play().catch(error => {
          console.log('Autoplay was prevented:', error);
        });
        scoreX++; // Increase X score
        document.getElementById('score-x').textContent = scoreX; // Update UI
      } else if (cells[a].textContent === 'O') {
        winSoundO.play().catch(error => {
          console.log('Autoplay was prevented:', error);
        });
        scoreO++; // Increase O score
        document.getElementById('score-o').textContent = scoreO; // Update UI
      }

      setTimeout(() => {
        alert(`${cells[a].textContent} তুমি জিতেছো বাবা 😁`);
      }, 100);
      return; // Stop further checking once a winner is found
    }
  }

  if (!gameEnded && [...cells].every(cell => cell.textContent !== '')) {
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
      var backgroundMusic = document.getElementById('background-music');
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