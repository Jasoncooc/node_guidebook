const guessField = document.querySelector('.guessField');
const guessSubmit = document.querySelector('.guessSubmit');
const restartBtn = document.querySelector('.restartBtn');
const resultDiv = document.querySelector('.result');
const countDiv = document.querySelector('.count');
const guessesPara = document.querySelector('.guesses');
const mockTextPara = document.querySelector('.mock-text');
const timerDiv = document.querySelector('.timer');
const progressBar = document.querySelector('.progress-bar'); // 🔹 取得進度條元素

let randomNumber = Math.floor(Math.random() * 100) + 1;
let guessCount = 0;
let guessHistory = [];
let countdown; // 用來儲存 setInterval
let timeLeft = 30; // 倒數秒數，可自行調整
const mockTexts = [
  "你確定你會猜嗎？🤔",
  "再努力一點嘛！😏",
  "這麼簡單都猜不到？😅",
  "我覺得你可以更認真喔！😜",
  "是不是腦袋進水了？😂",
  "連1都猜不到，佩服佩服！🙄",
  "換個方法試試看？🤪"
];

function evaluateGuess() {
  const userGuess = Number(guessField.value);

  if (!userGuess || userGuess < 1 || userGuess > 100) {
    resultDiv.textContent = '請輸入 1 到 100 的有效數字。';
    guessField.classList.add('shake');
    setTimeout(() => guessField.classList.remove('shake'), 300);
    mockTextPara.textContent = mockTexts[Math.floor(Math.random() * mockTexts.length)];
    return;
  }

  guessCount++;
  guessHistory.push(userGuess);
  guessesPara.textContent = '猜過的數字：' + guessHistory.join(', ');
  countDiv.textContent = `猜測次數：${guessCount}`;

  if (userGuess === randomNumber) {
    resultDiv.innerHTML = `🎉 恭喜你猜對了！答案是 ${randomNumber}<br>${getEvaluation()}`;
    document.body.classList.add('success');
    guessSubmit.disabled = true;
    guessField.disabled = true;
    mockTextPara.textContent = ''; 
    clearInterval(countdown);
  } else {
    resultDiv.textContent = userGuess > randomNumber ? '太高了！' : '太低了！';
    guessField.classList.add('wrong');
    setTimeout(() => guessField.classList.remove('wrong'), 300);
    mockTextPara.textContent = mockTexts[Math.floor(Math.random() * mockTexts.length)];
  }

  guessField.value = '';
  guessField.focus();
}

function getEvaluation() {
  if (guessCount <= 3) return '🌟 太厲害了，神猜！';
  if (guessCount <= 6) return '👍 不錯喔～';
  if (guessCount <= 10) return '😊 普普通通';
  if (userGuess === randomNumber) {
  // 猜對了，清空嘲諷字眼
  mockTextPara.textContent = '';
  } else {
  // 猜錯，顯示隨機嘲諷字眼
  const randomText = mockTexts[Math.floor(Math.random() * mockTexts.length)];
  mockTextPara.textContent = randomText;
}
  return '😅 下次再加油吧～';
}

// 🔹 倒數計時＋進度條動畫
function startTimer() {
  clearInterval(countdown);
  timeLeft = 30;
  timerDiv.textContent = `⏰ 剩餘時間：${timeLeft} 秒`;
  progressBar.style.width = '100%';
  progressBar.style.backgroundColor = '#4CAF50';

  countdown = setInterval(() => {
    timeLeft--;
    timerDiv.textContent = `⏰ 剩餘時間：${timeLeft} 秒`;

    // 根據剩餘時間改變進度條寬度與顏色
    const percent = (timeLeft / 30) * 100;
    progressBar.style.width = percent + '%';

    if (percent <= 30) progressBar.style.backgroundColor = '#ff4d4d'; // 🔴 快結束變紅
    else if (percent <= 60) progressBar.style.backgroundColor = '#ffa500'; // 🟠 中段變橘

    if (timeLeft <= 0) {
      clearInterval(countdown);
      resultDiv.textContent = `⌛ 時間到！答案是 ${randomNumber}`;
      guessSubmit.disabled = true;
      guessField.disabled = true;
      document.body.classList.remove('success');
      mockTextPara.textContent = '下次快一點喔～⏰';
      progressBar.style.width = '0%';
      progressBar.style.backgroundColor = '#ff0000';
    }
  }, 1000);
}



function restartGame() {
  randomNumber = Math.floor(Math.random() * 100) + 1;
  guessCount = 0;
  guessHistory = [];
  resultDiv.textContent = '猜測數字:';
  countDiv.textContent = '猜測次數：0';
  guessesPara.textContent = '猜過的數字：';
  guessSubmit.disabled = false;
  guessField.disabled = false;
  document.body.classList.remove('success');
  guessField.value = '';
  guessField.focus();
  startTimer(); // ⏳ 重新開始時重啟倒數
}

guessSubmit.addEventListener('click', evaluateGuess);
restartBtn.addEventListener('click', restartGame);

// 🔹 頁面載入時立即啟動倒數
startTimer();