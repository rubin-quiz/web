document.addEventListener("DOMContentLoaded", function () {
    const sliders = document.querySelectorAll(".slider");

    if (!sliders.length) {
        console.error("Error: .slider element not found!");
        return;
    }

    function changeImage(event, step) {
        const slider = event.target.closest(".slider"); // 押された矢印ボタンが属するスライダーを特定
        const quizImage = slider.querySelector(".quizImage"); // スライダー内の画像を取得
        const images = slider.getAttribute("data-images").split(","); // 画像リストを取得
        let currentIndex = slider.dataset.index ? parseInt(slider.dataset.index) : 0; // 現在のインデックスを取得（データ属性に保持）

        // インデックスを更新
        currentIndex = (currentIndex + step + images.length) % images.length;
        slider.dataset.index = currentIndex; // 新しいインデックスをスライダーに保存

        quizImage.src = images[currentIndex]; // 画像を変更
    }

    // すべての矢印ボタン（prev、next）にイベントリスナーを追加
    sliders.forEach(slider => {
        const prevButton = slider.querySelector(".arrow.prev");
        const nextButton = slider.querySelector(".arrow.next");

        // スライダーに初期インデックスを保存
        slider.dataset.index = 0;

        if (prevButton && nextButton) {
            prevButton.addEventListener("click", (event) => changeImage(event, -1)); // 前の画像に進む
            nextButton.addEventListener("click", (event) => changeImage(event, 1)); // 次の画像に進む
        }
    });
});


function toggleAnswer(button) {
    const answer = button.previousElementSibling;
    const answerText = answer.textContent.trim();
    button.textContent = answerText;
    button.classList.remove('answerbutton');
    button.disabled = true;
}

function toggleMenu() {
    const menuOverlay = document.getElementById('menuOverlay');
    const hamburger = document.querySelector('.hamburger');  // ハンバーガー要素を選択

    const isOpen = menuOverlay.style.display === 'flex';

    // メニューオーバーレイの表示/非表示を切り替え
    menuOverlay.style.display = isOpen ? 'none' : 'flex';
    // document.body.style.overflow = isOpen ? '' : 'hidden';  // スクロール禁止

    // ハンバーガーメニューの色を変更する
    hamburger.classList.toggle('open');  // 'open'クラスを切り替え
}

