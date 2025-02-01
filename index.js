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
        let currentIndex = images.indexOf(quizImage.src.split("/").pop()); // 現在の画像インデックスを取得

        // 現在の画像がリストにない場合、最初の画像を使用
        if (currentIndex === -1) {
            currentIndex = 0;
        }

        // インデックスを更新して画像を切り替える
        currentIndex = (currentIndex + step + images.length) % images.length;
        quizImage.src = images[currentIndex]; // 画像を変更
    }

    // すべての矢印ボタン（prev、next）にイベントリスナーを追加
    sliders.forEach(slider => {
        const prevButton = slider.querySelector(".arrow.prev");
        const nextButton = slider.querySelector(".arrow.next");

        if (prevButton && nextButton) {
            prevButton.addEventListener("click", (event) => changeImage(event, -1)); // 前の画像に進む
            nextButton.addEventListener("click", (event) => changeImage(event, 1)); // 次の画像に進む
        }
    });
});
