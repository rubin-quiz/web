/**
 * UI関連の機能を管理するモジュール
 */
import { DOM, showScreen } from './game_4choices_domElements.js';
import { gameState, incrementScore } from './game_4choices_gameState.js';
import { quizDataByGenre } from './game_4choices_data.js';
import { checkAnswerByCorrectFlag, nextQuestion, timeOut } from './game_4choices_gameLogic.js';

/**
 * ジャンル選択ボタンを作成
 */
export function createGenreButtons() {
    const container = DOM.buttons.genreButtons;
    container.innerHTML = ""; // 既存のボタンをクリア
    
    Object.keys(quizDataByGenre).forEach(genre => {
        const button = document.createElement("button");
        button.textContent = genre;
        button.className = "mode-button";
        button.addEventListener("click", () => selectGenre(genre));
        container.appendChild(button);
    });
}

/**
 * ジャンル選択時の処理
 * @param {string} genre 選択されたジャンル
 */
export function selectGenre(genre) {
    // gameState.jsのインポート関数を使用
    import('./gameState.js').then(module => {
        module.setCurrentGenre(genre);
    });
    
    showScreen('mode');
    DOM.quiz.genreTitle.textContent = genre;
}

/**
 * 選択肢をレンダリング
 * @param {Object} questionData 問題データ
 */
export function renderChoices(questionData) {
    DOM.quiz.choices.innerHTML = "";
    
    // 選択肢と正解のインデックスをペアにして配列を作成
    const choicesWithCorrectIndex = questionData.choices.map((choice, index) => {
        return {
            text: choice,
            isCorrect: index === questionData.answer
        };
    });
    
    // 選択肢をシャッフル
    const shuffledChoices = [...choicesWithCorrectIndex].sort(() => 0.5 - Math.random());
    
    // シャッフルした選択肢を表示
    shuffledChoices.forEach((choiceObj, index) => {
        const button = document.createElement("button");
        button.textContent = choiceObj.text;
        button.classList.add("game-button");
        button.setAttribute("data-index", String.fromCharCode(65 + index)); // A, B, C, Dのようにアルファベットで表示
        
        // 正解かどうかの情報を使って回答チェック
        button.onclick = () => checkAnswerByCorrectFlag(choiceObj.isCorrect, button);
        
        DOM.quiz.choices.appendChild(button);
    });
}

/**
 * 問題表示
 */
export function showQuestion() {
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
    
    // 問題番号をdata属性として設定
    DOM.quiz.question.setAttribute('data-question-number', 'Q' + (gameState.currentIndex + 1));
    
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

/**
 * タイマーゲージの初期化
 */
export function initTimerGauge() {
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

/**
 * タイマー開始
 */
export function startTimer() {
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
            timeOut();
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

/**
 * タイマーゲージの更新
 * @param {number} percentage ゲージの割合（0-100）
 */
export function updateTimerGauge(percentage) {
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

/**
 * 正解エフェクト表示
 */
export function showCorrectFeedback() {
    const feedback = document.createElement("div");
    feedback.classList.add("correct-feedback");
    feedback.textContent = "正解！";
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 1000);
}

/**
 * 結果画面表示
 */
export function showResult() {
    showScreen('result');
    
    // スコア表示を整形
    const scoreText = `${gameState.score}/${gameState.questionCount}`;
    DOM.result.finalScore.textContent = `Score: ${scoreText}`;
    
    // 合格/不合格の判定
    const passPercent = 80; // 80%以上で合格
    const userPercent = (gameState.score / gameState.questionCount) * 100;
    
    let resultMessage;
    if (userPercent >= passPercent) {
        resultMessage = "合格！おめでとうございます！";
        DOM.result.finalScore.innerHTML += `<br><span style="color:var(--correct-color);font-size:1.2rem;">${resultMessage}</span>`;
    } else {
        resultMessage = "不合格です！もう一度チャレンジしてみよう！";
        DOM.result.finalScore.innerHTML += `<br><span style="color:var(--wrong-color);font-size:1.2rem;">${resultMessage}</span>`;
    }
    
    // X共有ボタンの追加
    addTwitterSharingButton(gameState.score, gameState.questionCount, resultMessage);
    
    createResultTable();
}

/**
 * X（Twitter）共有ボタンの追加
 * @param {number} score スコア
 * @param {number} totalQuestions 総問題数
 * @param {string} resultMessage 結果メッセージ
 */
export function addTwitterSharingButton(score, totalQuestions, resultMessage) {
    // 既存の共有ボタンがあれば削除
    const existingShareContainer = document.getElementById('twitter-share-container');
    if (existingShareContainer) {
        existingShareContainer.remove();
    }
    
    // 共有コンテナの作成
    const shareContainer = document.createElement('div');
    shareContainer.id = 'twitter-share-container';
    
    // 共有テキストの作成
    const shareText = `【ルビンの思うつぼ】4択クイズ(${totalQuestions}問モード)に挑戦し、${score}点を獲得しました！みんなもプレイしてみてね！`;
    const shareUrl = 'https://rubin-quiz.github.io/web/game_4choices.html';
    
    // Xボタンの作成
    const twitterButton = document.createElement('button');
    twitterButton.className = 'twitter-share-button';
    twitterButton.textContent = 'Xでシェア';
    
    twitterButton.addEventListener('click', () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(twitterUrl, '_blank');
    });
    
    // ボタンを追加
    shareContainer.appendChild(twitterButton);
    
    // 共有コンテナを結果画面に追加
    const restartButtonsContainer = document.querySelector('.restart-buttons');
    DOM.screens.result.insertBefore(shareContainer, restartButtonsContainer);
}

/**
 * 結果テーブル作成
 */
export function createResultTable() {
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

/**
 * テーブルヘッダー作成
 * @return {HTMLTableSectionElement} テーブルヘッダー要素
 */
export function createTableHeader() {
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

/**
 * テーブルボディ作成
 * @return {HTMLTableSectionElement} テーブルボディ要素
 */
export function createTableBody() {
    const tbody = document.createElement("tbody");
    
    gameState.userAnswers.forEach((answer) => {
        const row = document.createElement("tr");
        
        // 問題セル
        const questionCell = document.createElement("td");
        questionCell.textContent = answer.question;
        row.appendChild(questionCell);
        
        // ユーザー回答セル
        const userAnswerCell = document.createElement("td");
        if (!answer.userAnswer) {
            userAnswerCell.textContent = "時間切れ";
            userAnswerCell.classList.add("answer-wrong");
        } else {
            userAnswerCell.textContent = answer.userAnswer;
            
            if (answer.userAnswer === answer.correctAnswer) {
                userAnswerCell.classList.add("answer-correct");
            } else {
                userAnswerCell.classList.add("answer-wrong");
            }
        }
        row.appendChild(userAnswerCell);
        
        // 正解セル
        const correctAnswerCell = document.createElement("td");
        correctAnswerCell.textContent = answer.correctAnswer;
        correctAnswerCell.classList.add("answer-correct");
        row.appendChild(correctAnswerCell);
        
        tbody.appendChild(row);
    });
    
    return tbody;
}