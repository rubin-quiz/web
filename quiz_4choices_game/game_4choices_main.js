/**
 * メインアプリケーションの起点となるモジュール
 */
import { DOM } from './game_4choices_domElements.js';
import { createGenreButtons } from './game_4choices_gameUI.js';
import { startGame, restartGame, returnToGenreSelection, returnToModeSelection } from './game_4choices_gameLogic.js';

/**
 * ゲーム初期化関数
 * アプリケーションの起動時に実行される
 */
function initGame() {
    // ジャンルボタンを動的に作成
    createGenreButtons();
    
    // モード選択ボタン
    DOM.buttons.mode5.addEventListener("click", () => startGame(5));
    DOM.buttons.mode10.addEventListener("click", () => startGame(10));
    
    // モード選択画面からジャンル選択に戻るボタン
    DOM.buttons.returnToGenre.fromMode.addEventListener("click", returnToGenreSelection);
    
    // 結果画面のボタン
    DOM.buttons.restart.addEventListener("click", restartGame);
    DOM.buttons.returnToGenre.fromResult.addEventListener("click", returnToGenreSelection);
    DOM.buttons.returnToMode.addEventListener("click", returnToModeSelection);
    
    // 初期表示設定
    DOM.screens.mode.style.display = "none";
    DOM.screens.quiz.style.display = "none";
    DOM.screens.result.style.display = "none";
    DOM.screens.genre.style.display = "block";
}

// ページ読み込み完了時にゲームを初期化
document.addEventListener('DOMContentLoaded', initGame);