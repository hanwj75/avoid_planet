import { getGameAssets } from "../init/assets.js";
import { getStage, setStage } from "../models/stage.model.js";

export const gameStart = (uuid, payload) => {
  //접속하자마자 시작함
  //접속하자마자 스테이지의 정보를 넣어줘야함
  const { stages } = getGameAssets();
  //stages 배열의 0번째 === 첫 스테이지
  setStage(uuid, stages.data[0].id, payload.timeStamp);
  console.log("스테이지:", getStage(uuid));
  return { status: "success" };
};

export const gameEnd = (uuid, payload) => {
  return { status: "success" };
};
