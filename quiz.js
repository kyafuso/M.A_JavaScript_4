const quizUrl = 'https://opentdb.com/api.php?amount=10&type=multiple'

let h1 = document.getElementsByTagName('h1')[0];
let p = document.getElementsByTagName('p')[0];
let submitArea = document.getElementById('submit-area');
let questionArea = document.getElementById('question-area');

class Quiz {
    constructor(quizzes, count, match) {
        this._quizzes = quizzes;
        this._count = count;
        this._match = match;
    }
    get count() {
        return this._count;
    }
    get match() {
        return this._match;
    }
    get length() {
        return this._quizzes.length;
    }
    getQuestion() {
        return this._quizzes[this._count].question;
    }
    getCategory() {
        return this._quizzes[this._count].category;
    }
    getDifficulty() {
        return this._quizzes[this._count].difficulty;
    }
    getCorrectAnswer() {
        return this._quizzes[this._count].correct_answer;
    }
    getIncorrectAnswers() {
        return this._quizzes[this._count].incorrect_answers;
    }
    incrementCount() {
        this._count++;
    }
    countMatch() {
        this._match++;
    }
} 

const fetchQuiz = async () => {   
    h1.innerText = '取得中';
    p.innerText = '少々お待ちください';
    
    submitArea.style.display = 'none';

    const response = await fetch(quizUrl);
    const data = await response.json();
    const quizzes = data.results;
    const quiz = new Quiz(quizzes, 0, 0);

    showQuiz(quiz);
}

const showQuiz = (quiz) => {    
    h1.innerText = `問題${quiz.count + 1}`;

    const category = document.createElement('h2');
    category.innerText = `[ジャンル]${quiz.getCategory()}`;
    
    const difficulty = document.createElement('h2');
    difficulty.innerText = `[難易度]${quiz.getDifficulty()}`;
    
    questionArea.innerHTML = '';    
    questionArea.appendChild(category);
    questionArea.appendChild(difficulty);

    p.innerHTML = quiz.getQuestion();

    showAsnwers(quiz);
}

const showAsnwers = (quiz) => {    
    submitArea.style.display = '';
    submitArea.innerHTML = '';

    let answers = [
        quiz.getCorrectAnswer(),
        quiz.getIncorrectAnswers()[0],
        quiz.getIncorrectAnswers()[1],
        quiz.getIncorrectAnswers()[2]
    ]

    answers = shuffleAnswers(answers);

    const ul = document.createElement('ul');

    answers.forEach((answer) => {
        const answerButton = document.createElement('button'); 
        answerButton.innerHTML = answer;   
        answerButton.addEventListener('click',  () => checkAnswer(answer, quiz));

        const li = document.createElement('li');
        li.appendChild(answerButton);
        ul.appendChild(li);
    });
    
    submitArea.appendChild(ul);
}

const checkAnswer = (answer, quiz) => {    
    if (answer === quiz.getCorrectAnswer()) {
        quiz.countMatch();
    }

    quiz.incrementCount();
        
    if(quiz.count < quiz.length) {
        showQuiz(quiz);
    } else {
        showResult(quiz);
    }   
}

const shuffleAnswers = (answers) => {
    for (let i = answers.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
      }
    return answers;
}

const showResult = (quiz) => {
    h1.innerText = `あなたの正答数は${quiz.match}です！！`;
    questionArea.innerHTML = '';
    p.innerText = '再度チャレンジしたい場合は以下をクリック！！';
    
    const homeButton = document.createElement('button');
    homeButton.innerText = 'ホームに戻る';
    homeButton.addEventListener('click', () => showHome());

    submitArea.innerHTML = '';
    submitArea.appendChild(homeButton);
}

const showHome = () => {
    h1.innerText = 'ようこそ';
    p.innerText = '以下のボタンをクリック';

    const startButton = document.createElement('button');
    startButton.innerText = '開始';
    startButton.addEventListener('click', () => fetchQuiz());

    submitArea.innerHTML = '';
    submitArea.appendChild(startButton);
}

window.onload = () => {
    const startButton = document.createElement('button');
    startButton.innerText = '開始';
    startButton.addEventListener('click', () => fetchQuiz());
    
    submitArea.appendChild(startButton);
}