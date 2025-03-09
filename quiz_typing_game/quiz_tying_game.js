const quizData = [
    {
        question: "日本の首都は？",
        options: [
            { text: "東京", roman: "toukyou", correct: true },
            { text: "大阪", roman: "oosaka", correct: false },
            { text: "京都", roman: "kyouto", correct: false },
            { text: "福岡", roman: "fukuoka", correct: false }
        ]
    },
    {
        question: "医学用語で「母斑細胞母斑」とは？",
        options: [
            { text: "ほくろ", roman: "hokuro", correct: true },
            { text: "かさぶた", roman: "kasabuta", correct: false },
            { text: "にきび", roman: "nikibi", correct: false },
            { text: "そばかす", roman: "sobakasu", correct: false }
        ]
    }
];

let currentQuestionIndex = 0;
let correctAnswers = 0;
let typedInput = "";
let timer;
let timeLeft = 10.0;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function loadQuestion() {
    if (currentQuestionIndex >= quizData.length) {
        document.getElementById("quiz-container").innerHTML = `<h2>クイズ終了！</h2><p>正解数: ${correctAnswers} / ${quizData.length}</p>`;
        return;
    }
    
    const quiz = quizData[currentQuestionIndex];
    document.getElementById("question").textContent = quiz.question;
    
    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";
    
    const shuffledOptions = [...quiz.options];
    shuffleArray(shuffledOptions);
    
    shuffledOptions.forEach(option => {
        const div = document.createElement("div");
        div.className = "option";
        div.dataset.roman = option.roman;
        div.dataset.correct = option.correct;
        div.innerHTML = `${option.text}<span class="roman-text">${option.roman}</span>`;
        optionsContainer.appendChild(div);
    });
    
    document.getElementById("result").textContent = "";
    typedInput = "";
    resetTimer();
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 10.0;
    updateTimerDisplay();
    
    timer = setInterval(() => {
        timeLeft = parseFloat(timeLeft) - 0.1;
        timeLeft = Math.max(0, timeLeft);
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById("result").textContent = "不正解... 時間切れ";
            document.getElementById("result").className = "incorrect";
            setTimeout(() => {
                currentQuestionIndex++;
                loadQuestion();
            }, 1500);
        }
    }, 100);
}

function updateTimerDisplay() {
    const timerBar = document.getElementById("timer-bar");
    const timerText = document.getElementById("timer-text");
    timerBar.style.width = (timeLeft * 10) + "%";
    timerText.textContent = timeLeft.toFixed(1) + "s";
    if (timeLeft <= 1) {
        timerBar.style.backgroundColor = "red";
    } else if (timeLeft <= 5) {
        timerBar.style.backgroundColor = "orange";
    } else {
        timerBar.style.backgroundColor = "#007BFF";
    }
}

loadQuestion();