// クイズのダミーデータ
const quizData = [
    {
        question: "白地に黒で描かれた図形が「向かい合った2人の顔」にも「大きな壺」にも見えるという特徴を持つだまし絵のことを、これを考案したデンマークの心理学者の名前から「何の壺」というでしょう？",
        answer: "ルビン",
        category: "つぼ"
    },
    {
        question: "「となりのトトロ」の監督は誰？",
        answer: "宮崎駿",
        category: "つぼ以外"
    },
    {
        question: "白地に黒で描かれた図形が「向かい合った2人の顔」にも「大きな壺」にも見えるという特徴を持つだまし絵のことを、これを考案したデンマークの心理学者の名前から「何の壺」というでしょう？",
        answer: "ルビン",
        category: "つぼ"
    },
    {
        question: "白地に黒で描かれた図形が「向かい合った2人の顔」にも「大きな壺」にも見えるという特徴を持つだまし絵のことを、これを考案したデンマークの心理学者の名前から「何の壺」というでしょう？",
        answer: "ルビン",
        category: "つぼ"
    },
    {
        question: "白地に黒で描かれた図形が「向かい合った2人の顔」にも「大きな壺」にも見えるという特徴を持つだまし絵のことを、これを考案したデンマークの心理学者の名前から「何の壺」というでしょう？",
        answer: "ルビン",
        category: "つぼ"
    },
    {
        question: "白地に黒で描かれた図形が「向かい合った2人の顔」にも「大きな壺」にも見えるという特徴を持つだまし絵のことを、これを考案したデンマークの心理学者の名前から「何の壺」というでしょう？",
        answer: "ルビン",
        category: "つぼ"
    },
    {
        question: "白地に黒で描かれた図形が「向かい合った2人の顔」にも「大きな壺」にも見えるという特徴を持つだまし絵のことを、これを考案したデンマークの心理学者の名前から「何の壺」というでしょう？",
        answer: "ルビン",
        category: "つぼ"
    },
    {
        question: "白地に黒で描かれた図形が「向かい合った2人の顔」にも「大きな壺」にも見えるという特徴を持つだまし絵のことを、これを考案したデンマークの心理学者の名前から「何の壺」というでしょう？",
        answer: "ルビン",
        category: "つぼ"
    },
    {
        question: "白地に黒で描かれた図形が「向かい合った2人の顔」にも「大きな壺」にも見えるという特徴を持つだまし絵のことを、これを考案したデンマークの心理学者の名前から「何の壺」というでしょう？",
        answer: "ルビン",
        category: "つぼ"
    },
    {
        question: "白地に黒で描かれた図形が「向かい合った2人の顔」にも「大きな壺」にも見えるという特徴を持つだまし絵のことを、これを考案したデンマークの心理学者の名前から「何の壺」というでしょう？",
        answer: "ルビン",
        category: "つぼ"
    },
];

// 1ページあたりの問題数
const QUESTIONS_PER_PAGE = 5;

// 現在のページ番号（0から開始）
let currentPage = 0;

// 現在選択されているカテゴリー（nullの場合は全て表示）
let currentCategory = null;

// カテゴリーフィルターを表示する関数
function displayCategoryFilters() {
    const categories = [...new Set(quizData.map(quiz => quiz.category))];
    const filterContainer = document.createElement('div');
    filterContainer.className = 'category-filters';
    
    // 「全て」のボタンを追加
    const allButton = document.createElement('button');
    allButton.textContent = '全て';
    allButton.className = `category-filter ${currentCategory === null ? 'active' : ''}`;
    allButton.addEventListener('click', () => {
        currentCategory = null;
        currentPage = 0;
        updateCategoryButtons();
        displayQuizzes(0);
    });
    filterContainer.appendChild(allButton);
    
    // カテゴリーごとのボタンを追加
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category;
        button.className = `category-filter ${currentCategory === category ? 'active' : ''}`;
        button.addEventListener('click', () => {
            currentCategory = category;
            currentPage = 0;
            updateCategoryButtons();
            displayQuizzes(0);
        });
        filterContainer.appendChild(button);
    });
    
    // 既存のフィルターを削除して新しいものを追加
    const existingFilter = document.querySelector('.category-filters');
    if (existingFilter) {
        existingFilter.remove();
    }
    document.getElementById('quiz-container').parentNode.insertBefore(filterContainer, document.getElementById('quiz-container'));
}

// カテゴリーボタンの表示を更新
function updateCategoryButtons() {
    document.querySelectorAll('.category-filter').forEach(button => {
        if ((button.textContent === '全て' && currentCategory === null) ||
            (button.textContent === currentCategory)) {
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
    const filteredQuizzes = currentCategory 
        ? quizData.filter(quiz => quiz.category === currentCategory)
        : quizData;
    
    const start = page * QUESTIONS_PER_PAGE;
    const end = Math.min(start + QUESTIONS_PER_PAGE, filteredQuizzes.length);
    
    for (let i = start; i < end; i++) {
        const quiz = filteredQuizzes[i];
        const quizElement = document.createElement('div');
        quizElement.className = 'quiz-item';
        quizElement.innerHTML = `
            <div class="quiz-question">${quiz.question}</div>
            <div class="parent">
                <span class="quiz-category">${quiz.category}</span>
                <button class="answerbutton">答えを表示</button>
            </div>
            <div class="answer" style="display: none;">${quiz.answer}</div>
        `;
        quizContainer.appendChild(quizElement);
    }
    
    // ボタンのイベントリスナーを設定
    setupAnswerButtons();
    
    // ページネーションを更新
    updatePagination(filteredQuizzes.length);
}

// 答えボタンのイベントを設定
function setupAnswerButtons() {
    document.querySelectorAll('.answerbutton').forEach(button => {
        button.addEventListener('click', function() {
            var parentDiv = button.closest('.parent');
            var answerDiv = parentDiv.nextElementSibling;
            if (answerDiv.style.display === 'none') {
                answerDiv.style.display = 'block';
                this.textContent = '答えを隠す';
            } else {
                answerDiv.style.display = 'none';
                this.textContent = '答えを表示';
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