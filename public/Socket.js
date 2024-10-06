import { CLIENT_VERSION } from "./Constants.js";

const socket = io("http://43.201.251.2:3333", {
  query: {
    clientVersion: CLIENT_VERSION,
  },
});

let userId = null;
socket.on("response", async (data) => {
  console.log("responseClient", data);
  if (!data || Object.keys(data).length === 0) {
    console.log("빈 응답 수신");
  }
});

socket.on("connection", (data) => {
  console.log("connection: ", data);
  userId = data.uuid;
});

const sendEvent = async (handlerId, payload) => {
  socket.emit("event", {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

export { sendEvent, userId };
