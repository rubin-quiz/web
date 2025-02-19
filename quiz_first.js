
function displayFirstQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = '';
    
    const quiz = {
        question: "白地に黒で描かれた図形が「向かい合った2人の顔」にも「大きな壺」にも見えるという特徴を持つだまし絵のことを、これを考案したデンマークの心理学者の名前から「何の壺」というでしょう？",
        answer: "ルビン（の壺）",
        categories: ["つぼ", ]
    };
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
    
    // 回答の表示/非表示を切り替える
    const toggle = quizElement.querySelector('.answer-toggle');
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
}

// ページ読み込み完了時に実行
window.addEventListener('load', displayFirstQuiz);