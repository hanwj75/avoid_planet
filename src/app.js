import express from "express";
import { createServer } from "http";
import initSocket from "./init/socket.js";
import { loadGameAssets } from "./init/assets.js";
import { redisClient } from "./redis.js";

const app = express();
const server = createServer(app);

const PORT = 3333;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

initSocket(server);

app.use("/api/gethighscore/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const readScore = await redisClient.smembers("user");
    const mapRead = readScore.map((x) => x.split(":"));
    // console.log(mapRead);
    const filterRead = mapRead.filter((userUUID) => userUUID[0] === userId);
    // console.log(filterRead);
    return res.json(filterRead);
  } catch (err) {
    console.error(err);
  }
});

server.listen(PORT, async () => {
  console.log(`${PORT}포트가 열림`);
  try {
    const assets = await loadGameAssets();
    console.log(assets);

    console.log("Assets 파일 제대로 읽음");
  } catch (err) {
    console.error("Game Assets 이상함" + err.message);
  }
});
