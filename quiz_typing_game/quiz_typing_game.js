document.addEventListener("DOMContentLoaded", () => {
    console.log("ページが完全に読み込まれました");
    
    const startButton = document.getElementById("start-button");
    console.log(startButton); // ボタンが取得できているか確認
    
    if (startButton) {
        console.log("start-button が見つかりました");
        startButton.addEventListener("click", () => {
            console.log("ゲーム開始ボタンがクリックされました");
            startGame();
        });
    } else {
        console.error("start-button が見つかりません！");
    }
});

let quizData = [
    {
        question: "日本の首都は？",
        options: [
            { text: "東京", roman: "toukyou", correct: true },
            { text: "大阪", roman: "oosaka", correct: false },
            { text: "京都", roman: "kyouto", correct: false },
            { text: "福岡", roman: "fukuoka", correct: false }
        ]
    },
    {
        question: "医学用語で「母斑細胞母斑」とは？",
        options: [
            { text: "ほくろ", roman: "hokuro", correct: true },
            { text: "かさぶた", roman: "kasabuta", correct: false },
            { text: "にきび", roman: "nikibi", correct: false },
            { text: "そばかす", roman: "sobakasu", correct: false }
        ]
    },
    {
        question: "マックス・ウェーバーの著書「プロ倫」といえば？",
        options: [
            { text: "『プロテスタンディズムの倫理と資本主義の精神』", roman: "purotesutanthizumunorinritosihonsyuginoseisinn", correct: true },
            { text: "『プロテスタンディズムの精神と資本主義の倫理』", roman: "purotesutanthizumunoseisinntosihonsyuginorinri", correct: false },
            { text: "『プロテスタンディズムと資本主義の倫理と精神』", roman: "purotesutanthizumutosihonsyuginorinritoseisinn", correct: false },
            { text: "『プロゴルファー猿の倫理観について』", roman: "purogorufa-sarunorinrikannnituite", correct: false }
        ]
    }
];

let currentQuestionIndex = 0;
let correctAnswers = 0;
let typedInput = "";
let timer;
let timeLeft = 10.0;

function startGame() {
    console.log("startGame() 関数が実行されました");

    const startScreen = document.getElementById("start-screen");
    const gameScreen = document.getElementById("game-screen");

    if (!startScreen || !gameScreen) {
        console.error("start-screen または game-screen が見つかりません！");
        return;
    }

    startScreen.style.display = "none";
    gameScreen.style.display = "block";
    
    gameScreen.classList.remove("hidden");
    
    console.log("start-screen を非表示、game-screen を表示");

    currentQuestionIndex = 0;
    correctAnswers = 0;
    typedInput = "";

    loadQuestion();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function loadQuestion() {
    console.log("loadQuestion() 実行");
    if (currentQuestionIndex >= quizData.length) {
        document.getElementById("quiz-container").innerHTML = `<h2>クイズ終了！</h2><p>正解数: ${correctAnswers} / ${quizData.length}</p>`;
        return;
    }
    
    const quiz = quizData[currentQuestionIndex];
    document.getElementById("question").textContent = quiz.question;
    
    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";
    
    const shuffledOptions = [...quiz.options];
    shuffleArray(shuffledOptions);
    
    shuffledOptions.forEach(option => {
        const div = document.createElement("div");
        div.className = "option";
        div.dataset.roman = option.roman;
        div.dataset.correct = option.correct;
        div.innerHTML = `${option.text}<span class="roman-text">${option.roman}</span>`;
        optionsContainer.appendChild(div);
    });
    
    document.getElementById("result").textContent = "";
    typedInput = "";
    resetTimer();
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 10.0;
    updateTimerDisplay();
    updateTimerBar(); // タイムバーの更新

    timer = setInterval(() => {
        timeLeft = parseFloat((timeLeft - 0.1).toFixed(1)); // 文字列にならないように修正
        updateTimerDisplay();
        updateTimerBar(); // タイムバーの更新

        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById("result").textContent = "不正解... 時間切れ";
            document.getElementById("result").className = "incorrect";
            setTimeout(() => {
                currentQuestionIndex++;
                loadQuestion();
            }, 1500);
        }
    }, 100);
}


function updateTimerDisplay() {
    document.getElementById("timer-text").textContent = `${timeLeft}s`;
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Backspace") {
        typedInput = typedInput.slice(0, -1);
        highlightMatchingOption();
        return;
    } else if (event.key === "Enter") {
        typedInput = "";
        highlightMatchingOption();
        document.getElementById("result").textContent = "";
        return;
    }

    // 現在のクイズの選択肢から有効なキーを取得
    const validKeys = new Set(quizData[currentQuestionIndex].options.flatMap(option => option.roman.split("")));

    // 入力が有効なキーに含まれていない場合は無視（typedInputは維持）
    if (!validKeys.has(event.key.toLowerCase())) {
        return;
    }

    // 入力が有効な場合のみ処理を続行
    typedInput += event.key.toLowerCase();
    highlightMatchingOption();
    checkFinalAnswer();
});


function updateTimerBar() {
    const timerBar = document.getElementById("timer-bar");
    const percentage = (timeLeft / 10.0) * 100;
    timerBar.style.width = `${percentage}%`;

    // 残り時間によって色を変更
    if (percentage > 50) {
        timerBar.style.backgroundColor = "#28a745"; // 緑
    } else if (percentage > 20) {
        timerBar.style.backgroundColor = "#ffc107"; // 黄色
    } else {
        timerBar.style.backgroundColor = "#dc3545"; // 赤
    }
}


function highlightMatchingOption() {
    document.querySelectorAll(".option").forEach(option => {
        const romanText = option.dataset.roman;
        const romanSpan = option.querySelector(".roman-text");
        if (romanText.startsWith(typedInput)) {
            romanSpan.innerHTML = `<span class="highlight">${typedInput}</span>${romanText.slice(typedInput.length)}`;
        } else {
            romanSpan.innerHTML = romanText;
        }
    });
}

function checkFinalAnswer() {
    const matchedOption = quizData[currentQuestionIndex].options.find(opt => opt.roman === typedInput);
    
    if (matchedOption) {
        document.querySelectorAll(".option").forEach(option => {
            if (option.dataset.roman === matchedOption.roman) {
                option.classList.add(matchedOption.correct ? "correct-answer" : "wrong-answer");
            }
            if (option.dataset.correct === "true") {
                option.classList.add("correct-answer");
            }
        });
        
        if (matchedOption.correct) correctAnswers++;
        document.getElementById("result").textContent = matchedOption.correct ? "正解！" : "不正解...";
        document.getElementById("result").className = matchedOption.correct ? "correct" : "incorrect";
        clearInterval(timer);
        
        setTimeout(() => {
            currentQuestionIndex++;
            loadQuestion();
        }, 1500);
    }
}
