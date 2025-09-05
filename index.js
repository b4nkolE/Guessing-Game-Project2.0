// this is the implemenation of the logic behind the game.
/*
Under the box is a picture.
Guess which one is it from those visible pictures and click it
For each wrong guess, your chances reduce (From 10 to 0).
if your guess is correct, your correct number increases(from 0 to 3)
Once your chances hit 0, you'll lose the game and if your correct guess hit 3, you'll win
The show button helps uncover the black box and see the picture under it, but you can only use it once in the game
*/
/**
 * Picture under the box is hidden at first,
 * after a picture is selected, the hidden picture automatically reveals itself... for this to work the 'z-index' has to change from 1 to 0(test).
 * if the picture is not what's underneath the chances counter reduces by 1.
 * if it's the picture is what's underneath it the correct counter moves from 0 to 1.
 * when the counter for the chances hit 0, the game ends(how)?
 * when the counter for the correct hits 3, the game is won, how?
 * The 'click here to learn how to play', tab will bring up an alert to show you the rules of the game.
 * the show button shows the image, just once and you can't use it anymore.
 */

// Game state
let gameState = {
    chances: 10,
    correctGuesses: 0,
    showButtonUsed: false,
    currentRound: 1,
    gameOver: false
};

// Image arrays - using your 9 custom images
const imagePool = [
    'images/image1.jpeg',
    'images/image2.jpeg',
    'images/image3.jpeg',
    'images/image4.jpeg',
    'images/image5.jpeg',
    'images/image6.jpeg',
    'images/image7.jpeg',
    'images/image8.jpeg',
    'images/image9.jpeg'
];

let currentHiddenImage = '';
let currentOptions = [];

// Initialize game
function initGame() {
    setupNewRound();
    updateUI();
    
    // Add event listeners
    document.getElementById('showBtn').addEventListener('click', showHiddenImage);
}

function setupNewRound() {
    // Select random hidden image
    currentHiddenImage = imagePool[Math.floor(Math.random() * imagePool.length)];
    
    // Create options array (3 random + 1 correct)
    currentOptions = [];
    currentOptions.push(currentHiddenImage);
    
    while (currentOptions.length < 4) {
        const randomImage = imagePool[Math.floor(Math.random() * imagePool.length)];
        if (!currentOptions.includes(randomImage)) {
            currentOptions.push(randomImage);
        }
    }
    
    // Shuffle options
    currentOptions = currentOptions.sort(() => Math.random() - 0.5);
    
    // Set hidden image
    document.getElementById('hiddenImage').src = currentHiddenImage;
    
    // Reset overlay
    const overlay = document.getElementById('blackOverlay');
    overlay.classList.remove('revealed');
    
    // Create option buttons
    createOptionButtons();
}

function createOptionButtons() {
    const grid = document.getElementById('optionsGrid');
    grid.innerHTML = '';
    
    currentOptions.forEach((imageSrc, index) => {
        const img = document.createElement('img');
        img.src = imageSrc;
        img.className = 'option-image';
        img.addEventListener('click', () => handleGuess(imageSrc, img));
        grid.appendChild(img);
    });
}

function handleGuess(selectedImage, imgElement) {
    if (gameState.gameOver) return;
    
    // Reveal hidden image
    const overlay = document.getElementById('blackOverlay');
    overlay.classList.add('revealed');
    
    // Add reveal animation to mystery box
    const mysteryBox = document.querySelector('.mystery-box');
    mysteryBox.classList.add('reveal-animation');
    
    setTimeout(() => {
        mysteryBox.classList.remove('reveal-animation');
    }, 800);
    
    // Check if guess is correct
    if (selectedImage === currentHiddenImage) {
        // Correct guess
        gameState.correctGuesses++;
        imgElement.classList.add('correct');
        
        setTimeout(() => {
            if (gameState.correctGuesses >= 3) {
                endGame(true);
            } else {
                setupNewRound();
            }
        }, 1500);
        
    } else {
        // Wrong guess
        gameState.chances--;
        imgElement.classList.add('wrong');
        
        // Highlight correct answer
        const correctImg = Array.from(document.querySelectorAll('.option-image'))
            .find(img => img.src === currentHiddenImage);
        if (correctImg) {
            setTimeout(() => {
                correctImg.classList.add('correct');
            }, 300);
        }
        
        setTimeout(() => {
            if (gameState.chances <= 0) {
                endGame(false);
            } else {
                setupNewRound();
            }
        }, 2000);
    }
    
    updateUI();
    
    // Disable all option buttons
    document.querySelectorAll('.option-image').forEach(img => {
        img.style.pointerEvents = 'none';
    });
}

function showHiddenImage() {
    if (gameState.showButtonUsed || gameState.gameOver) return;
    
    gameState.showButtonUsed = true;
    const overlay = document.getElementById('blackOverlay');
    const btn = document.getElementById('showBtn');
    
    overlay.classList.add('revealed');
    btn.disabled = true;
    btn.textContent = '🔍 Show Button Used';
    
    setTimeout(() => {
        overlay.classList.remove('revealed');
    }, 3000);
}

function updateUI() {
    document.getElementById('chances').textContent = gameState.chances;
    document.getElementById('correct').textContent = gameState.correctGuesses;
}

function endGame(won) {
    gameState.gameOver = true;
    const modal = document.getElementById('gameOverModal');
    const title = document.getElementById('gameOverTitle');
    const message = document.getElementById('gameOverMessage');
    
    if (won) {
        title.textContent = '🎉 Congratulations!';
        title.className = 'win';
        message.textContent = 'You successfully guessed 3 pictures correctly! You have excellent observation skills!';
    } else {
        title.textContent = '💔 Game Over';
        title.className = 'lose';
        message.textContent = 'You ran out of chances! Don\'t worry, practice makes perfect. Try again!';
    }
    
    modal.classList.remove('hidden');
}

function restartGame() {
    // Reset game state
    gameState = {
        chances: 10,
        correctGuesses: 0,
        showButtonUsed: false,
        currentRound: 1,
        gameOver: false
    };
    
    // Reset show button
    const showBtn = document.getElementById('showBtn');
    showBtn.disabled = false;
    showBtn.textContent = '🔍 Show Picture (One Time Only)';
    
    // Hide modal
    document.getElementById('gameOverModal').classList.add('hidden');
    
    // Start new game
    setupNewRound();
    updateUI();
}

function showHelp() {
    alert(`🎮 HOW TO PLAY:

🎯 OBJECTIVE: Guess 3 pictures correctly before running out of chances!

📋 RULES:
• A mystery picture is hidden under the black box
• Choose from 4 option pictures below
• Each wrong guess costs you 1 chance (start with 10)
• Each correct guess adds 1 to your score (need 3 to win)
• The hidden picture reveals after each guess

🔍 SPECIAL POWER:
• Use the "Show Picture" button to peek once per game
• The picture will show for 3 seconds, then hide again

🏆 WIN CONDITIONS:
• WIN: Get 3 correct guesses
• LOSE: Run out of chances (0 remaining)

Good luck, detective! 🕵️‍♂️`);
}


// Start the game
window.addEventListener('load', initGame);

