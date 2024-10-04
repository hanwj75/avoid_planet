import { getGameAssets } from "../init/assets.js";
import { clearItems } from "../models/item.model.js";
import { clearStage, getStage, setStage } from "../models/stage.model.js";

export const gameStart = (uuid, payload) => {
  //접속하자마자 시작함
  //접속하자마자 스테이지의 정보를 넣어줘야함
  const { stages } = getGameAssets();

  //새 게임 시작시 이전 데이터 삭제
  clearStage(uuid);
  clearItems(uuid);
  //stages 배열의 0번째 === 첫 스테이지
  setStage(uuid, stages.data[0].id);
  console.log("스테이지:", getStage(uuid));
  return { status: "success" };
};

export const gameEnd = (uuid, payload) => {
  //게임 종료 시 총 점수
  const { score } = payload;
  const stages = getStage(uuid);

  if (!stages.length) {
    return { status: "fail", message: "스테이지가 이상합니다." };
  }

  //각 스테이지의 지속 시간을 계산하여 총 점수 계산
  let totalScore = 0;
  let gameEndScore = score;
  stages.forEach((stage, index) => {
    let stageEnds;

    if (index === stages.length - 1) {
      stageEnds = gameEndScore;
    } else {
      gameEndScore = stages[score];
    }
    const stageDuration = gameEndScore;
    totalScore += stageDuration;
  });
  //점수검증
  if (Math.abs(score - totalScore) > 5) {
    return { status: "fail", message: "점수 에러" };
  }

  return { status: "success", message: "게임 종료", score };
};
