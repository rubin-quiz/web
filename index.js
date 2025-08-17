// DOMの読み込みが完了したら実行 - ページの読み込みが完了してから処理を開始
document.addEventListener("DOMContentLoaded", function () {
    // スライダー要素を全て取得 - クラス名「slider」を持つ要素を全て配列として取得
    const sliders = document.querySelectorAll(".slider");

    // スライダーが存在しないページでは何もせず終了（コンソール汚染防止）
    if (!sliders.length) {
        return;
    }

    // 画像を切り替える関数 - 矢印ボタンクリック時に画像を切り替える処理
    function changeImage(event, step) {
        const slider = event.target.closest(".slider"); // クリックされた矢印ボタンの親要素であるスライダーを特定
        const quizImage = slider.querySelector(".quizImage"); // スライダー内の画像要素を取得
        const images = slider.getAttribute("data-images").split(","); // data-images属性から画像パスのリストを取得
        let currentIndex = slider.dataset.index ? parseInt(slider.dataset.index) : 0; // 現在表示中の画像のインデックスを取得

        // インデックスを更新（循環させる） - 次/前の画像に移動。最後/最初の画像の場合は最初/最後に戻る
        currentIndex = (currentIndex + step + images.length) % images.length;
        slider.dataset.index = currentIndex; // 新しいインデックスをHTML要素に保存

        quizImage.src = images[currentIndex]; // 画像のソースを更新
        updateIndicators(slider); // インジケーター（ドット）の表示を更新
    }

    // インジケーターの更新関数 - 現在表示中の画像に対応するドットを強調表示
    function updateIndicators(slider) {
        const indicators = slider.querySelector(".indicators"); // インジケーター要素を取得
        const dots = indicators.querySelectorAll(".dot"); // 全てのドットを取得
        const currentIndex = parseInt(slider.dataset.index); // 現在の画像インデックスを取得

        // 全てのインジケーターを非アクティブ状態に - 全てのドットをグレーに
        dots.forEach(dot => dot.style.backgroundColor = "rgb(205, 205, 205)");

        // 現在の画像に対応するインジケーターをアクティブに - 現在の画像のドットを黒に
        if (dots[currentIndex]) {
            dots[currentIndex].style.backgroundColor = "black";
        }
    }

    // 各スライダーの初期設定 - ページ読み込み時の初期化処理
    sliders.forEach(slider => {
        const images = slider.getAttribute("data-images").split(","); // 画像リストを取得
        const indicators = slider.querySelector(".indicators"); // インジケーター要素を取得

        // インジケーターのクリックイベント設定 - 各ドットをクリックした時の処理
        images.forEach((image, index) => {
            const dot = indicators.querySelectorAll(".dot")[index];
            if (dot) {
                dot.addEventListener("click", () => {
                    slider.dataset.index = index; // クリックされたドットのインデックスを保存
                    const quizImage = slider.querySelector(".quizImage");
                    quizImage.src = image; // 対応する画像を表示
                    updateIndicators(slider); // インジケーターを更新
                });
            }
        });

        // 初期インデックスを設定 - 最初の画像を表示
        slider.dataset.index = 0;

        // 前後の矢印ボタンを取得
        const prevButton = slider.querySelector(".arrow.prev");
        const nextButton = slider.querySelector(".arrow.next");

        // 矢印ボタンのクリックイベント設定 - 矢印クリック時の画像切り替え処理
        if (prevButton && nextButton) {
            prevButton.addEventListener("click", (event) => changeImage(event, -1));
            nextButton.addEventListener("click", (event) => changeImage(event, 1));
        }
        
        // 初期状態でインジケーターを更新
        updateIndicators(slider);
    });
});

// モーダル表示用の現在のスライダーを保持する変数
let currentModalSlider = null;

// モーダルを開く関数 - 画像クリック時に拡大表示        
function openModal(imgElement) {
    const modal = document.getElementById('imageModal'); // モーダル要素を取得
    const modalImg = document.getElementById('modalImage'); // モーダル内の画像要素を取得
    const slider = imgElement.closest('.slider'); // クリックされた画像の親スライダーを取得
    currentModalSlider = slider; // 現在のスライダーを保存
    
    modal.style.display = "block"; // モーダルを表示
    modalImg.src = imgElement.src; // クリックされた画像をモーダルに表示
    
    setupModalIndicators(slider); // モーダルのインジケーターを設定
    updateModalIndicators(); // インジケーターを更新
}

// モーダルのインジケーターを設定する関数 - モーダル表示時のドット生成
function setupModalIndicators(slider) {
    const images = slider.getAttribute("data-images").split(","); // 画像リストを取得
    const indicatorsContainer = document.getElementById('modalIndicators'); // インジケーターコンテナを取得
    indicatorsContainer.innerHTML = ''; // 既存のインジケーターをクリア
    
    // 各画像に対応するインジケーターを作成
    images.forEach((_, index) => {
        const dot = document.createElement('div'); // 新しいドット要素を作成
        dot.className = 'modal-dot'; // クラスを設定
        dot.onclick = (e) => {
            e.stopPropagation(); // イベントの伝播を停止
            currentModalSlider.dataset.index = index; // インデックスを更新
            document.getElementById('modalImage').src = images[index]; // 画像を更新
            updateModalIndicators(); // インジケーターを更新
        };
        indicatorsContainer.appendChild(dot); // ドットを追加
    });
}

// モーダルのインジケーターを更新する関数 - モーダル内のドット表示を更新
function updateModalIndicators() {
    const dots = document.querySelectorAll('.modal-dot'); // 全てのドットを取得
    const currentIndex = parseInt(currentModalSlider.dataset.index || 0); // 現在のインデックスを取得
    
    // 各ドットのアクティブ状態を更新
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

// モーダル内の画像を切り替える関数 - モーダル内の矢印クリック時の処理
function changeModalImage(step) {
    const images = currentModalSlider.getAttribute("data-images").split(","); // 画像リストを取得
    let currentIndex = parseInt(currentModalSlider.dataset.index || 0); // 現在のインデックスを取得
    
    // インデックスを更新（循環させる）
    currentIndex = (currentIndex + step + images.length) % images.length;
    currentModalSlider.dataset.index = currentIndex; // 新しいインデックスを保存
    
    document.getElementById('modalImage').src = images[currentIndex]; // 画像を更新
    updateModalIndicators(); // インジケーターを更新
}

// モーダルを閉じる関数 - モーダル外クリック時の処理
function closeModal() {
    document.getElementById('imageModal').style.display = "none"; // モーダルを非表示
    currentModalSlider = null; // 現在のスライダー参照をクリア
}

// クイズの答えを表示する関数 - 答えボタンクリック時の処理
function toggleAnswer(button) {
    const answer = button.previousElementSibling; // 答え要素を取得
    const answerText = answer.textContent.trim(); // 答えのテキストを取得
    button.textContent = answerText; // ボタンのテキストを答えに変更
    button.classList.remove('answerbutton'); // ボタンのスタイルを変更
    button.disabled = true; // ボタンを無効化
}

// ハンバーガーメニューの表示を切り替える関数 - メニューボタンクリック時の処理
function toggleMenu() {
    const menuOverlay = document.getElementById('menuOverlay'); // メニューオーバーレイを取得
    const hamburger = document.querySelector('.hamburger'); // ハンバーガーボタンを取得

    const isOpen = menuOverlay.style.display === 'flex'; // メニューが開いているか確認

    menuOverlay.style.display = isOpen ? 'none' : 'flex'; // メニューの表示/非表示を切り替え
    document.body.style.overflow = isOpen ? '' : 'hidden';  // 背景のスクロールを制御
    hamburger.classList.toggle('open');  // ハンバーガーアイコンの状態を切り替え
}
