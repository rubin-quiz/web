// クイズのダミーデータ
const quizData = [
    {
        question: "日本で一番高い山は？",
        answer: "富士山（3,776m）",
        categories: ["地理", "観光"]
    },
    {
        question: "「となりのトトロ」の監督は誰？",
        answer: "宮崎駿",
        categories: ["アニメ", "文化"]
    },
    {
        question: "寿司に使われるご飯をなんという？",
        answer: "シャリ",
        categories: ["食べ物", "文化"]
    },
    {
        question: "英語で「bell pepper」「green pepper」といえば？",
        answer: "ピーマン",
        categories: ["英語", "食べ物"]
    },
    {
        question: "日本の国鳥は？",
        answer: "キジ",
        categories: ["動物", "文化"]
    },
    {
        question: "「SQL」の正式名称は？",
        answer: "Structured Query Language",
        categories: ["テクノロジー", "プログラミング"]
    },
    {
        question: "世界一高い山は？",
        answer: "エベレスト",
        categories: ["地理", "観光"]
    },
    {
        question: "フランス語で「雷」という意味のお菓子といえば？",
        answer: "エクレア",
        categories: ["食べ物", "フランス語"]
    },
    {
        question: "自転軸が黄道面に対して約98度と、大きく傾いている惑星は？",
        answer: "天王星",
        categories: ["天文", "理科"]
    },
];

// 1ページあたりの問題数
const QUESTIONS_PER_PAGE = 5;

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
            <div class="answer" style="display: none;">${quiz.answer}</div>
        `;
        quizContainer.appendChild(quizElement);
    }
    
    // トグルボタンのイベントリスナーを設定
    setupAnswerToggles();
    
    // ページネーションを更新
    updatePagination(filteredQuizzes.length);
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