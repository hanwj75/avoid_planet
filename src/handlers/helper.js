import { CLIENT_VERSION } from "../constants.js";
import { getGameAssets } from "../init/assets.js";
import { getStage, setStage } from "../models/stage.model.js";
import { getUser, removeUser } from "../models/user.model.js";
import handlerMapping from "./handlerMapping.js";

export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id);
  console.log(`유저 접속 종료:${socket.id}`);
  console.log(`현재 접속중인 유저:`, getUser());
};

export const handlerConnection = (socket, uuid) => {
  console.log(`새로운 유저 접속:${uuid} 의 socket ID :${socket.id}`);
  console.log(`현재 접송중인 유저:`, getUser());

  //접속하자마자 시작함
  //접속하자마자 스테이지의 정보를 넣어줘야함
  const { stages } = getGameAssets();
  //stages 배열의 0번째 === 첫 스테이지
  setStage(uuid, stages.data[0].id);
  console.log("스테이지:", getStage(uuid));

  socket.emit("connection", { uuid }); //connection발사
};

export const handlerEvent = (io, socket, data) => {
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit("response", { status: "fail", message: "클라이언트 버전이 잘못됨" });
    return;
  }
  //핸들러 찾기
  const handler = handlerMapping[data.handlerId];
  if (!handler) {
    socket.emit("response", { status: "fail", message: "핸들러 없음" });
    return;
  }
  //핸들러 실행
  const response = handler(data.userId, data.payload);
  if (response.broadcast) {
    io.emit("response", "broadcast");
  }

  socket.emit("response", response);
};
