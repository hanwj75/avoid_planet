import { sendEvent, userId } from "./Socket.js";
import stages from "./assets/stage.json" with { type: "json" };
import itemUnlock from "./assets/item_unlock.json" with { type: "json" };
import items from "./assets/item.json" with { type: "json" };
import { gameover, setupGameReset } from "./index.js";
import { score } from "./index.js";

class Score {
  score = 0;
  HIGH_SCORE_KEY = "highScore";
  stageChange = true;
  stageIndex = 0;
  stageMessageVisible = false; // 스테이지 메시지 표시 여부
  bossMessageVisible = false;
  stageMessageTimer = 0; // 메시지 표시 시간
  gameClear = false;
  scoreUpdate = 0;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {
    this.scoreUpdate += (deltaTime + stages.data[this.stageIndex].scorePerSecond) * 0.01;
    if (this.scoreUpdate >= stages.data[this.stageIndex].scorePerSecond) {
      this.score += this.scoreUpdate;
      this.scoreUpdate -= this.scoreUpdate;
    }
    if (Math.floor(this.score) > stages.data[this.stageIndex].score) {
      this.stageChange = false;

      console.log("현재 스테이지:", stages.data[this.stageIndex].id);
      if (this.stageIndex + 1 < stages.data.length) {
        sendEvent(11, {
          currentStage: stages.data[this.stageIndex].id,
          targetStage: stages.data[this.stageIndex + 1].id,
          clientScore: this.score,
          stageIndex: this.stageIndex,
        });
        this.stageIndex += 1;

        // 스테이지 메시지 표시
        this.stageMessageVisible = true;
        this.stageMessageTimer = 0; // 타이머 초기화
      } else if (!(this.stageIndex === stages.data[this.stageIndex].id.length - 1)) {
        this.gameClear = true;

        sendEvent(3, {
          score: Math.floor(this.score),
        });
      }
    }
    if (Math.floor(this.score) < stages.data[this.stageIndex].score) {
      this.stageChange = true;
    }
    // 스테이지 메시지 타이머 업데이트
    if (this.stageMessageVisible && !stages.data.length - 1) {
      this.stageMessageTimer += deltaTime;
      if (this.stageMessageTimer > 1500) {
        // 1.5초 후에 메시지 사라짐
        this.stageMessageVisible = false;
      }
    }
  }

  getItem(itemId) {
    for (let i = 0; i < items.data.length; i++) {
      if (itemId === items.data[i].id) {
        this.score += items.data[i].score;
        sendEvent(10, {
          currentItem: items.data[i].id,
          stageIndex: this.stageIndex,
        });
      }
    }
  }

  reset() {
    this.score = 0;
    this.stageIndex = 0;
    this.gameClear = false;
  }
  /**
   * @todo 총 점수 반영안됨 그거 수정해야함
   */
  async setHighScore() {
    try {
      const res = await fetch(`/api/gethighscore/${userId}`);

      const data = await res.json();

      // console.log("data", data);
    } catch (err) {
      console.error(err);
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
    this.ctx.fillStyle = "#11111";

    const scoreX = this.canvas.width - 300 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    // "은하" 텍스트를 맨 왼쪽에 배치
    const stageText = `${this.stageIndex * 340}억 은하`;
    const stageX = 20 * this.scaleRatio; // 왼쪽 여백
    this.ctx.fillText(stageText, stageX, y);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);

    // 스테이지 메시지 가운데 표시

    if (this.stageMessageVisible) {
      const fontSize = 100 * this.scaleRatio;
      this.ctx.font = `${fontSize}px Verdana`;
      this.ctx.fillStyle = "purple";
      const x = this.canvas.width / 3.1;
      const y = this.canvas.height / 1.9;
      this.ctx.fillText(`${this.stageIndex * 340}억 은하`, x, y);
    }

    if (this.bossMessageVisible) {
      const fontSize = 100 * this.scaleRatio;
      this.ctx.font = `${fontSize}px Verdana`;
      this.ctx.fillStyle = "red";
      const x = this.canvas.width / 3.1;
      const y = this.canvas.height / 1.9;
      this.ctx.fillText(`BOSS STAGE`, x, y);
    }
  }
}

export default Score;
