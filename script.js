const board = document.getElementById('board');
const playerScoreElement = document.getElementById('player-score');
const aiScoreElement = document.getElementById('ai-score');
const resultElement = document.getElementById('result');
const resetButton = document.getElementById('reset-btn');

let playerScore = 0;
let aiScore = 0;
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

// Create board cells
function createBoard() {
    board.innerHTML = '';
    gameBoard.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.index = index;
        cellElement.addEventListener('click', handleCellClick);
        board.appendChild(cellElement);
    });
}

// Handle player move
function handleCellClick(e) {
    const cellIndex = e.target.dataset.index;
    
    if (gameBoard[cellIndex] !== '' || !gameActive || currentPlayer !== 'X') return;
    
    makeMove(cellIndex, 'X');
    
    if (gameActive) {
        currentPlayer = 'O';
        resultElement.textContent = "AI is thinking...";
        setTimeout(aiMove, 500); // Delay for better UX
    }
}

// AI move (simple unbeatable AI)
function aiMove() {
    if (!gameActive) return;
    
    // Simple AI: Try to win, then block, then take center, then random
    let move;
    
    // Check for winning move
    move = findWinningMove('O');
    if (move === null) {
        // Block player's winning move
        move = findWinningMove('X');
    }
    if (move === null) {
        // Take center if available
        if (gameBoard[4] === '') move = 4;
    }
    if (move === null) {
        // Take random corner
        const corners = [0, 2, 6, 8];
        const emptyCorners = corners.filter(index => gameBoard[index] === '');
        if (emptyCorners.length > 0) {
            move = emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
        }
    }
    if (move === null) {
        // Take any available space
        const availableMoves = gameBoard.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
        if (availableMoves.length > 0) {
            move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }
    }
    
    if (move !== null) {
        setTimeout(() => {
            makeMove(move, 'O');
            currentPlayer = 'X';
        }, 300); // Small delay for "thinking" effect
    }
}

function findWinningMove(symbol) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] === symbol && gameBoard[b] === symbol && gameBoard[c] === '') return c;
        if (gameBoard[a] === symbol && gameBoard[c] === symbol && gameBoard[b] === '') return b;
        if (gameBoard[b] === symbol && gameBoard[c] === symbol && gameBoard[a] === '') return a;
    }
    
    return null;
}

// Process a move
function makeMove(index, player) {
    gameBoard[index] = player;
    const cell = board.children[index];
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
    
    if (checkWin(player)) {
        endGame(player);
    } else if (gameBoard.every(cell => cell !== '')) {
        endGame('draw');
    }
}

// Check for win
function checkWin(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return gameBoard[a] === player && gameBoard[b] === player && gameBoard[c] === player;
    });
}

// End game
function endGame(result) {
    gameActive = false;
    
    if (result === 'X') {
        playerScore++;
        playerScoreElement.textContent = playerScore;
        resultElement.textContent = "You win!";
        highlightWinningCells('X');
    } else if (result === 'O') {
        aiScore++;
        aiScoreElement.textContent = aiScore;
        resultElement.textContent = "AI wins!";
        highlightWinningCells('O');
    } else {
        resultElement.textContent = "It's a draw!";
    }
}

// Highlight winning cells
function highlightWinningCells(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] === player && gameBoard[b] === player && gameBoard[c] === player) {
            board.children[a].classList.add('winning-cell');
            board.children[b].classList.add('winning-cell');
            board.children[c].classList.add('winning-cell');
            break;
        }
    }
}

// Reset game
function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    resultElement.textContent = "Your turn! (X goes first)";
    createBoard();
}

// Initialize
createBoard();
resetButton.addEventListener('click', resetGame);
