/**
 * DOM要素の参照を管理するモジュール
 */

// DOM要素をまとめたオブジェクト
export const DOM = {
    screens: {
        genre: document.getElementById("game-genre-screen"),
        mode: document.getElementById("game-mode-screen"),
        quiz: document.getElementById("game-quiz-screen"),
        result: document.getElementById("game-result-screen")
    },
    buttons: {
        genreButtons: document.getElementById("genre-buttons-container"),
        mode5: document.getElementById("game-mode-5"),
        mode10: document.getElementById("game-mode-10"),
        restart: document.getElementById("game-restart"),
        returnToGenre: {
            fromMode: document.getElementById("game-return-to-genre"),
            fromResult: document.getElementById("game-result-to-genre")
        },
        returnToMode: document.getElementById("game-result-to-mode")
    },
    quiz: {
        genreTitle: document.getElementById("game-mode-title"),
        question: document.getElementById("game-question"),
        choices: document.getElementById("game-choices-container"),
        timeDisplay: document.getElementById("game-time-left"),
        scoreDisplay: document.getElementById("game-score-count"),
        currentQuestion: document.getElementById("current-question"),
        totalQuestions: document.getElementById("total-questions"),
        timerContainer: null
    },
    result: {
        finalScore: document.getElementById("game-final-score"),
        resultsContainer: document.getElementById("game-results-container")
    }
};

/**
 * DOM要素を表示
 * @param {HTMLElement} element 表示する要素
 */
export function showElement(element) {
    if (element) {
        element.style.display = "block";
    }
}

/**
 * DOM要素を非表示
 * @param {HTMLElement} element 非表示にする要素
 */
export function hideElement(element) {
    if (element) {
        element.style.display = "none";
    }
}

/**
 * 特定の画面を表示し、他の画面を非表示にする
 * @param {string} screenName 表示する画面名（'genre', 'mode', 'quiz', 'result'）
 */
export function showScreen(screenName) {
    Object.entries(DOM.screens).forEach(([name, screen]) => {
        if (name === screenName) {
            showElement(screen);
        } else {
            hideElement(screen);
        }
    });
}