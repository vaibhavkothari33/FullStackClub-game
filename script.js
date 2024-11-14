const cards = document.querySelectorAll('.card');
let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;
const timerElement = document.getElementById('timer');
let timeLeft = 20;
let timerStarted = false;
const resetButton = document.getElementById('reset-btn');
let countdown;
let moves = 0;
let matchedPairs = 0;
let flippedCards = [];
let gameStarted = false;

function startTimer() {
    countdown = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft === 0) {
            clearInterval(countdown);
            disableDeck = true; // Stops the game when time runs out
            alert("Time's up! You lost the game.");
            shuffleCard(); // Restart the game
        }
    }, 1000);
}

function updateTimerDisplay() {
    timerElement.textContent = `${timeLeft}s`;
    if (timeLeft <= 5) {
        timerElement.style.color = 'red';
    } else if (timeLeft <= 10) {
        timerElement.style.color = 'yellow';
    } else {
        timerElement.style.color = 'green';
    }
}

function flipCard({ target: clickedCard }) {
    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }

    if (cardOne !== clickedCard && !disableDeck) {
        clickedCard.classList.add('flip');
        if (!cardOne) {
            return (cardOne = clickedCard);
        }
        cardTwo = clickedCard;
        disableDeck = true;
        let cardOneImg = cardOne.querySelector('.back-view img').src,
            cardTwoImg = cardTwo.querySelector('.back-view img').src;
        matchCards(cardOneImg, cardTwoImg);
    }
}
function matchCards(img1, img2) {
    if (img1 === img2) {
        matched++;
        if (matched >=4) {
            clearInterval(countdown); // Stop the timer when all cards are matched
            setTimeout(() => {
                alert("Congratulations! You won the game.");
                shuffleCard();
            }, 1000);
        }
        cardOne.removeEventListener('click', flipCard);
        cardTwo.removeEventListener('click', flipCard);
        cardOne = cardTwo = '';
        return (disableDeck = false);
    }
    setTimeout(() => {
        cardOne.classList.add('shake');
        cardTwo.classList.add('shake');
    }, 400);
    setTimeout(() => {
        cardOne.classList.remove('shake', 'flip');
        cardTwo.classList.remove('shake', 'flip');
        cardOne = cardTwo = '';
        disableDeck = false;
    }, 1200);
}

function endGame() {
    resetButton.classList.remove('hidden');
    let score = matchedPairs * 100 - moves * 10;
    leaderboardList.innerHTML += `<li>${playerName} - Score: ${score}, Moves: ${moves}</li>`;
}

resetButton.addEventListener('click', resetGame);

function resetGame() {
    gameStarted = false;
    timeLeft = 20;
    moves = 0;
    matchedPairs = 0;
    flippedCards = [];
    clearInterval(countdown);
    updateTimerDisplay();
    resetButton.classList.add('hidden');
    cards.forEach(card => card.classList.remove('flipped'));
    shuffleCard();
}

function shuffleCard() {
    matched = 0;
    disableDeck = false;
    cardOne = cardTwo = '';
    timerStarted = false;
    timeLeft = 20;
    updateTimerDisplay();
    clearInterval(countdown);

    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
    arr.sort(() => (Math.random() > 0.5 ? 1 : -1));
    cards.forEach((card, i) => {
        card.classList.remove('flip');
        let imgTag = card.querySelector('.back-view img');
        imgTag.src = `images/image${arr[i]}.png`;
        card.addEventListener('click', flipCard);
    });
}

shuffleCard();

cards.forEach((card) => {
    card.addEventListener('click', flipCard);
});
