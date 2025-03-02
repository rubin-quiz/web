// クイズデータ - ウェルノウンポート番号の問題を多数追加
const gameQuestions = [
    {
        gameQuestion: "HTTPのポート番号は？",
        gameChoices: ["21", "80", "443", "22"],
        gameAnswer: 1
    },
    {
        gameQuestion: "HTTPSのポート番号は？",
        gameChoices: ["80", "443", "8080", "22"],
        gameAnswer: 1
    },
    {
        gameQuestion: "FTPのポート番号は？",
        gameChoices: ["20/21", "22", "23", "25"],
        gameAnswer: 0
    },
    {
        gameQuestion: "SSHのポート番号は？",
        gameChoices: ["21", "22", "23", "25"],
        gameAnswer: 1
    },
    {
        gameQuestion: "Telnetのポート番号は？",
        gameChoices: ["21", "22", "23", "25"],
        gameAnswer: 2
    },
    {
        gameQuestion: "SMTPのポート番号は？",
        gameChoices: ["21", "23", "25", "110"],
        gameAnswer: 2
    },
    {
        gameQuestion: "DNSのポート番号は？",
        gameChoices: ["43", "53", "67", "69"],
        gameAnswer: 1
    },
    {
        gameQuestion: "DHCPのポート番号は？",
        gameChoices: ["53", "67/68", "69", "80"],
        gameAnswer: 1
    },
    {
        gameQuestion: "POP3のポート番号は？",
        gameChoices: ["25", "110", "143", "389"],
        gameAnswer: 1
    },
    {
        gameQuestion: "IMAPのポート番号は？",
        gameChoices: ["110", "143", "389", "443"],
        gameAnswer: 1
    },
    {
        gameQuestion: "SNMPのポート番号は？",
        gameChoices: ["161/162", "389", "443", "636"],
        gameAnswer: 0
    },
    {
        gameQuestion: "LDAPのポート番号は？",
        gameChoices: ["161", "389", "443", "636"],
        gameAnswer: 1
    },
];

// ゲーム変数
let gameCurrentIndex = 0;
let gameScore = 0;
let gameTimeLeft = 10;
let gameTimer;
let userAnswers = [];

// 各画面の取得
const gameStartScreen = document.getElementById("game-start-screen");
const gameQuizScreen = document.getElementById("game-quiz-screen");
const gameResultScreen = document.getElementById("game-result-screen");

// スタートボタン
document.getElementById("game-start").addEventListener("click", startGame);

// もう一度プレイボタン
document.getElementById("game-restart").addEventListener("click", restartGame);

// ゲーム開始
function startGame() {
    gameStartScreen.style.display = "none";
    gameQuizScreen.style.display = "block";
    gameCurrentIndex = 0;
    gameScore = 0;
    userAnswers = [];
    showGameQuestion();
}

// 問題を表示する関数
function showGameQuestion() {
    clearInterval(gameTimer);
    gameTimeLeft = 10;
    document.getElementById("game-time-left").textContent = gameTimeLeft;

    // タイマーゲージをリセット
    const timerGauge = document.querySelector(".timer-gauge");
    if (timerGauge) {
        timerGauge.style.width = "100%";
        timerGauge.classList.remove("timer-critical");
    }

    const gameCurrentQuestion = gameQuestions[gameCurrentIndex];

    document.getElementById("game-question").textContent = gameCurrentQuestion.gameQuestion;

    const gameChoicesContainer = document.getElementById("game-choices-container");
    gameChoicesContainer.innerHTML = "";

    gameCurrentQuestion.gameChoices.forEach((gameChoice, gameIndex) => {
        const gameButton = document.createElement("button");
        gameButton.textContent = gameChoice;
        gameButton.classList.add("game-button");
        gameButton.onclick = () => checkGameAnswer(gameIndex);
        gameChoicesContainer.appendChild(gameButton);
    });

    // タイマーゲージの設定
    updateTimerGauge();

    gameTimer = setInterval(() => {
        gameTimeLeft--;
        document.getElementById("game-time-left").textContent = gameTimeLeft;
        
        // タイマーゲージの更新
        updateTimerGauge();
        
        if (gameTimeLeft <= 0) {
            checkGameAnswer(-1);
        }
    }, 1000);
}

// タイマーゲージの更新
function updateTimerGauge() {
    const timerContainer = document.querySelector(".timer-container");
    
    // タイマーコンテナがなければ作成
    if (!timerContainer) {
        const newTimerContainer = document.createElement("div");
        newTimerContainer.classList.add("timer-container");
        
        const timerGauge = document.createElement("div");
        timerGauge.classList.add("timer-gauge");
        
        newTimerContainer.appendChild(timerGauge);
        
        // タイマー表示の前に挿入
        const timerDisplay = document.getElementById("game-timer");
        timerDisplay.parentNode.insertBefore(newTimerContainer, timerDisplay);
    }
    
    // ゲージの更新
    const gauge = document.querySelector(".timer-gauge");
    if (gauge) {
        const percentage = (gameTimeLeft / 10) * 100;
        gauge.style.width = `${percentage}%`;
        
        // 3秒以下で赤色に変更
        if (gameTimeLeft <= 3) {
            gauge.classList.add("timer-critical");
        } else {
            gauge.classList.remove("timer-critical");
        }
    }
}

// 回答チェック
function checkGameAnswer(gameIndex) {
    clearInterval(gameTimer);
    const gameCorrectIndex = gameQuestions[gameCurrentIndex].gameAnswer;
    const gameButtons = document.querySelectorAll("#game-choices-container .game-button");

    // ユーザーの回答を記録
    userAnswers.push({
        questionIndex: gameCurrentIndex,
        userAnswer: gameIndex
    });

    gameButtons.forEach((gameButton, i) => {
        if (i === gameCorrectIndex) {
            gameButton.classList.add("game-correct");
        } else if (i === gameIndex && i !== gameCorrectIndex) {
            gameButton.classList.add("game-wrong");
        }
        gameButton.disabled = true;
    });

    if (gameIndex === gameCorrectIndex) {
        gameScore++;
        document.getElementById("game-score-count").textContent = gameScore;
        
        // 正解エフェクトの表示
        showCorrectFeedback();
    }

    // 正解後のタイマーリセットは不要なので削除
    // ゲージを現在の状態で維持
    setTimeout(nextGameQuestion, 1500);
}

// 正解エフェクトの表示
function showCorrectFeedback() {
    const feedback = document.createElement("div");
    feedback.classList.add("correct-feedback");
    feedback.textContent = "正解！";
    document.body.appendChild(feedback);
    
    // 1秒後に削除
    setTimeout(() => {
        feedback.remove();
    }, 1000);
}

// 次の問題へ
function nextGameQuestion() {
    gameCurrentIndex++;
    if (gameCurrentIndex < gameQuestions.length) {
        showGameQuestion();
    } else {
        showGameResult();
    }
}

// ゲーム終了時の処理
function showGameResult() {
    gameQuizScreen.style.display = "none";
    gameResultScreen.style.display = "block";
    document.getElementById("game-final-score").textContent = `最終スコア: ${gameScore}/${gameQuestions.length}`;
    
    // 問題と回答の表を作成
    createResultTable();
}

// 結果テーブルの作成
function createResultTable() {
    const resultContainer = document.getElementById("game-result-screen");
    
    // 既存のテーブルがあれば削除
    const existingTable = document.querySelector(".result-table");
    if (existingTable) {
        existingTable.remove();
    }
    
    const table = document.createElement("table");
    table.classList.add("result-table");
    
    // テーブルヘッダー
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["問題", "あなたの回答", "正解"].forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // テーブルボディ
    const tbody = document.createElement("tbody");
    userAnswers.forEach(answer => {
        const row = document.createElement("tr");
        
        // 問題
        const questionCell = document.createElement("td");
        questionCell.textContent = gameQuestions[answer.questionIndex].gameQuestion;
        row.appendChild(questionCell);
        
        // ユーザーの回答
        const userAnswerCell = document.createElement("td");
        const userAnswerIndex = answer.userAnswer;
        if (userAnswerIndex === -1) {
            userAnswerCell.textContent = "時間切れ";
            userAnswerCell.classList.add("answer-wrong");
        } else {
            userAnswerCell.textContent = gameQuestions[answer.questionIndex].gameChoices[userAnswerIndex];
            if (userAnswerIndex === gameQuestions[answer.questionIndex].gameAnswer) {
                userAnswerCell.classList.add("answer-correct");
            } else {
                userAnswerCell.classList.add("answer-wrong");
            }
        }
        row.appendChild(userAnswerCell);
        
        // 正解
        const correctAnswerCell = document.createElement("td");
        const correctIndex = gameQuestions[answer.questionIndex].gameAnswer;
        correctAnswerCell.textContent = gameQuestions[answer.questionIndex].gameChoices[correctIndex];
        correctAnswerCell.classList.add("answer-correct");
        row.appendChild(correctAnswerCell);
        
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    
    // 再プレイボタンの前に挿入
    const restartButton = document.getElementById("game-restart");
    resultContainer.insertBefore(table, restartButton);
}

// もう一度プレイ
function restartGame() {
    gameResultScreen.style.display = "none";
    gameQuizScreen.style.display = "block";
    gameCurrentIndex = 0;
    gameScore = 0;
    userAnswers = [];
    document.getElementById("game-score-count").textContent = "0";
    showGameQuestion();
}