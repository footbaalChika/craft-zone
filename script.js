const goalkeeper = document.getElementById('goalkeeper');
const ball = document.getElementById('ball');
const kicker = document.getElementById('kicker');
const message = document.getElementById('message');
const targets = document.querySelectorAll('.target');
const startScreen = document.getElementById('start-screen');

let isPlaying = true; 
let currentPlayer = ''; 

const goalkeeperActions = ['up_left', 'up_right', 'down_left', 'down_right', 'up_center', 'down_center'];

// ЗАПУСК ГРИ ПІСЛЯ ВИБОРУ КОМАНДИ
window.startGame = function(player) {
    currentPlayer = player;
    // Скрипт автоматично підставить 'sparta_stand.png' або 'slavia_stand.png'
    kicker.src = `${player}_stand.png`;
    startScreen.style.display = 'none'; 
    isPlaying = false; 
}

targets.forEach(target => {
    target.addEventListener('click', function() {
        if (isPlaying) return; // Блокує екран після першого ж кліку
        isPlaying = true; 

        const playerTarget = this.getAttribute('data-target');
        
        // РОЗУМНИЙ ВОРОТАР
        let guaranteedMissActions = [];
        if (playerTarget === 'up_center' || playerTarget === 'down_center') {
            guaranteedMissActions = ['up_left', 'up_right', 'down_left', 'down_right'];
        } else {
            guaranteedMissActions = goalkeeperActions.filter(action => action !== playerTarget);
        }
        
        const goalkeeperTarget = guaranteedMissActions[Math.floor(Math.random() * guaranteedMissActions.length)];

        // Анімація удару (підставить 'sparta_kick.png' або 'slavia_kick.png')
        kicker.src = `${currentPlayer}_kick.png`;
        kicker.className = 'kicker-kick';

        let fixedImage = goalkeeperTarget;
        if (goalkeeperTarget === 'up_left') fixedImage = 'up_right';
        else if (goalkeeperTarget === 'up_right') fixedImage = 'up_left';
        else if (goalkeeperTarget === 'down_left') fixedImage = 'down_right';
        else if (goalkeeperTarget === 'down_right') fixedImage = 'down_left';

        // М'яч летить
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

        // Фіксація взяття воріт ТА ВИКЛИК ФІНАЛЬНОГО ВІКНА З КНОПКОЮ
        setTimeout(() => {
            message.textContent = `GÓL! ZPRACOVÁNÍ...`;
            
            // Поява екрана з кнопкою через 0.9 секунди
            setTimeout(() => {
                const finalScreen = document.getElementById('final-screen');
                finalScreen.style.display = 'flex';
            }, 900);
            
        }, 600);
    });
});

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

// РОЗУМНИЙ РЕСАЙЗЕР
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