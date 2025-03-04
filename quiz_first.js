
function displayFirstQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = '';
    
    const quiz = {
        question: "和歌の世界では「他人が詠んだ歌の一部を変えて即座に返すこと」を意味している、「他人の言葉をそのまま返すこと」をある鳥の名前を用いて「何返し」というでしょう？",
        answer: "オウム返し",
        categories: ["文化", "ことば"],
        supplement: "人の言葉を真似して話すオウムの習性に由来します", 
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
        <div class="answer" style="display: none;">
                ${quiz.answer}
                ${quiz.supplement ? `<div class="supplement">${quiz.supplement}</div>` : ''}
            </div>
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