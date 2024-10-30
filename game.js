let players = [{ name: "", score: 0 }, { name: "", score: 0 }];
let currentPlayerIndex = 0;
let categories = [];
let selectedCategory = "";
let questions = [];
let questionIndex = 0;
let usedCategories = new Set();
const API_BASE = "https://the-trivia-api.com/v2";

async function startGame() {
    players[0].name = document.getElementById("player1").value;
    players[1].name = document.getElementById("player2").value;

    if (!players[0].name || !players[1].name) {
        alert("Please enter both player names.");
        return;
    }
    await fetchCategories();
    document.getElementById("setup").style.display = "none";
    document.getElementById("category-selection").style.display = "block";
}

async function fetchCategories() {
    try {
        const res = await fetch(`${API_BASE}/categories`);
        const data = await res.json();
        categories = Array.isArray(data) ? data : Object.entries(data).map(([id, name]) => ({ id, name }));
        const categorySelect = document.getElementById("category");
        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

async function chooseCategory() {
    selectedCategory = document.getElementById("category").value;

    if (usedCategories.has(selectedCategory)) {
        alert("Category already used, please select another.");
        return;
    }

    usedCategories.add(selectedCategory);
    document.getElementById("category-selection").style.display = "none";
    document.getElementById("question-display").style.display = "block";
    await fetchQuestions();
    displayQuestion();
}

async function fetchQuestions() {
    const easyQuestions = await fetch(
        `${API_BASE}/questions?categories=${selectedCategory}&limit=2&difficulty=easy`
    ).then(res => res.json());

    const mediumQuestions = await fetch(
        `${API_BASE}/questions?categories=${selectedCategory}&limit=2&difficulty=medium`
    ).then(res => res.json());

    const hardQuestions = await fetch(
        `${API_BASE}/questions?categories=${selectedCategory}&limit=2&difficulty=hard`
    ).then(res => res.json());

    questions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];
}

function displayQuestion() {
    if (questionIndex >= questions.length) {
        endRound();
        return;
    }

    const questionObj = questions[questionIndex];
    document.getElementById("question-text").textContent = questionObj.question.text;
    
    const answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = "";
    const allAnswers = [...questionObj.incorrectAnswers, questionObj.correctAnswer].sort(() => Math.random() - 0.5);
    
    allAnswers.forEach((answer) => {
        const button = document.createElement("button");
        button.textContent = answer;
        button.onclick = () => checkAnswer(answer, questionObj.correctAnswer, questionObj.difficulty);
        answersDiv.appendChild(button);
    });
}

function updateScoreDisplay() {
    document.getElementById("player1-score").textContent = `Player 1 Score: ${players[0].score}`;
    document.getElementById("player2-score").textContent = `Player 2 Score: ${players[1].score}`;
}

function checkAnswer(selectedAnswer, correctAnswer, difficulty) {
    if (selectedAnswer === correctAnswer) {
        players[currentPlayerIndex].score += difficulty === "easy" ? 10 : difficulty === "medium" ? 15 : 20;
    }
    updateScoreDisplay();
    currentPlayerIndex = 1 - currentPlayerIndex;
    questionIndex++;
    displayQuestion();
}

function endRound() {
    document.getElementById("question-display").style.display = "none";
    document.getElementById("end-game").style.display = "block";
    if (usedCategories.size === categories.length) endGame();
}

function startNewRound() {
    questionIndex = 0;
    currentPlayerIndex = 0;
    document.getElementById("category-selection").style.display = "block";
    document.getElementById("end-game").style.display = "none";
}

function endGame() {
    document.getElementById("end-game").style.display = "none";
    const winnerText =
        players[0].score === players[1].score
            ? "It's a tie!"
            : players[0].score > players[1].score
            ? `${players[0].name} wins with a score of ${players[0].score}`
            : `${players[1].name} wins with a score of ${players[1].score}`;
    
    alert(`Game Over! ${winnerText}`);
    players[0].score = 0;
    players[1].score = 0;
    updateScoreDisplay();
}
function playAgain() {
    player1Score = 0;
    player2Score = 0;
    document.getElementById("player1-score").textContent = "Player 1 Score: 0";
    document.getElementById("player2-score").textContent = "Player 2 Score: 0";

    currentQuestionIndex = 0;
    usedCategories = new Set();  
    selectedCategory = null;     
    questions = [];           

    document.getElementById("end-game").style.display = "none";
    document.getElementById("setup").style.display = "block";

  
    document.getElementById("player1").value = "";
    document.getElementById("player2").value = "";

}