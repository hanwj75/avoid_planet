import express from "express";
import { createServer } from "http";
import initSocket from "./init/socket.js";

const app = express();
const server = createServer(app);

const PORT = 3333;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
initSocket(server);

app.get("/", (req, res) => {
  res.send(`<h1>Hello World</h1>`);
});

server.listen(PORT, () => {
  console.log(`${PORT}포트가 열림`);
});
