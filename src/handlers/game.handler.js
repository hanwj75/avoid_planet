import { Socket } from "socket.io";
import { getGameAssets } from "../init/assets.js";
import { clearItems } from "../models/item.model.js";
import { clearStage, getStage, setStage } from "../models/stage.model.js";
import { redisClient } from "../redis.js";

export const gameStart = (uuid, payload) => {
  const { stages } = getGameAssets();
  //접속하자마자 시작함
  //접속하자마자 스테이지의 정보를 넣어줘야함

  //새 게임 시작시 이전 데이터 삭제
  clearStage(uuid);
  clearItems(uuid);
  //stages 배열의 0번째 === 첫 스테이지
  setStage(uuid, stages.data[0].id);
  // console.log("스테이지:", getStage(uuid));
  return { status: "success" };
};

export const gameEnd = async (uuid, payload) => {
  //게임 종료 시 총 점수
  const { stages } = getGameAssets();
  const { score } = payload;
  const userStage = getStage(uuid);

  if (!userStage.length) {
    // console.log("userStage:", userStage.length);
    return { status: "fail", message: "스테이지가 이상합니다." };
  }
  //redis 정보 저장 갱신

  const readScore = await redisClient.smembers("user");
  const mapRead = readScore.map((x) => x.split(":"));
  const filterRead = mapRead.filter((userUUID) => userUUID[0] === uuid);
  // console.log(filterRead);
  if (filterRead.length === 0) {
    await redisClient.sadd("user", `${uuid}:${score}`);
    return { status: "success", message: "게임 종료" };
  } else {
    if (filterRead[0][1] < score) {
      await redisClient.srem("user", `${filterRead[0].join(":")}`);
      await redisClient.sadd("user", `${uuid}:${score}`);
      console.log("score:", score);
      return { status: "success", message: "점수 업데이트" };
    }
  }
};
