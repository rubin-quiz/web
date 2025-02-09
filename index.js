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
        updateIndicators(slider); // インジケーターを更新
    }

    // インジケーターの更新
    function updateIndicators(slider) {
        const indicators = slider.querySelector(".indicators");
        const dots = indicators.querySelectorAll(".dot");
        const currentIndex = parseInt(slider.dataset.index);

        // 全てのインジケーターを初期化
        dots.forEach(dot => dot.style.backgroundColor = "gray");

        // 現在のインデックスに対応するインジケーターをアクティブにする
        if (dots[currentIndex]) {
            dots[currentIndex].style.backgroundColor = "black";
        }
    }

    // すべてのスライダーにインジケーターを作成
    sliders.forEach(slider => {
        const images = slider.getAttribute("data-images").split(",");
        const indicators = slider.querySelector(".indicators");

        // インジケーターの初期設定
        images.forEach((image, index) => {
            const dot = indicators.querySelectorAll(".dot")[index]; // すでにHTMLで定義されたdotを利用
            if (dot) {
                dot.addEventListener("click", () => {
                    slider.dataset.index = index; // インデックスを変更
                    const quizImage = slider.querySelector(".quizImage");
                    quizImage.src = image; // 対応する画像を表示
                    updateIndicators(slider); // インジケーターを更新
                });
            }
        });

        // スライダーに初期インデックスを保存
        slider.dataset.index = 0;

        const prevButton = slider.querySelector(".arrow.prev");
        const nextButton = slider.querySelector(".arrow.next");

        if (prevButton && nextButton) {
            prevButton.addEventListener("click", (event) => changeImage(event, -1)); // 前の画像に進む
            nextButton.addEventListener("click", (event) => changeImage(event, 1)); // 次の画像に進む
        }

        // 初期状態でインジケーターを更新
        updateIndicators(slider);
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
    document.body.style.overflow = isOpen ? '' : 'hidden';  // スクロール禁止

    // ハンバーガーメニューの色を変更する
    hamburger.classList.toggle('open');  // 'open'クラスを切り替え
}

