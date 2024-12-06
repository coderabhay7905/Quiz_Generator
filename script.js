const apiUrl = "https://opentdb.com/api.php";

let currentQuestionIndex = 0;
let score = 0;
let timerInterval = null;
let timeRemaining = 0;
let quizData = [];
let timeLimit = 10;

document.getElementById("quizSetupForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const numQuestions = document.getElementById("numQuestions").value;
    timeLimit = document.getElementById("timeLimit").value;
    const category = document.getElementById("category").value;

    // Fetch questions from API
    const response = await fetch(`${apiUrl}?amount=${numQuestions}&category=${category}&type=multiple`);
    const data = await response.json();
    quizData = data.results;

    // Initialize Quiz
    startQuiz();
});

function startQuiz() {
    document.getElementById("setup").style.display = "none";
    document.getElementById("quiz").style.display = "block";
    document.getElementById("result").style.display = "none";

    score = 0;
    currentQuestionIndex = 0;
    loadQuestion();
}

function loadQuestion() {
    clearInterval(timerInterval);
    timeRemaining = timeLimit;

    const question = quizData[currentQuestionIndex];
    document.getElementById("question").innerHTML = question.question;

    const options = [...question.incorrect_answers, question.correct_answer];
    shuffleArray(options);

    const optionsList = document.getElementById("options");
    optionsList.innerHTML = "";

    options.forEach(option => {
        const li = document.createElement("li");
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = () => selectAnswer(option);
        li.appendChild(button);
        optionsList.appendChild(li);
    });

    startTimer();
}

function startTimer() {
    const timerElement = document.getElementById("timer");
    timerElement.textContent = `Time Remaining: ${timeRemaining}s`;

    timerInterval = setInterval(() => {
        timeRemaining--;
        timerElement.textContent = `Time Remaining: ${timeRemaining}s`;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alert("Time's up for this question!");
            document.getElementById("next").disabled = false;
        }
    }, 1000);
}

function selectAnswer(answer) {
    clearInterval(timerInterval);

    // Clear previous selections
    const buttons = document.querySelectorAll("#options button");
    buttons.forEach((button) => button.classList.remove("selected"));

    // Highlight the selected option
    const correctAnswer = quizData[currentQuestionIndex].correct_answer;
    const clickedButton = [...buttons].find(
        (button) => button.textContent === answer
    );

    if (clickedButton) {
        clickedButton.classList.add("selected");
    }

    // Update score if the answer is correct
    if (answer === correctAnswer) {
        score++;
    }

    // Enable the next button
    document.getElementById("next").disabled = false;
}


document.getElementById("next").addEventListener("click", function () {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
});

function endQuiz() {
    document.getElementById("quiz").style.display = "none";
    document.getElementById("result").style.display = "block";
    document.getElementById("score").textContent = `Your score: ${score}/${quizData.length}`;
}

function restartQuiz() {
    document.getElementById("setup").style.display = "block";
    document.getElementById("quiz").style.display = "none";
    document.getElementById("result").style.display = "none";
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
