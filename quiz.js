// クイズのダミーデータ
const quizData = [
    {
        question: " 自転車や家具といったものが該当する、家庭から出るごみの中でも特に規定の寸法を超えたごみのことを一般に何というでしょう？",
        answer: "粗大ごみ",
        categories: ["生活", ],
    },
    {
        question: "さまざまな角度から見た物の形を一つの画面に収めるなどの特徴を持つ、20世紀はじめにパブロ・ピカソとジョルジュ・ブラックによって創始された芸術運動を何というでしょう？",
        answer: "キュビスム（立体派）",
        categories: ["芸術", ],
    },
    {
        question: "「リアカー無きK村」から始まる語呂合わせで元素記号と色を組み合わせて覚えられる、ある元素が含まれた水溶液を炎の中に入れると、その元素特有の色を示す現象を何というでしょう？",
        answer: "炎色反応",
        categories: ["化学", ],
    },
    {
        question: "QuizKnockのナイスガイこと須貝駿貴は「ワン・ツー・ツー・ワン」という語呂合わせで覚えているという、1221年に後鳥羽上皇が鎌倉幕府を討伐するために起こした内乱は何でしょう？",
        answer: "承久の乱",
        categories: ["歴史", ],
    },
    {
        question: "和歌の世界では「他人が詠んだ歌の一部を変えて即座に返すこと」を意味している、「他人の言葉をそのまま返すこと」をある鳥の名前を用いて「何返し」というでしょう？",
        answer: "オウム（返し）",
        categories: ["ことば", ],
    },
    {
        question: "「M-1グランプリ2024」で優勝し大会史上初の2連覇を果たした、髙比良くるまと松井ケムリからなるお笑いコンビは何でしょう？",
        answer: "令和ロマン",
        categories: ["芸能", ],
        supplement:"2大会連続のトップバッターからの優勝という偉業にも注目されました！"
    },
    {
        question: "ゴルフにおいて、各ホールの1打目のことを特に「何ショット」というでしょう？",
        answer: "ティーショット",
        categories: ["スポーツ", ]
    },
    {
        question: "「万物の根源は水である」と唱えた古代ギリシャの哲学者は誰でしょう？",
        answer: "タレス",
        categories: ["倫理", ],
        supplement: "なお、ヘラクレイトスは万物の根源を「火」と唱えました"
    },
    {
        question: "ファミリーマートの商品の中で初めて学校給食として提供されることが発表された、同コンビニチェーンの看板商品は何でしょう？",
        answer: "ファミチキ",
        categories: ["生活",]
    },
    {
        question: "お笑い芸人のバカリズムや出川哲郎が所属している芸能事務所はどこでしょう？",
        answer: "マセキ芸能社",
        categories: ["芸能", ]
    },
    {
        question: "医学用語では「尋常性痤瘡（じんじょうせいざそう）」という、思春期から青年期にかけてよく見られる皮膚の炎症を何というでしょう？",
        answer: "にきび",
        categories: ["医学"]
    },
    {
        question: "野球において、捕れたはずの玉を捕手が後ろに逸らしたときに記録されるエラーは何でしょう？",
        answer: "捕逸（パスボール）",
        categories: ["スポーツ", ]
    },
    {
        question: "スワヒリ語で「のんびり ゆっくり」という意味がある、代々木ライブラリーが出版する英文読解の参考書のタイトルにも使われているカタカナ4文字の言葉は何でしょう？",
        answer: "ポレポレ",
        categories: ["ことば"]
    },
    {
        question: "日本の歴代内閣総理大臣のうちフルネームの最初の4文字が「いしばし」であるのは、石橋湛山（いしばしたんざん）と誰でしょう？",
        answer: "石破茂（いしばしげる）",
        categories: ["政治",],
        supplement: "こちらの問題は問題集『クイズの壺2～世界の解像度を上げる300問～』に収録されています！",
    },
    {
        question: "宴の際にヘーベーという美しい神にお酌をしてもらった神々はつい飲み過ぎてしまったことから、「へーベーのお酌」を意味する「へーベー・エリュレケ」が語源となっている、「酔い潰れる」という意味の日本語は何でしょう？",
        answer: "へべれけ",
        categories: ["ことば", ],
        supplement: "こちらの問題は問題集『クイズの壺～日常に興を添える300問～』に収録されています！",
    },
    {
        question: "白地に黒で描かれた図形が「向かい合った2人の顔」にも「大きな壺」にも見えるという特徴を持つだまし絵のことを、これを考案したデンマークの心理学者の名前から「何の壺」というでしょう？",
        answer: "ルビン（の壺）",
        categories: ["心理学"]
    },
];

// 1ページあたりの問題数
const QUESTIONS_PER_PAGE = 10;

// 現在のページ番号（0から開始）
let currentPage = 0;

// 選択されているカテゴリー（配列で複数選択可能）
let selectedCategories = [];

// すべてのカテゴリーを取得
function getAllCategories() {
    const categoriesSet = new Set();
    quizData.forEach(quiz => {
        quiz.categories.forEach(category => categoriesSet.add(category));
    });
    return [...categoriesSet];
}

// カテゴリーフィルターを表示する関数
function displayCategoryFilters() {
    const categories = getAllCategories();
    const filterContainer = document.createElement('div');
    filterContainer.className = 'category-filters';
    
    // カテゴリーごとのボタンを追加
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category;
        button.className = `category-filter ${selectedCategories.includes(category) ? 'active' : ''}`;
        button.addEventListener('click', () => {
            toggleCategory(category);
            updateCategoryButtons();
            displayQuizzes(0);
        });
        filterContainer.appendChild(button);
    });

    // 全解除ボタンを追加
    const clearButton = document.createElement('button');
    clearButton.textContent = '全タグ解除';
    clearButton.className = 'category-filter clear-all';
    clearButton.addEventListener('click', () => {
        selectedCategories = [];
        updateCategoryButtons();
        displayQuizzes(0);
    });
    filterContainer.appendChild(clearButton);
    
    // 既存のフィルターを削除して新しいものを追加
    const existingFilter = document.querySelector('.category-filters');
    if (existingFilter) {
        existingFilter.remove();
    }
    document.getElementById('quiz-container').parentNode.insertBefore(filterContainer, document.getElementById('quiz-container'));
}

// カテゴリーの選択/解除を切り替える
function toggleCategory(category) {
    const index = selectedCategories.indexOf(category);
    if (index === -1) {
        selectedCategories.push(category);
    } else {
        selectedCategories.splice(index, 1);
    }
    currentPage = 0;
}

// カテゴリーボタンの表示を更新
function updateCategoryButtons() {
    document.querySelectorAll('.category-filter').forEach(button => {
        if (button.classList.contains('clear-all')) return;
        if (selectedCategories.includes(button.textContent)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// クイズを表示する関数
function displayQuizzes(page) {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = '';
    
    // カテゴリーでフィルタリングされたクイズデータ
    const filteredQuizzes = selectedCategories.length > 0
        ? quizData.filter(quiz => 
            selectedCategories.some(category => quiz.categories.includes(category)))
        : quizData;
    
    const start = page * QUESTIONS_PER_PAGE;
    const end = Math.min(start + QUESTIONS_PER_PAGE, filteredQuizzes.length);
    
    for (let i = start; i < end; i++) {
        const quiz = filteredQuizzes[i];
        const quizElement = document.createElement('div');
        quizElement.className = 'quiz-item';
        quizElement.innerHTML = `
            <div class="quiz-question">${quiz.question}</div>
            <div class="quiz-footer">
                <div class="answer-toggle">
                    <span class="toggle-icon">+</span>
                    <span class="toggle-text">回答を表示</span>
                </div>
                <div class="quiz-categories">
                    ${quiz.categories.map(category => 
                        `<span class="quiz-category">${category}</span>`
                    ).join('')}
                </div>
            </div>
            <div class="answer" style="display: none;">
                ${quiz.answer}
                ${quiz.supplement ? `<div class="supplement">${quiz.supplement}</div>` : ''}
            </div>
        `;
        quizContainer.appendChild(quizElement);
    }
    
    // トグルボタンのイベントリスナーを設定
    setupAnswerToggles();
    
    // ページネーションを更新
    updatePagination(filteredQuizzes.length);

    // ページ遷移後にスクロール位置を固定
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


// 答えトグルのイベントを設定
function setupAnswerToggles() {
    document.querySelectorAll('.answer-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const answerDiv = this.closest('.quiz-item').querySelector('.answer');
            const toggleIcon = this.querySelector('.toggle-icon');
            const toggleText = this.querySelector('.toggle-text');
            
            if (answerDiv.style.display === 'none') {
                answerDiv.style.display = 'block';
                toggleIcon.textContent = '−';
                toggleText.textContent = '回答を隠す';
                this.classList.add('active');
            } else {
                answerDiv.style.display = 'none';
                toggleIcon.textContent = '+';
                toggleText.textContent = '回答を表示';
                this.classList.remove('active');
            }
        });
    });
}

// ページネーションを更新する関数
function updatePagination(totalQuizzes) {
    const paginationContainer = document.getElementById('pagination');
    const totalPages = Math.ceil(totalQuizzes / QUESTIONS_PER_PAGE);
    
    paginationContainer.innerHTML = '';
    
    for (let i = 0; i < totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `page-button ${i === currentPage ? 'active' : ''}`;
        pageButton.textContent = i + 1;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayQuizzes(currentPage);
        });
        paginationContainer.appendChild(pageButton);
    }
}

// 初期表示
displayCategoryFilters();
displayQuizzes(currentPage);