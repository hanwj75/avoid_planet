import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

let gameAssets = {}; //전역변수 여기에 json파일값을 받아옴

const __filename = fileURLToPath(import.meta.url); //현재 파일의 절대 경로
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, "../../assets"); //파일 위치 찾기

//파일 읽는 함수
//비동기 병렬 비동기 파일을 병렬로 동시에 처리한다.
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filename), "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  }); //basePath로 찾은 파일을 매개변수로 받아온 filename과 함쳐준다. utf8 =유니코드 우리가 읽을수있는 문자로 바꿔주는 옵션 ,
};

//Promise.all
export const loadGameAssets = async () => {
  try {
    const [stages, items, itemUnlock] = await Promise.all([
      readFileAsync("stage.json"),
      readFileAsync("item.json"),
      readFileAsync("item_unlock.json"),
    ]);

    gameAssets = { stages, items, itemUnlock };
    return gameAssets;
  } catch (err) {
    throw new Error("assets파일 에러" + err.message);
  }
};

export const getGameAssets = () => {
  return gameAssets;
};
