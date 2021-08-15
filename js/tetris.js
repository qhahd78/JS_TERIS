// 블럭 가져오기
import BLOCKS from "./blocks.js";

// ---- DOM ----
// ul 가져오기 (테트리스 게임 공간)
const playground = document.querySelector(".playground > ul");
// 게임오버시 text
const gameText = document.querySelector(".game-text");
// 점수 text
const scoreDisplay = document.querySelector(".score");
// 다시시작 버튼
const restartButton = document.querySelector(".game-text > button");

// ---- SETTING ----
// 세로 20줄
const GAME_ROWS = 20;
// 가로 10줄
const GAME_COLS = 10;


// ---- VARIABLES ----
// 점수 
let score = 0;
// 블럭이 떨어지는 시간 
let duration = 500;
// 변수 선언만
let downInterval;
let tempMovingItem;

// 블록 조작
const movingItem = {
    type: "", 
    direction: 3,
    top: 0, 
    left: 0, 
}


// 게임 판을 만들어주는 함수 prependNewLine
// li 20줄 만들기 . li 안에 ul 안에 li => 블록 하나하나 10개
const prependNewLine = () => {
    // li, ul element 만들기 
    const li = document.createElement("li");
    const ul = document.createElement("ul");
    // 블록(li) 10개 만들어서 ul(한 줄) 에 넣음
    // for 문 10번 반목(블록 10개 만들어서 ul 에 넣기)
    for(let j = 0; j < GAME_COLS; j++) {
        // 한 블록을 만들어서 
        const matrix = document.createElement("li");
        // ul(한 줄) 에 넣는다. 
        ul.prepend(matrix);
    }
    // ul 을 li 에 넣기 
    // 만들어진 블록 10개를 li(한 줄에 해당) 에 넣음 
    li.prepend(ul);
    // li 를 게임 판에 넣기 
    // 만들어진 한 줄 한 줄을 playground 안에 넣음 
    playground.prepend(li);
}

// 아래에 블록이 있는지 없는지 체크하는 함수 
const checkEmpty = (target) => {
    // contains ? : 괄호 안에 있는 클래스가 있는지 없는지 판별 
    if(!target || target.classList.contains("seized")) {
        // 빈값이 아님. 
        return false;
    }
    return true;
}

// seizeBlock 으로 블럭이 고정되면, 새로운 블럭 만들기 
const generateNewBlock = () => {

    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock('top',1);
    }, duration)

    // object.entries(BLOCKS).length : blocks 의 길이 반환 
    const blockArray = Object.entries(BLOCKS);
    // Math.floor : 소숫점 자르기 
    const randomIndex = Math.floor(Math.random() * blockArray.length)
    // 랜덤 블록 생성 
    movingItem.type = blockArray[randomIndex][0]
    // 나올 블럭 위치. 가운데 맨 꼭대기 
    movingItem.top = 0;
    movingItem.left = 3; 
    movingItem.direction = 0;

    tempMovingItem = { ...movingItem };
    renderBlocks()
}

const checkMatch = () => {
    const childNodes = playground.childNodes;
    // 한 줄씩 돌기
    childNodes.forEach(child => {
        let matched = true;
        // 블럭 하나하나 돌기 
        child.children[0].childNodes.forEach(li => {
            // 줄이 완성이 된 block 은 seized 클래스를 가진다. 
            // seized 가 없으면 false 반환 
            if(!li.classList.contains("seized")){
                matched = false;
            }
        })
        // matched 가 true 일 경우만 (한 줄이 다 채워졌을 경우에만)
        // 함수 실행 
        if(matched){
            // 한 줄을 없앰과 동시에 맨 윗줄 추가 
            child.remove();
            prependNewLine();
            score++;
            scoreDisplay.innerText = score;
        }
    })
    generateNewBlock();
}

// 아래로 더이상 내려가지 못 하게 고정 
const seizeBlock = () => {
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove("moving");
        moving.classList.add("seized");
    })
    checkMatch();
    
}

// 게임 오버 함수 
const showGameoverText = () => {
    gameText.style.display = "flex";
}

// 블럭을 그리는 함수 
// moveType 이 없을 경우 null 로 들어오게 
const renderBlocks = (moveType = "") => {
    // 구조분해 할당으로 tempMovingItem 에 있는 값들을 변수로 바로 사용 
    const { type, direction, top, left } = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");
    // 움직이는 블록은 moving 클래스를 빼준다. 
    movingBlocks.forEach(moving => {
        moving.classList.remove(type, "moving");
    })
    // 블록 만들기 
    // some 을 사용해 원하는 시점에서 반복문 종료 
    BLOCKS[type][direction].some(block => {
        const x = block[0] + left;
        const y = block[1] + top;
        // 범위에서 벗어날 경우 null. 
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailable = checkEmpty(target);
        if(isAvailable){
            target.classList.add(type, "moving");
        } else {
            // 좌표를 원상태로
            tempMovingItem = { ...movingItem };
            if (moveType === 'retry'){
                clearInterval(downInterval);
                showGameoverText();
            }
            // 스택 무한으로 부르는 것을 방지
            setTimeout(() => {
                // renderBlocks 가 두 번이 넘어갈 경우 retry 
                renderBlocks('retry');
                // 아래로 더이상 움직일 수 없을 경우 
                if(moveType === "top"){
                    // 더 이상 내려갈 수 없도록 고정
                    seizeBlock();
                }
                // 재귀함수로 새 블럭을 불러온다. 
            }, 0);
            return true;
            
        }
    })
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
}

// 블록을 움직이게 하는 함수
const moveBlock = (moveType, amount) => {
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType);
};

// 방향을 바꾸는 함수 
const changeDirection = () => {
    const direction = tempMovingItem.direction;
    // 1씩 더하다가 3이면 0으로 초기화 
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1;
    renderBlocks();
}

// 스페이스바를 누를시 바로 내려오게 하는 함수 
const dropBlock = () => {
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock("top", 1);
    }, 10);
}

// 시작 함수 
const init = () => {
    score = 0;
    scoreDisplay.innerText = score;
    // 스프레드 연잔자 : movingItem 자체가 아닌, 안의 값만 불러온다. 
    tempMovingItem = { ...movingItem };
    for(let i = 0; i < GAME_ROWS; i++) {
        prependNewLine();
    }
    generateNewBlock()
}

// ---- event handling ----
document.addEventListener("keydown", e => {
    // 방향키에 따라 블록 이동
    switch(e.keyCode){
        // 오른쪽 
        case 39: 
            moveBlock("left", 1);
            break;
        // 왼쪽
        case 37:
            moveBlock("left", -1);
            break;
        // 아래쪽
        case 40:
            moveBlock("top", 1);
            break;
        // 위쪽 (블록 돌리기)
        case 38:
            changeDirection();
            break;
        // 스페이스바
        case 32:
            dropBlock();
        default: 
            break
    }
})

restartButton.addEventListener("click", () => {
    playground.innerHTML = "";
    gameText.style.display = "none";
    init();
})

// 스크립트 시작 
init();