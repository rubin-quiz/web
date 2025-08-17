/**
 * ゲームロジックを管理するモジュール
 */
import { DOM, showScreen } from './game_4choices_domElements.js';
import { gameState, incrementScore, recordAnswer, moveToNextQuestion } from './game_4choices_gameState.js';
import { showCorrectFeedback, showQuestion, showResult } from './game_4choices_gameUI.js';
import { selectRandomQuestions } from './data.js';

/**
 * 正解フラグによる回答チェック
 * @param {boolean} isCorrect 正解かどうか
 * @param {HTMLElement} selectedButton 選択されたボタン
 */
export function checkAnswerByCorrectFlag(isCorrect, selectedButton) {
    // 既に回答済みの場合は処理しない
    if (gameState.answered) return;
    
    // 回答済みにする
    gameState.answered = true;
    
    // タイマーをクリア
    clearInterval(gameState.timer);
    cancelAnimationFrame(gameState.animationId);
    
    const currentQuestion = gameState.selectedQuestions[gameState.currentIndex];
    const buttons = document.querySelectorAll("#game-choices-container .game-button");
    
    // ユーザーの回答を記録
    const displayedChoices = [...buttons].map(b => b.textContent);
    recordAnswer(
        currentQuestion, 
        displayedChoices, 
        selectedButton ? selectedButton.textContent : null
    );

    // 選択肢の色を変更
    buttons.forEach((button) => {
        if (button.textContent === currentQuestion.choices[currentQuestion.answer]) {
            button.classList.add("game-correct");
        } else if (button === selectedButton && !isCorrect) {
            button.classList.add("game-wrong");
        }
        button.disabled = true;
    });

    // 正解なら得点を加算
    if (isCorrect) {
        incrementScore();
        DOM.quiz.scoreDisplay.textContent = gameState.score;
        showCorrectFeedback();
    }

    setTimeout(nextQuestion, 1500);
}

/**
 * 時間切れ処理
 */
export function timeOut() {
    if (gameState.answered) return;
    
    gameState.answered = true;
    
    const currentQuestion = gameState.selectedQuestions[gameState.currentIndex];
    const buttons = document.querySelectorAll("#game-choices-container .game-button");
    
    // ユーザーの回答を記録
    const displayedChoices = [...buttons].map(b => b.textContent);
    recordAnswer(currentQuestion, displayedChoices, null);
    
    // 正解の選択肢を強調表示
    buttons.forEach((button) => {
        if (button.textContent === currentQuestion.choices[currentQuestion.answer]) {
            button.classList.add("game-correct");
        }
        button.disabled = true;
    });
    
    setTimeout(nextQuestion, 1500);
}

/**
 * 次の問題へ
 */
export function nextQuestion() {
    const isLastQuestion = moveToNextQuestion();
    
    if (isLastQuestion) {
        showResult();
    } else {
        showQuestion();
    }
}

/**
 * ゲーム開始
 * @param {number} questionCount 出題する問題数
 */
export function startGame(questionCount) {
    showScreen('quiz');
    
    // 問題数を設定
    import('./gameState.js').then(module => {
        module.setQuestionCount(questionCount);
    });
    
    DOM.quiz.totalQuestions.textContent = questionCount;
    
    const selectedQuestions = selectRandomQuestions(gameState.currentGenre, questionCount);
    
    // gameState.jsのインポート関数を使用してゲーム状態をリセット
    import('./gameState.js').then(module => {
        module.resetGameState(selectedQuestions);
    });
    
    DOM.quiz.scoreDisplay.textContent = "0";
    DOM.quiz.currentQuestion.textContent = "1";
    
    showQuestion();
}

/**
 * リスタート機能（結果画面から同じモードで再プレイ）
 */
export function restartGame() {
    showScreen('quiz');
    
    const selectedQuestions = selectRandomQuestions(gameState.currentGenre, gameState.questionCount);
    
    // gameState.jsのインポート関数を使用してゲーム状態をリセット
    import('./gameState.js').then(module => {
        module.resetGameState(selectedQuestions);
    });
    
    DOM.quiz.scoreDisplay.textContent = "0";
    DOM.quiz.currentQuestion.textContent = "1";
    
    showQuestion();
}

/**
 * ジャンル選択に戻る
 */
export function returnToGenreSelection() {
    showScreen('genre');
}

/**
 * 問題数選択に戻る
 */
export function returnToModeSelection() {
    showScreen('mode');
}