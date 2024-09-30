import { getStage } from "../models/stage.model.js";

//다음 스테이지
export const moveStageHandler = (userId, payload) => {
  //유저는 스테이지를 하나씩 올라갈수있음 1->2  2->3
  //유저는 일정 조건을 달성하면 다음 스테이지로 넘어감

  //현재스테이지,다음스테이지 보내주기
  //현재 스테이지 정보
  let currentStages = getStage(userId);
  if (!currentStages.length) {
    return { status: "fail", message: "스테이지가 없습니다." };
  }

  return { status: "success" };
};
