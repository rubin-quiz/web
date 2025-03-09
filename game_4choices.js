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
    animationId: null, // requestAnimationFrameのIDを保存
    userAnswers: [],
    answered: false, // 回答済みかどうかのフラグ
    questionCount: 5, // デフォルトは5問モード
    selectedQuestions: [] // ランダムに選択された問題
};

// DOM要素
const DOM = {
    screens: {
        start: document.getElementById("game-start-screen"),
        quiz: document.getElementById("game-quiz-screen"),
        result: document.getElementById("game-result-screen")
    },
    buttons: {
        mode5: document.getElementById("game-mode-5"),
        mode10: document.getElementById("game-mode-10"),
        restart: document.getElementById("game-restart"),
        return: document.getElementById("game-return")
    },
    quiz: {
        question: document.getElementById("game-question"),
        choices: document.getElementById("game-choices-container"),
        timeDisplay: document.getElementById("game-time-left"),
        scoreDisplay: document.getElementById("game-score-count"),
        currentQuestion: document.getElementById("current-question"),
        totalQuestions: document.getElementById("total-questions"),
        timerContainer: null // initTimerGaugeで動的に設定
    },
    result: {
        finalScore: document.getElementById("game-final-score")
    }
};

// イベントリスナーの設定
function initGame() {
    DOM.buttons.mode5.addEventListener("click", () => startGame(5));
    DOM.buttons.mode10.addEventListener("click", () => startGame(10));
    DOM.buttons.restart.addEventListener("click", restartGame);
    DOM.buttons.return.addEventListener("click", returnToModeSelection);
    
    // 初期表示設定
    DOM.screens.quiz.style.display = "none";
    DOM.screens.result.style.display = "none";
}

// ランダムに問題を選択
function selectRandomQuestions(count) {
    // 配列をコピーしてシャッフル
    const shuffled = [...quizData].sort(() => 0.5 - Math.random());
    // 必要な数だけ問題を取得
    return shuffled.slice(0, count);
}

// ゲーム開始
function startGame(questionCount) {
    DOM.screens.start.style.display = "none";
    DOM.screens.quiz.style.display = "block";
    
    // 問題数を設定
    gameState.questionCount = questionCount;
    DOM.quiz.totalQuestions.textContent = questionCount;
    
    resetGameState();
    showQuestion();
}

// ゲーム状態のリセット
function resetGameState() {
    // ランダムに問題を選択
    gameState.selectedQuestions = selectRandomQuestions(gameState.questionCount);
    
    gameState.currentIndex = 0;
    gameState.score = 0;
    gameState.timeLeft = gameState.maxTime;
    gameState.userAnswers = [];
    gameState.answered = false;
    
    DOM.quiz.scoreDisplay.textContent = "0";
    DOM.quiz.currentQuestion.textContent = "1";
}

// 問題表示
function showQuestion() {
    // タイマーをクリア
    clearInterval(gameState.timer);
    cancelAnimationFrame(gameState.animationId);
    
    // 回答済みフラグをリセット
    gameState.answered = false;
    
    // タイマーを初期化
    gameState.timeLeft = gameState.maxTime;
    DOM.quiz.timeDisplay.textContent = gameState.timeLeft;
    
    // タイマーゲージを初期化
    initTimerGauge();

    // 現在の問題番号を更新
    DOM.quiz.currentQuestion.textContent = gameState.currentIndex + 1;

    // 問題と選択肢を表示
    const currentQuestion = gameState.selectedQuestions[gameState.currentIndex];
    DOM.quiz.question.textContent = currentQuestion.question;
    
    // アニメーション効果のクラスを追加
    DOM.quiz.question.classList.add('question-appear');
    
    // アニメーション終了後にクラスを削除（次回のために）
    setTimeout(() => {
        DOM.quiz.question.classList.remove('question-appear');
    }, 500);
    
    // 選択肢を表示
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
    
    // タイマー表示の前に挿入
    const timerDisplay = document.getElementById("game-timer");
    timerDisplay.parentNode.insertBefore(timerContainer, timerDisplay);
    
    // DOMオブジェクトに格納
    DOM.quiz.timerContainer = timerContainer;
}

// 選択肢の表示
function renderChoices(questionData) {
    DOM.quiz.choices.innerHTML = "";
    
    questionData.choices.forEach((choice, index) => {
        const button = document.createElement("button");
        button.textContent = choice;
        button.classList.add("game-button");
        // data-indexを設定
        button.setAttribute("data-index", String.fromCharCode(65 + index)); // A, B, C, Dのようにアルファベットで表示
        button.onclick = () => checkAnswer(index);
        DOM.quiz.choices.appendChild(button);
    });
}

// タイマー開始
function startTimer() {
    const startTime = Date.now();
    const duration = gameState.maxTime * 1000; // ミリ秒に変換
    
    // 最初のゲージ更新（遅延なしで即時反映）
    updateTimerGauge(100);
    
    // 1秒ごとの表示更新用タイマー
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        DOM.quiz.timeDisplay.textContent = gameState.timeLeft;
        
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            cancelAnimationFrame(gameState.animationId);
            checkAnswer(-1); // 時間切れ
        }
    }, 1000);
    
    // アニメーションフレームを使った滑らかなゲージ更新
    function animate() {
        const elapsedTime = Date.now() - startTime;
        const remainingPercentage = Math.max(0, 100 - (elapsedTime / duration * 100));
        
        updateTimerGauge(remainingPercentage);
        
        if (remainingPercentage > 0 && gameState.timeLeft > 0 && !gameState.answered) {
            gameState.animationId = requestAnimationFrame(animate);
        }
    }
    
    gameState.animationId = requestAnimationFrame(animate);
}

// タイマーゲージの更新
function updateTimerGauge(percentage) {
    const gauge = document.querySelector(".timer-gauge");
    if (!gauge) return;
    
    // 渡されたパーセンテージでゲージ幅を設定
    gauge.style.width = `${percentage}%`;
    
    // 30%以下で赤色に変更
    if (percentage <= 30) {
        gauge.classList.add("timer-critical");
    } else {
        gauge.classList.remove("timer-critical");
    }
}

// 回答チェック
function checkAnswer(index) {
    // 既に回答済みの場合は処理しない
    if (gameState.answered) return;
    
    // 回答済みにする
    gameState.answered = true;
    
    clearInterval(gameState.timer);
    cancelAnimationFrame(gameState.animationId); // アニメーションをキャンセル
    
    const currentQuestion = gameState.selectedQuestions[gameState.currentIndex];
    const correctIndex = currentQuestion.answer;
    const buttons = document.querySelectorAll("#game-choices-container .game-button");

    // ユーザーの回答を記録
    gameState.userAnswers.push({
        question: currentQuestion.question,
        choices: currentQuestion.choices,
        correctIndex: correctIndex,
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
    if (gameState.currentIndex < gameState.questionCount) {
        showQuestion();
    } else {
        showResult();
    }
}

// 結果画面表示
function showResult() {
    DOM.screens.quiz.style.display = "none";
    DOM.screens.result.style.display = "block";
    
    // スコア表示を整形
    const scoreText = `${gameState.score}/${gameState.questionCount}`;
    DOM.result.finalScore.textContent = `Score: ${scoreText}`;
    
    // 合格/不合格の判定
    const passPercent = 80; // 80%以上で合格
    const userPercent = (gameState.score / gameState.questionCount) * 100;
    
    if (userPercent >= passPercent) {
        DOM.result.finalScore.innerHTML += `<br><span style="color:var(--correct-color);font-size:1.2rem;">合格！おめでとうございます！</span>`;
    } else {
        DOM.result.finalScore.innerHTML += `<br><span style="color:var(--wrong-color);font-size:1.2rem;">不合格です！もう一度チャレンジしてみよう！</span>`;
    }
    
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
    const restartButtons = document.querySelector(".restart-buttons");
    DOM.screens.result.insertBefore(table, restartButtons);
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
    
    gameState.userAnswers.forEach((answer, index) => {
        const row = document.createElement("tr");
        
        // 問題セル
        const questionCell = document.createElement("td");
        questionCell.textContent = answer.question;
        row.appendChild(questionCell);
        
        // ユーザー回答セル
        row.appendChild(createUserAnswerCell(answer));
        
        // 正解セル
        row.appendChild(createCorrectAnswerCell(answer));
        
        tbody.appendChild(row);
    });
    
    return tbody;
}

// ユーザー回答セル作成
function createUserAnswerCell(answer) {
    const userAnswerCell = document.createElement("td");
    const userAnswerIndex = answer.userAnswer;
    
    if (userAnswerIndex === -1) {
        userAnswerCell.textContent = "時間切れ";
        userAnswerCell.classList.add("answer-wrong");
    } else {
        userAnswerCell.textContent = answer.choices[userAnswerIndex];
        
        if (userAnswerIndex === answer.correctIndex) {
            userAnswerCell.classList.add("answer-correct");
        } else {
            userAnswerCell.classList.add("answer-wrong");
        }
    }
    
    return userAnswerCell;
}

// 正解セル作成
function createCorrectAnswerCell(answer) {
    const correctAnswerCell = document.createElement("td");
    correctAnswerCell.textContent = answer.choices[answer.correctIndex];
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

// モード選択画面に戻る
function returnToModeSelection() {
    DOM.screens.result.style.display = "none";
    DOM.screens.start.style.display = "block";
}

// ゲーム初期化
document.addEventListener('DOMContentLoaded', initGame);