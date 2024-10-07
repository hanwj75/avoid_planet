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

  //현재 redis에 존재하는 user의 정보를 모두 조회한다.
  const readScore = await redisClient.smembers("user");
  // 조회한 정보를 :를 기준으로 나눠준다.
  const mapRead = readScore.map((x) => x.split(":"));
  //2개로 나누어진 값중 0번째 인덱스에값이 uuid와 일치하는지 확인
  const filterRead = mapRead.filter((userUUID) => userUUID[0] === uuid);
  // console.log(filterRead);
  if (filterRead.length === 0) {
    //해당 uuid가 존재하지 않는다면 새로 추가
    await redisClient.sadd("user", `${uuid}:${score}`);
    return { status: "success", message: "게임 종료" };
  } else {
    if (filterRead[0][1] < score) {
      //이미 존재하는 uuid의 score가 새로 달성항 scoer보다 작다면
      //기존 데이터를 삭제하고 새로운 데이터를 재생성한다.
      await redisClient.srem("user", `${filterRead[0].join(":")}`);
      await redisClient.sadd("user", `${uuid}:${score}`);
      console.log("score:", score);
      return { status: "success", message: "점수 업데이트" };
    }
  }
};
