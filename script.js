const goalkeeper = document.getElementById('goalkeeper');
const ball = document.getElementById('ball');
const kicker = document.getElementById('kicker');
const message = document.getElementById('message');
const targets = document.querySelectorAll('.target');

const scorePsgEl = document.getElementById('score-psg');
const scoreArsenalEl = document.getElementById('score-arsenal');
const startScreen = document.getElementById('start-screen');
const endScreen = document.getElementById('end-screen');

let scorePSG = 0;
let scoreArsenal = 0;
let totalGoals = 0; 
let isPlaying = true; 
let currentPlayer = ''; 

const goalkeeperActions = ['up_left', 'up_right', 'down_left', 'down_right', 'up_center', 'down_center'];

// ЗАПУСК ГРИ ПІСЛЯ ВИБОРУ КОМАНДИ
window.startGame = function(player) {
    currentPlayer = player;
    kicker.src = `${player}_stand.png`;
    startScreen.style.display = 'none'; 
    isPlaying = false; 
}

targets.forEach(target => {
    target.addEventListener('click', function() {
        if (isPlaying || totalGoals >= 3) return; 
        isPlaying = true; 

        const playerTarget = this.getAttribute('data-target');
        
        // РОЗУМНИЙ ВОРОТАР: Нова логіка для центральних ударів
        let guaranteedMissActions = [];
        if (playerTarget === 'up_center' || playerTarget === 'down_center') {
            // Якщо б'ємо по центру — воротар стрибає ТІЛЬКИ в кути, щоб звільнити центр
            guaranteedMissActions = ['up_left', 'up_right', 'down_left', 'down_right'];
        } else {
            // Якщо б'ємо в кут — воротар стрибає куди завгодно, крім нашої цілі
            guaranteedMissActions = goalkeeperActions.filter(action => action !== playerTarget);
        }
        
        const goalkeeperTarget = guaranteedMissActions[Math.floor(Math.random() * guaranteedMissActions.length)];

        // Анімація удару
        kicker.src = `${currentPlayer}_kick.png`;
        kicker.className = 'kicker-kick';

        let fixedImage = goalkeeperTarget;
        if (goalkeeperTarget === 'up_left') fixedImage = 'up_right';
        else if (goalkeeperTarget === 'up_right') fixedImage = 'up_left';
        else if (goalkeeperTarget === 'down_left') fixedImage = 'down_right';
        else if (goalkeeperTarget === 'down_right') fixedImage = 'down_left';

        // М'яч летить за ідеальними траєкторіями
        setTimeout(() => {
            ball.style.transform = `translate(${getBallX(playerTarget)}, ${getBallY(playerTarget)}) scale(0.48)`;
            ball.style.transition = 'all 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }, 150);

        // Стрибок воротаря
        setTimeout(() => {
            if (goalkeeperTarget === 'up_center') {
                goalkeeper.src = 'goalkeeper_up_center.png';
                goalkeeper.style.transform = `translateX(-50%) translateY(-20px) scale(1.05)`;
            } else if (goalkeeperTarget === 'down_center') {
                goalkeeper.src = 'goalkeeper_down_center.png';
                goalkeeper.style.transform = `translateX(-50%) translateY(20px) scale(1.05)`;
            } else {
                goalkeeper.src = `goalkeeper_dive_${fixedImage}.png`;
                goalkeeper.style.transform = `translate(calc(-50% + ${getGoalkeeperX(goalkeeperTarget)}), ${getGoalkeeperY(goalkeeperTarget)}) scale(1.05)`;
            }
        }, 50);

        // Фіксація взяття воріт
        setTimeout(() => {
            totalGoals++;
            message.textContent = `GÓL! (${totalGoals}/3)`;
            
            if (currentPlayer === 'dembele') {
                scorePSG++;
                scorePsgEl.textContent = scorePSG;
            } else {
                scoreArsenal++;
                scoreArsenalEl.textContent = scoreArsenal;
            }

            if (totalGoals >= 3) {
                setTimeout(() => {
                    endScreen.style.display = 'flex';
                }, 800); 
            } else {
                // Швидкий автоскид позицій
                setTimeout(() => {
                    resetPositions();
                }, 900);
            }
        }, 600);
    });
});

function resetPositions() {
    message.textContent = "Vyberte cíl a střílejte!";
    kicker.src = `${currentPlayer}_stand.png`;
    kicker.className = 'kicker-stand';
    
    ball.style.transform = 'translateX(-50%)';
    ball.style.transition = 'none';
    
    goalkeeper.src = 'goalkeeper_center.png';
    goalkeeper.style.transform = 'translateX(-50%)';
    
    isPlaying = false;
}

// КООРДИНАТИ ОСІ X
function getBallX(t) { 
    if (t === 'up_left') return '-168px';   
    if (t === 'down_left') return '-162px'; 
    if (t === 'up_right') return '102px';   
    if (t === 'down_right') return '110px'; 
    if (t === 'up_center' || t === 'down_center') return '-22px'; 
    return '0px'; 
}

// КООРДИНАТИ ОСІ Y 
function getBallY(t) { 
    if (t === 'up_left') return '-305px';    
    if (t === 'up_right') return '-295px';   
    if (t === 'up_center') return '-305px';  
    if (t === 'down_left') return '-250px';  
    if (t === 'down_right') return '-250px'; 
    if (t === 'down_center') return '-242px';
    return '-210px'; 
}

function getGoalkeeperX(t) { return t.includes('left') ? '-90px' : '95px'; }
function getGoalkeeperY(t) { return t.includes('up') ? '-20px' : '20px'; }

// РОЗУМНИЙ РЕСАЙЗЕР ПІД СМАРТФОНИ 9:16
function resizeGame() {
    const container = document.querySelector('.game-container');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    let scale = windowWidth / 360;
    if ((640 * scale) > windowHeight) {
        scale = windowHeight / 640;
    }
    
    container.style.transform = `scale(${scale})`;
    container.style.transformOrigin = 'center top'; 
}

window.addEventListener('resize', resizeGame);
window.addEventListener('load', resizeGame);
resizeGame();

// ==========================================
// ЗАТРИМКА ДЛЯ ТІКТОК ПІКСЕЛЯ (КНОПКА БОНУСУ)
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const bonusBtn = document.querySelector('.bonus-btn');
    
    if (bonusBtn) {
        bonusBtn.addEventListener('click', function(event) {
            event.preventDefault(); 
            
            const offerUrl = this.getAttribute('href');
            
            if (typeof ttq !== 'undefined') {
                ttq.track('ClickButton'); 
            }
            
            setTimeout(function() {
                if(offerUrl && offerUrl !== '#') {
                    window.location.href = offerUrl;
                }
            }, 400);
        });
    }
});