import { sendEvent } from "./Socket.js";

class Score {
  score = 0;
  HIGH_SCORE_KEY = "highScore";
  stageChange = true;
  currentStage = 1000;
  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {
    this.score += deltaTime * 0.01;
    if (Math.floor(this.score) % 100 === 0 && this.stageChange) {
      this.stageChange = false;

      console.log("현재 스테이지:", this.currentStage);
      sendEvent(11, {
        currentStage: this.currentStage,
        targetStage: this.currentStage + 1,
        clientTime: this.score,
      });

      this.currentStage += 1;
    }
    if (Math.floor(this.score) % 100 !== 0) {
      this.stageChange = true;
    }
  }

  getItem(itemId) {
    const scoreMap = {
      1: 10,
      2: 50,
      3: 100,
      4: 1000,
    };
    if (scoreMap[itemId]) {
      this.score += scoreMap[itemId];
    }
  }

  reset() {
    this.score = 0;
    this.currentStage = 1000;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = "#525250";

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
