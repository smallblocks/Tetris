// Tetris Game for SATSCADE
(function() {
    'use strict';

    // Game constants
    const COLS = 10;
    const ROWS = 20;
    const BLOCK_SIZE = 24;
    const COLORS = [
        null,
        '#00ffff', // I - Cyan
        '#0000ff', // J - Blue
        '#ff8000', // L - Orange
        '#ffff00', // O - Yellow
        '#00ff00', // S - Green
        '#800080', // T - Purple
        '#ff0000', // Z - Red
    ];

    // Tetromino shapes
    const SHAPES = [
        null,
        [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]], // I
        [[2,0,0], [2,2,2], [0,0,0]],                   // J
        [[0,0,3], [3,3,3], [0,0,0]],                   // L
        [[4,4], [4,4]],                                 // O
        [[0,5,5], [5,5,0], [0,0,0]],                   // S
        [[0,6,0], [6,6,6], [0,0,0]],                   // T
        [[7,7,0], [0,7,7], [0,0,0]],                   // Z
    ];

    // Game state
    let canvas, ctx, nextCanvas, nextCtx;
    let board, currentPiece, nextPiece;
    let score, level, lines;
    let gameLoop, dropCounter, dropInterval;
    let gameState = 'start'; // start, playing, paused, gameover

    // DOM elements
    let scoreEl, levelEl, linesEl;
    let overlay, overlayTitle, overlayMessage;

    // Initialize
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        // Get canvas elements
        canvas = document.getElementById('game-board');
        ctx = canvas.getContext('2d');
        nextCanvas = document.getElementById('next-piece');
        nextCtx = nextCanvas.getContext('2d');

        // Set canvas sizes
        canvas.width = COLS * BLOCK_SIZE;
        canvas.height = ROWS * BLOCK_SIZE;
        nextCanvas.width = 4 * BLOCK_SIZE;
        nextCanvas.height = 4 * BLOCK_SIZE;

        // Get DOM elements
        scoreEl = document.getElementById('score');
        levelEl = document.getElementById('level');
        linesEl = document.getElementById('lines');
        overlay = document.getElementById('overlay');
        overlayTitle = document.getElementById('overlay-title');
        overlayMessage = document.getElementById('overlay-message');

        // Setup controls
        setupControls();

        // Show start screen
        showOverlay('TETRIS', 'Press SPACE to start');
        draw();
    }

    function setupControls() {
        // Keyboard
        document.addEventListener('keydown', handleKeydown);

        // Mobile buttons
        document.getElementById('btn-left')?.addEventListener('touchstart', (e) => { e.preventDefault(); moveLeft(); });
        document.getElementById('btn-right')?.addEventListener('touchstart', (e) => { e.preventDefault(); moveRight(); });
        document.getElementById('btn-rotate')?.addEventListener('touchstart', (e) => { e.preventDefault(); rotate(); });
        document.getElementById('btn-down')?.addEventListener('touchstart', (e) => { e.preventDefault(); softDrop(); });

        // Touch swipe (optional enhancement)
        let touchStartX, touchStartY;
        canvas.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        canvas.addEventListener('touchend', (e) => {
            if (!touchStartX || !touchStartY) return;
            const dx = e.changedTouches[0].clientX - touchStartX;
            const dy = e.changedTouches[0].clientY - touchStartY;
            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 30) moveRight();
                else if (dx < -30) moveLeft();
            } else {
                if (dy > 30) softDrop();
                else if (dy < -30) rotate();
            }
            touchStartX = touchStartY = null;
        });
    }

    function handleKeydown(e) {
        if (gameState === 'start' || gameState === 'gameover') {
            if (e.code === 'Space') {
                startGame();
            }
            return;
        }

        if (gameState === 'paused') {
            if (e.code === 'KeyP' || e.code === 'Space') {
                resumeGame();
            }
            return;
        }

        switch (e.code) {
            case 'ArrowLeft':
                moveLeft();
                break;
            case 'ArrowRight':
                moveRight();
                break;
            case 'ArrowDown':
                softDrop();
                break;
            case 'Space':
                rotate();
                break;
            case 'KeyP':
                pauseGame();
                break;
        }
    }

    function startGame() {
        board = createBoard();
        score = 0;
        level = 1;
        lines = 0;
        dropCounter = 0;
        dropInterval = 1000;
        
        nextPiece = createPiece();
        spawnPiece();
        
        updateStats();
        hideOverlay();
        gameState = 'playing';
        
        if (gameLoop) cancelAnimationFrame(gameLoop);
        let lastTime = 0;
        function loop(time) {
            const delta = time - lastTime;
            lastTime = time;
            
            if (gameState === 'playing') {
                dropCounter += delta;
                if (dropCounter > dropInterval) {
                    drop();
                    dropCounter = 0;
                }
            }
            
            draw();
            gameLoop = requestAnimationFrame(loop);
        }
        gameLoop = requestAnimationFrame(loop);
    }

    function pauseGame() {
        gameState = 'paused';
        showOverlay('PAUSED', 'Press P to continue');
    }

    function resumeGame() {
        gameState = 'playing';
        hideOverlay();
    }

    function gameOver() {
        gameState = 'gameover';
        showOverlay('GAME OVER', `Score: ${score} | Press SPACE`);
    }

    function createBoard() {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    }

    function createPiece() {
        const type = Math.floor(Math.random() * 7) + 1;
        return {
            shape: SHAPES[type].map(row => [...row]),
            type: type,
            x: 0,
            y: 0,
        };
    }

    function spawnPiece() {
        currentPiece = nextPiece;
        nextPiece = createPiece();
        
        // Center the piece
        currentPiece.x = Math.floor((COLS - currentPiece.shape[0].length) / 2);
        currentPiece.y = 0;
        
        // Check for game over
        if (collision()) {
            gameOver();
        }
    }

    function collision(offsetX = 0, offsetY = 0, shape = currentPiece.shape) {
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    const newX = currentPiece.x + x + offsetX;
                    const newY = currentPiece.y + y + offsetY;
                    
                    if (newX < 0 || newX >= COLS || newY >= ROWS) {
                        return true;
                    }
                    if (newY >= 0 && board[newY][newX]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function merge() {
        currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    const boardY = currentPiece.y + y;
                    const boardX = currentPiece.x + x;
                    if (boardY >= 0) {
                        board[boardY][boardX] = value;
                    }
                }
            });
        });
    }

    function clearLines() {
        let linesCleared = 0;
        
        for (let y = ROWS - 1; y >= 0; y--) {
            if (board[y].every(cell => cell !== 0)) {
                board.splice(y, 1);
                board.unshift(Array(COLS).fill(0));
                linesCleared++;
                y++; // Check same row again
            }
        }
        
        if (linesCleared > 0) {
            // Scoring: 100, 300, 500, 800 for 1, 2, 3, 4 lines
            const points = [0, 100, 300, 500, 800][linesCleared] * level;
            score += points;
            lines += linesCleared;
            
            // Level up every 10 lines
            const newLevel = Math.floor(lines / 10) + 1;
            if (newLevel > level) {
                level = newLevel;
                dropInterval = Math.max(100, 1000 - (level - 1) * 100);
            }
            
            updateStats();
        }
    }

    function drop() {
        if (collision(0, 1)) {
            merge();
            clearLines();
            spawnPiece();
        } else {
            currentPiece.y++;
        }
    }

    function softDrop() {
        if (!collision(0, 1)) {
            currentPiece.y++;
            score += 1;
            updateStats();
        }
    }

    function hardDrop() {
        while (!collision(0, 1)) {
            currentPiece.y++;
            score += 2;
        }
        merge();
        clearLines();
        spawnPiece();
        updateStats();
    }

    function moveLeft() {
        if (!collision(-1, 0)) {
            currentPiece.x--;
        }
    }

    function moveRight() {
        if (!collision(1, 0)) {
            currentPiece.x++;
        }
    }

    function rotate() {
        const rotated = currentPiece.shape[0].map((_, i) =>
            currentPiece.shape.map(row => row[i]).reverse()
        );
        
        if (!collision(0, 0, rotated)) {
            currentPiece.shape = rotated;
        } else if (!collision(-1, 0, rotated)) {
            currentPiece.x--;
            currentPiece.shape = rotated;
        } else if (!collision(1, 0, rotated)) {
            currentPiece.x++;
            currentPiece.shape = rotated;
        }
    }

    function draw() {
        // Clear
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw board
        board.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    drawBlock(ctx, x, y, COLORS[value]);
                }
            });
        });

        // Draw current piece
        if (currentPiece && gameState === 'playing') {
            currentPiece.shape.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value) {
                        drawBlock(ctx, currentPiece.x + x, currentPiece.y + y, COLORS[value]);
                    }
                });
            });
        }

        // Draw grid
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 1;
        for (let x = 0; x <= COLS; x++) {
            ctx.beginPath();
            ctx.moveTo(x * BLOCK_SIZE, 0);
            ctx.lineTo(x * BLOCK_SIZE, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y <= ROWS; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * BLOCK_SIZE);
            ctx.lineTo(canvas.width, y * BLOCK_SIZE);
            ctx.stroke();
        }

        // Draw next piece
        nextCtx.fillStyle = '#000';
        nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
        if (nextPiece) {
            const offsetX = (4 - nextPiece.shape[0].length) / 2;
            const offsetY = (4 - nextPiece.shape.length) / 2;
            nextPiece.shape.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value) {
                        drawBlock(nextCtx, offsetX + x, offsetY + y, COLORS[value]);
                    }
                });
            });
        }
    }

    function drawBlock(context, x, y, color, ghost = false) {
        const padding = 1;
        const size = BLOCK_SIZE - padding * 2;
        
        if (ghost) {
            context.strokeStyle = color;
            context.lineWidth = 2;
            context.strokeRect(
                x * BLOCK_SIZE + padding + 1,
                y * BLOCK_SIZE + padding + 1,
                size - 2,
                size - 2
            );
        } else {
            context.fillStyle = color;
            context.fillRect(
                x * BLOCK_SIZE + padding,
                y * BLOCK_SIZE + padding,
                size,
                size
            );
            
            // Highlight
            context.fillStyle = 'rgba(255,255,255,0.3)';
            context.fillRect(
                x * BLOCK_SIZE + padding,
                y * BLOCK_SIZE + padding,
                size,
                3
            );
            context.fillRect(
                x * BLOCK_SIZE + padding,
                y * BLOCK_SIZE + padding,
                3,
                size
            );
            
            // Shadow
            context.fillStyle = 'rgba(0,0,0,0.3)';
            context.fillRect(
                x * BLOCK_SIZE + padding,
                y * BLOCK_SIZE + size - 2,
                size,
                3
            );
            context.fillRect(
                x * BLOCK_SIZE + size - 2,
                y * BLOCK_SIZE + padding,
                3,
                size
            );
        }
    }

    function updateStats() {
        scoreEl.textContent = score.toLocaleString();
        levelEl.textContent = level;
        linesEl.textContent = lines;
    }

    function showOverlay(title, message) {
        overlayTitle.textContent = title;
        overlayMessage.textContent = message;
        overlay.classList.remove('hidden');
    }

    function hideOverlay() {
        overlay.classList.add('hidden');
    }

})();
