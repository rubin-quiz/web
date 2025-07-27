/**
 * ゲーム状態を管理するモジュール
 */

// ゲーム状態のデフォルト設定
const DEFAULT_GAME_STATE = {
    currentGenre: "",
    currentIndex: 0,
    score: 0,
    timeLeft: 10,
    maxTime: 10,
    timer: null,
    animationId: null,
    userAnswers: [],
    answered: false,
    questionCount: 5,
    selectedQuestions: []
};

// ゲーム状態オブジェクト
export const gameState = {...DEFAULT_GAME_STATE};

/**
 * ゲーム状態をリセット
 * @param {Array} selectedQuestions ランダムに選択された問題配列
 */
export function resetGameState(selectedQuestions) {
    // ゲーム状態を初期化
    Object.assign(gameState, {
        ...DEFAULT_GAME_STATE,
        currentGenre: gameState.currentGenre,
        questionCount: gameState.questionCount,
        selectedQuestions
    });
}

/**
 * 回答を記録
 * @param {Object} questionData 現在の問題データ
 * @param {Array} displayedChoices 表示されている選択肢
 * @param {string|null} userAnswer ユーザーの回答（時間切れの場合はnull）
 */
export function recordAnswer(questionData, displayedChoices, userAnswer) {
    gameState.userAnswers.push({
        question: questionData.question,
        choices: displayedChoices,
        correctAnswer: questionData.choices[questionData.answer],
        userAnswer: userAnswer
    });
}

/**
 * スコアを加算
 */
export function incrementScore() {
    gameState.score++;
}

/**
 * 次の問題へ進む
 * @return {boolean} 最後の問題だったかどうか
 */
export function moveToNextQuestion() {
    gameState.currentIndex++;
    return gameState.currentIndex >= gameState.questionCount;
}

/**
 * 現在のジャンルを設定
 * @param {string} genre 選択されたジャンル
 */
export function setCurrentGenre(genre) {
    gameState.currentGenre = genre;
}

/**
 * 問題数を設定
 * @param {number} count 問題数
 */
export function setQuestionCount(count) {
    gameState.questionCount = count;
}