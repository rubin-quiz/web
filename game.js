// クイズデータ - ウェルノウンポート番号
const quizData = [
    {
        question: "HTTPのポート番号は？",
        choices: ["21", "80", "443", "22"],
        answer: 1
    },
    {
        question: "HTTPSのポート番号は？",
        choices: ["80", "443", "8080", "22"],
        answer: 1
    },
    {
        question: "FTPのポート番号は？",
        choices: ["20/21", "22", "23", "25"],
        answer: 0
    },
    {
        question: "SSHのポート番号は？",
        choices: ["21", "22", "23", "25"],
        answer: 1
    },
    {
        question: "Telnetのポート番号は？",
        choices: ["21", "22", "23", "25"],
        answer: 2
    },
    {
        question: "SMTPのポート番号は？",
        choices: ["21", "23", "25", "110"],
        answer: 2
    },
    {
        question: "DNSのポート番号は？",
        choices: ["43", "53", "67", "69"],
        answer: 1
    },
    {
        question: "DHCPのポート番号は？",
        choices: ["53", "67/68", "69", "80"],
        answer: 1
    },
    {
        question: "POP3のポート番号は？",
        choices: ["25", "110", "143", "389"],
        answer: 1
    },
    {
        question: "IMAPのポート番号は？",
        choices: ["110", "143", "389", "443"],
        answer: 1
    },
    {
        question: "SNMPのポート番号は？",
        choices: ["161/162", "389", "443", "636"],
        answer: 0
    },
    {
        question: "LDAPのポート番号は？",
        choices: ["161", "389", "443", "636"],
        answer: 1
    },
];

// ゲーム状態管理
const gameState = {
    currentIndex: 0,
    score: 0,
    timeLeft: 10,
    maxTime: 10, // 最大時間を定数として保持
    timer: null,
    userAnswers: []
};

// DOM要素
const DOM = {
    screens: {
        start: document.getElementById("game-start-screen"),
        quiz: document.getElementById("game-quiz-screen"),
        result: document.getElementById("game-result-screen")
    },
    buttons: {
        start: document.getElementById("game-start"),
        restart: document.getElementById("game-restart")
    },
    quiz: {
        question: document.getElementById("game-question"),
        choices: document.getElementById("game-choices-container"),
        timeDisplay: document.getElementById("game-time-left"),
        scoreDisplay: document.getElementById("game-score-count"),
        timerContainer: document.getElementById("game-timer")
    },
    result: {
        finalScore: document.getElementById("game-final-score")
    }
};

// イベントリスナーの設定
function initGame() {
    DOM.buttons.start.addEventListener("click", startGame);
    DOM.buttons.restart.addEventListener("click", restartGame);
    
    // 初期表示設定
    DOM.screens.quiz.style.display = "none";
    DOM.screens.result.style.display = "none";
}

// ゲーム開始
function startGame() {
    DOM.screens.start.style.display = "none";
    DOM.screens.quiz.style.display = "block";
    resetGameState();
    showQuestion();
}

// ゲーム状態のリセット
function resetGameState() {
    gameState.currentIndex = 0;
    gameState.score = 0;
    gameState.timeLeft = gameState.maxTime;
    gameState.userAnswers = [];
    DOM.quiz.scoreDisplay.textContent = "0";
}

// 問題表示
function showQuestion() {
    // タイマーをクリア
    clearInterval(gameState.timer);
    
    // タイマーを初期化
    gameState.timeLeft = gameState.maxTime;
    DOM.quiz.timeDisplay.textContent = gameState.timeLeft;
    
    // タイマーゲージを初期化
    initTimerGauge();

    // 問題と選択肢を表示
    const currentQuestion = quizData[gameState.currentIndex];
    DOM.quiz.question.textContent = currentQuestion.question;
    renderChoices(currentQuestion);

    // タイマー開始
    startTimer();
}

// タイマーゲージの初期化
function initTimerGauge() {
    // 既存のタイマーゲージを削除
    const existingContainer = document.querySelector(".timer-container");
    if (existingContainer) {
        existingContainer.remove();
    }
    
    // 新しいタイマーゲージを作成
    const timerContainer = document.createElement("div");
    timerContainer.classList.add("timer-container");
    
    const timerGauge = document.createElement("div");
    timerGauge.classList.add("timer-gauge");
    timerGauge.style.width = "100%";
    
    timerContainer.appendChild(timerGauge);
    DOM.quiz.timerContainer.parentNode.insertBefore(timerContainer, DOM.quiz.timerContainer);
}

// 選択肢の表示
function renderChoices(questionData) {
    DOM.quiz.choices.innerHTML = "";
    
    questionData.choices.forEach((choice, index) => {
        const button = document.createElement("button");
        button.textContent = choice;
        button.classList.add("game-button");
        button.onclick = () => checkAnswer(index);
        DOM.quiz.choices.appendChild(button);
    });
}

// タイマー開始
function startTimer() {
    // 最初のゲージ更新（遅延なしで即時反映）
    updateTimerGauge();
    
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        DOM.quiz.timeDisplay.textContent = gameState.timeLeft;
        
        // タイマーゲージの更新
        updateTimerGauge();
        
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            checkAnswer(-1); // 時間切れ
        }
    }, 1000);
}

// タイマーゲージの更新
function updateTimerGauge() {
    const gauge = document.querySelector(".timer-gauge");
    if (!gauge) return;
    
    // 表示秒数に正確に同期したゲージ幅を設定
    const percentage = (gameState.timeLeft / gameState.maxTime) * 100;
    gauge.style.width = `${percentage}%`;
    
    // 3秒以下で赤色に変更
    if (gameState.timeLeft <= 3) {
        gauge.classList.add("timer-critical");
    } else {
        gauge.classList.remove("timer-critical");
    }
}

// 回答チェック
function checkAnswer(index) {
    clearInterval(gameState.timer);
    const correctIndex = quizData[gameState.currentIndex].answer;
    const buttons = document.querySelectorAll("#game-choices-container .game-button");

    // ユーザーの回答を記録
    gameState.userAnswers.push({
        questionIndex: gameState.currentIndex,
        userAnswer: index
    });

    // 選択肢の色を変更
    buttons.forEach((button, i) => {
        if (i === correctIndex) {
            button.classList.add("game-correct");
        } else if (i === index && i !== correctIndex) {
            button.classList.add("game-wrong");
        }
        button.disabled = true;
    });

    // 正解なら得点を加算
    if (index === correctIndex) {
        gameState.score++;
        DOM.quiz.scoreDisplay.textContent = gameState.score;
        showCorrectFeedback();
    }

    setTimeout(nextQuestion, 1500);
}

// 正解エフェクト
function showCorrectFeedback() {
    const feedback = document.createElement("div");
    feedback.classList.add("correct-feedback");
    feedback.textContent = "正解！";
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 1000);
}

// 次の問題へ
function nextQuestion() {
    gameState.currentIndex++;
    if (gameState.currentIndex < quizData.length) {
        showQuestion();
    } else {
        showResult();
    }
}

// 結果画面表示
function showResult() {
    DOM.screens.quiz.style.display = "none";
    DOM.screens.result.style.display = "block";
    DOM.result.finalScore.textContent = `最終スコア: ${gameState.score}/${quizData.length}`;
    
    createResultTable();
}

// 結果テーブル作成
function createResultTable() {
    // 既存のテーブルがあれば削除
    const existingTable = document.querySelector(".result-table");
    if (existingTable) {
        existingTable.remove();
    }
    
    const table = document.createElement("table");
    table.classList.add("result-table");
    
    // テーブルヘッダーとボディを追加
    table.appendChild(createTableHeader());
    table.appendChild(createTableBody());
    
    // 再プレイボタンの前に挿入
    DOM.screens.result.insertBefore(table, DOM.buttons.restart);
}

// テーブルヘッダー作成
function createTableHeader() {
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    
    ["問題", "あなたの回答", "正解"].forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    return thead;
}

// テーブルボディ作成
function createTableBody() {
    const tbody = document.createElement("tbody");
    
    gameState.userAnswers.forEach(answer => {
        const row = document.createElement("tr");
        const questionData = quizData[answer.questionIndex];
        
        // 問題セル
        const questionCell = document.createElement("td");
        questionCell.textContent = questionData.question;
        row.appendChild(questionCell);
        
        // ユーザー回答セル
        row.appendChild(createUserAnswerCell(answer, questionData));
        
        // 正解セル
        row.appendChild(createCorrectAnswerCell(questionData));
        
        tbody.appendChild(row);
    });
    
    return tbody;
}

// ユーザー回答セル作成
function createUserAnswerCell(answer, questionData) {
    const userAnswerCell = document.createElement("td");
    const userAnswerIndex = answer.userAnswer;
    
    if (userAnswerIndex === -1) {
        userAnswerCell.textContent = "時間切れ";
        userAnswerCell.classList.add("answer-wrong");
    } else {
        userAnswerCell.textContent = questionData.choices[userAnswerIndex];
        
        if (userAnswerIndex === questionData.answer) {
            userAnswerCell.classList.add("answer-correct");
        } else {
            userAnswerCell.classList.add("answer-wrong");
        }
    }
    
    return userAnswerCell;
}

// 正解セル作成
function createCorrectAnswerCell(questionData) {
    const correctAnswerCell = document.createElement("td");
    correctAnswerCell.textContent = questionData.choices[questionData.answer];
    correctAnswerCell.classList.add("answer-correct");
    return correctAnswerCell;
}

// もう一度プレイ
function restartGame() {
    DOM.screens.result.style.display = "none";
    DOM.screens.quiz.style.display = "block";
    resetGameState();
    showQuestion();
}

// ゲーム初期化
initGame();