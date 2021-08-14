// ---- DOM ----
// ul 가져오기 
const playground = document.querySelector(".playground > ul");

// ---- SETTING ----
// 세로 
const GAME_ROWS = 20;
// 가로 
const GAME_COLS = 10;


// ---- VARIABLES ----
// 점수 
let score = 0;
// 블럭이 떨어지는 시간 
let duration = 500;
let downInterval;
let tempMovingItem;

// 블록 객체 
const BLOCKS = {
    tree: [
        // 회전할 시의 각각 모양 
        [[0,0],[0,1],[1,0],[1,1]],
        [],
        [],
        [],
    ]
}

// 블록 조작
const movingItem = {
    type: "tree", 
    direction: 0,
    top: 0, 
    left: 0, 
}


// 게임 판을 만들어주는 함수 prependNewLine
// li 20줄 만들기 . li 안에 ul 안에 li => 블록 하나하나 10개
const prependNewLine = () => {
    const li = document.createElement("li");
    const ul = document.createElement("ul");
    // 블록(li) 10개 만들어서 ul 에 넣음
    for(let j = 0; j < GAME_COLS; j++) {
        const matrix = document.createElement("li");
        ul.prepend(matrix);
    }
    // 만들어진 블록 10개를 li(한 줄에 해당) 에 넣음 
    li.prepend(ul);
    // 만들어진 한 줄 한 줄을 playground 안에 넣음 
    playground.prepend(li);
}

const 

// 시작 함수 
const init = () => {
    tempMovingItem = movingItem;
    for(let i = 0; i < GAME_ROWS; i++) {
        prependNewLine();
    }
}

// 스크립트 시작 
init();