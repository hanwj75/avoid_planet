import Player from "./Player.js";
import Ground from "./Ground.js";
import CactiController from "./CactiController.js";
import Score from "./Score.js";
import ItemController from "./ItemController.js";
import "./Socket.js";
import { sendEvent } from "./Socket.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

//게임 속도 조절
const GAME_SPEED_START = 1;
const GAME_SPEED_INCREMENT = 0.00001;

// 게임 크기
const GAME_WIDTH = 1500;
const GAME_HEIGHT = 1000;

// 플레이어
// 800 * 200 사이즈의 캔버스에서는 이미지의 기본크기가 크기때문에 1.5로 나눈 값을 사용. (비율 유지)
const PLAYER_WIDTH = 88 / 1; // 58
const PLAYER_HEIGHT = 94 / 1.5; // 62
const MAX_JUMP_HEIGHT = GAME_HEIGHT;
const MIN_JUMP_HEIGHT = 150;

// 땅
const GROUND_WIDTH = 2400;
const GROUND_HEIGHT = 24;
const GROUND_SPEED = 0.5;

// 선인장
const CACTI_CONFIG = [
  { width: 100 / 0.8, height: 100 / 0.8, image: "images/몬스터1.png" },
  { width: 70 / 0.3, height: 70 / 0.3, image: "images/초록공-removebg-preview.png" },
  { width: 99 / 0.5, height: 99 / 0.5, image: "images/파란공-removebg-preview.png" },
  { width: 100 / 1.5, height: 100 / 1.5, image: "images/테스트용1-removebg-preview.png" },
];

// 아이템
const ITEM_CONFIG = [
  {
    width: 100 / 1.5,
    height: 100 / 1.5,
    id: 1,
    image: "images/items/스크린샷_2024-10-06_001338-removebg-preview.png",
  },
  {
    width: 100 / 1.4,
    height: 100 / 1.4,
    id: 2,
    image: "images/items/스크린샷_2024-10-06_001345-removebg-preview.png",
  },
  {
    width: 100 / 1.3,
    height: 100 / 1.3,
    id: 3,
    image: "images/items/스크린샷_2024-10-06_001354-removebg-preview.png",
  },
  {
    width: 100 / 1.2,
    height: 100 / 1.2,
    id: 4,
    image: "images/items/스크린샷_2024-10-06_001401-removebg-preview.png",
  },
  {
    width: 100 / 1.1,
    height: 100 / 1.1,
    id: 5,
    image: "images/items/스크린샷_2024-10-06_001406-removebg-preview.png",
  },
  {
    width: 100 / 0.9,
    height: 100 / 0.9,
    id: 6,
    image: "images/items/스크린샷_2024-10-06_001411-removebg-preview.png",
  },
];

// 게임 요소들
let player = null;
let ground = null;
let cactiController = null;
let itemController = null;
let score = null;

let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let gameover = false;
let hasAddedEventListenersForRestart = false;
let waitingToStart = true;

function createSprites() {
  // 비율에 맞는 크기
  // 유저
  const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
  const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
  const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
  const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;

  // 땅
  const groundWidthInGame = GROUND_WIDTH * scaleRatio;
  const groundHeightInGame = GROUND_HEIGHT * scaleRatio;

  player = new Player(
    ctx,
    playerWidthInGame,
    playerHeightInGame,
    minJumpHeightInGame,
    maxJumpHeightInGame,
    scaleRatio,
  );

  ground = new Ground(ctx, groundWidthInGame, groundHeightInGame, GROUND_SPEED, scaleRatio);

  const cactiImages = CACTI_CONFIG.map((cactus) => {
    const image = new Image();
    image.src = cactus.image;
    return {
      image,
      width: cactus.width * scaleRatio,
      height: cactus.height * scaleRatio,
    };
  });

  cactiController = new CactiController(ctx, cactiImages, scaleRatio, GROUND_SPEED);

  const itemImages = ITEM_CONFIG.map((item) => {
    const image = new Image();
    image.src = item.image;
    return {
      image,
      id: item.id,
      width: item.width * scaleRatio,
      height: item.height * scaleRatio,
    };
  });

  itemController = new ItemController(ctx, itemImages, scaleRatio, GROUND_SPEED);

  score = new Score(ctx, scaleRatio);
}

function getScaleRatio() {
  const screenHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
  const screenWidth = Math.min(window.innerHeight, document.documentElement.clientWidth);

  // window is wider than the game width
  if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
    return screenWidth / GAME_WIDTH;
  } else {
    return screenHeight / GAME_HEIGHT;
  }
}

function setScreen() {
  scaleRatio = getScaleRatio();
  canvas.width = GAME_WIDTH * scaleRatio;
  canvas.height = GAME_HEIGHT * scaleRatio;
  createSprites();
}

setScreen();
window.addEventListener("resize", setScreen);

if (screen.orientation) {
  screen.orientation.addEventListener("change", setScreen);
}

//게임 시작 종료 텍스트 부분
function showGameOver() {
  const fontSize = 50 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = "red";
  const x = canvas.width / 6;
  const y = canvas.height / 2;
  ctx.fillText("당신은 우주의 똥이 되었습니다...", x, y);
}

function showStartGameText() {
  const fontSize = 45 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = "Pink";
  const x = canvas.width / 100;
  const y = canvas.height / 2;
  ctx.fillText("우주 여행을 시작하려면 아무키나 입력하세요.", x, y);
}

//모든 스테이지 클리어시 나올 텍스트
function showGameClear() {
  const fontSize = 80 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = "yellow";

  const x = canvas.width / 10;
  let y = canvas.height / 2;

  // 텍스트를 줄바꿈 문자로 분리
  const lines = ["모든 은하를 통과했습니다!", "지구로 돌아갑니다🌎"];

  // 각 줄을 그리기
  lines.forEach((line) => {
    ctx.fillText(line, x, y);
    // y 위치를 아래로 이동
    y += fontSize; // 다음 줄의 y 위치 조정
  });
}

function updateGameSpeed(deltaTime) {
  gameSpeed += deltaTime * GAME_SPEED_INCREMENT;
}

function reset() {
  hasAddedEventListenersForRestart = false;
  gameover = false;
  waitingToStart = false;

  ground.reset();
  cactiController.reset();
  score.reset();
  gameSpeed = GAME_SPEED_START;
  itemController.reset();
  score = new Score(ctx, scaleRatio);
  sendEvent(2, { timeStamp: Date.now() });
}

export function setupGameReset() {
  if (!hasAddedEventListenersForRestart) {
    hasAddedEventListenersForRestart = true;

    setTimeout(() => {
      window.addEventListener("keyup", reset, { once: true });
    }, 1000);
  }
}

function clearScreen() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameLoop(currentTime) {
  if (previousTime === null) {
    previousTime = currentTime;
    requestAnimationFrame(gameLoop);
    return;
  }

  // 모든 환경에서 같은 게임 속도를 유지하기 위해 구하는 값
  // 프레임 렌더링 속도
  const deltaTime = currentTime - previousTime;
  previousTime = currentTime;

  clearScreen();

  if (!gameover && !waitingToStart) {
    // update
    // 땅이 움직임
    ground.update(gameSpeed, deltaTime - 4);
    // 선인장
    cactiController.update(gameSpeed, deltaTime * 2);
    itemController.update(gameSpeed, deltaTime);
    // 달리기
    player.update(gameSpeed, deltaTime - 1);
    updateGameSpeed(deltaTime + 1);

    score.update(deltaTime);
  }

  if (!gameover && cactiController.collideWith(player)) {
    gameover = true;
    score.setHighScore();
    setupGameReset();
  }
  //게임 클리어시
  if (score.gameClear === true) {
    gameover = true;
    score.setHighScore();
    setupGameReset();
  }
  const collideWithItem = itemController.collideWith(player);
  if (collideWithItem && collideWithItem.itemId) {
    score.getItem(collideWithItem.itemId);
  }

  // draw
  ground.draw();
  player.draw();
  cactiController.draw();
  score.draw();
  itemController.draw();

  if (gameover && !score.gameClear) {
    showGameOver();
  }

  if (score.gameClear) {
    showGameClear();
  }

  if (waitingToStart) {
    showStartGameText();
  }

  // 재귀 호출 (무한반복)
  requestAnimationFrame(gameLoop);
}

// 게임 프레임을 다시 그리는 메서드
requestAnimationFrame(gameLoop);

window.addEventListener("keyup", reset, { once: true });

export { score, gameover };
