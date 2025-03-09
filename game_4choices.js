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
    answered: false // 回答済みかどうかのフラグ
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
        timerContainer: null // initTimerGaugeで動的に設定
    },
    result: {
        finalScore: document.getElementById("game-final-score")
    }
};

const settings = {
    soundEnabled: true // デフォルトでは音を有効に
};

// DOM要素に音設定ボタンを追加
function addSoundToggle() {
    // 開始画面に設定ボタンを追加
    const soundToggle = document.createElement("button");
    soundToggle.id = "sound-toggle";
    soundToggle.classList.add("settings-button");
    soundToggle.innerHTML = '<span class="material-symbols-outlined">volume_up</span>';
    soundToggle.title = "音のオン/オフ";
    soundToggle.onclick = toggleSound;
    
    // ボタンを開始画面に追加
    DOM.screens.start.appendChild(soundToggle);
    
    // 結果画面にも同じボタンを追加
    const resultSoundToggle = soundToggle.cloneNode(true);
    resultSoundToggle.onclick = toggleSound;
    DOM.screens.result.appendChild(resultSoundToggle);
    
    // クイズ画面にも同じボタンを追加
    const quizSoundToggle = soundToggle.cloneNode(true);
    quizSoundToggle.onclick = toggleSound;
    DOM.screens.quiz.appendChild(quizSoundToggle);
    
    // 設定を読み込む（ローカルストレージから）
    loadSettings();
    
    // ボタンの見た目を更新
    updateSoundToggleUI();
}

// 音のオン/オフ切り替え
function toggleSound() {
    settings.soundEnabled = !settings.soundEnabled;
    saveSettings();
    updateSoundToggleUI();
}

// 音設定のUI更新
function updateSoundToggleUI() {
    const buttons = document.querySelectorAll("#sound-toggle");
    buttons.forEach(button => {
        if (settings.soundEnabled) {
            button.innerHTML = '<span class="material-symbols-outlined">volume_up</span>';
        } else {
            button.innerHTML = '<span class="material-symbols-outlined">volume_off</span>';
        }
    });
}

// 設定の保存（ローカルストレージ使用）
function saveSettings() {
    localStorage.setItem('quizGameSettings', JSON.stringify(settings));
}

// 設定の読み込み
function loadSettings() {
    const savedSettings = localStorage.getItem('quizGameSettings');
    if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        settings.soundEnabled = parsedSettings.soundEnabled;
    }
}

// 効果音再生関数の修正
function playSound(sound) {
    if (settings.soundEnabled && window.soundEffects && window.soundEffects[sound]) {
        window.soundEffects[sound].play().catch(e => console.log('効果音の再生に失敗:', e));
    }
}

// イベントリスナーの設定
function initGame() {
    DOM.buttons.start.addEventListener("click", startGame);
    DOM.buttons.restart.addEventListener("click", restartGame);
    
    // 初期表示設定
    DOM.screens.quiz.style.display = "none";
    DOM.screens.result.style.display = "none";

    // 音設定ボタンを追加
    addSoundToggle();
    
    // 画面がロードされた時に要素が存在することを確認
    window.addEventListener('DOMContentLoaded', () => {
        preloadSoundEffects();
    });
}

// 効果音のプリロード
function preloadSoundEffects() {
    // 効果音のオブジェクトを作成（オプション）
    window.soundEffects = {
        correct: new Audio('data:audio/wav;base64,UklGRqQIAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YYAIAACAgICAgICAgICAgICAgICAgICAgICAAICKiorDw8Pm5uby8vLm5ubDw8OKiooAgICAgICAgICAgICAgICAgICAgICAgACAioqKw8PD5ubm8vLy5ubmw8PDioqKAICAgICAgICAgICAgICAgICAgICAgIAAgIqKisPDw+bm5vLy8ubm5sPDw4qKigCAgICAgICAgICAgICAgICAgICAgICAgAAA//8AAAAAAAAAAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NAAkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJAA0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NAAAMDAwMDAwMDAwMDAwMDAwMDAwMDAwMAA0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NAAAMDAwMDAwMDAwMDAwMDAwMDAwMDAwMAAkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJAA='),
        wrong: new Audio('data:audio/wav;base64,UklGRgQGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YeAFAAAAAAAAAAAAAAAAAACAgICAgICAgICAgICAgICAgICAgICAgAAAAAAAAAAAAACAgICAgICAgICAgICAgICAgICAgICAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwMDA////////////////wMDAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwMDA////////////////wMDAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwMDA////////////////wMDAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwMDA////////////////wMDAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwMDA////////////////wMDAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwMDA////////////////wMDAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwMDA////////////////wMDAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwMDA////////////////wMDAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwMDA////////////////wMDAwAAAAAAAAAAAJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQAP//////////////////////////////////////////AJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQAP//////////////////////////////////////////AJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQAP//////////////////////////////////////////AJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQAP//////////////////////////////////////////AJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQAP//////////////////////////////////////////AJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQAP//////////////////////////////////////////AJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQAP//////////////////////////////////////////AJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQAP//////////////////////////////////////////AJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQAP//////////////////////////////////////////AJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQAP//////////////////////////////////////////AJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQAP//////////////////////////////////////////AJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQAP//////////////////////////////////////////AJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQAP//////////////////////////////////////////AJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQAP//////////////////////////////////////////AJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQAP//////////////////////////////////////////AJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQAP//////////////////////////////////////////AJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQAP//////////////////////////////////////////AJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQAP//////////////////////////////////////////AJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQAP//////////////////////////////////////////AJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQAP//////////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//////////////////////////////////////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=')
    };
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
    gameState.answered = false;
    DOM.quiz.scoreDisplay.textContent = "0";
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

    // 問題と選択肢を表示
    const currentQuestion = quizData[gameState.currentIndex];
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
        
        // 正解の効果音を再生
        playSound('correct');
    } else {
        // 不正解の効果音を再生
        playSound('wrong');
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
    
    // スコア表示を整形
    const scoreText = `${gameState.score}/${quizData.length}`;
    DOM.result.finalScore.textContent = `最終スコア: ${scoreText}`;
    
    // 合格/不合格の判定（オプション）
    const passPercent = 70; // 70%以上で合格
    const userPercent = (gameState.score / quizData.length) * 100;
    
    if (userPercent >= passPercent) {
        DOM.result.finalScore.innerHTML += `<br><span style="color:var(--correct-color);font-size:1.2rem;">合格！おめでとうございます！</span>`;
    } else {
        DOM.result.finalScore.innerHTML += `<br><span style="color:var(--wrong-color);font-size:1.2rem;">もう少し頑張りましょう！</span>`;
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
document.addEventListener('DOMContentLoaded', initGame);