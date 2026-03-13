import express from "express";
import { nanoid } from "nanoid";
import cors from "cors";
import morgan from "morgan";
import { swaggerParams } from "./src/config/swagger";
import apiRouter from "./src/routers/apiRouter";

const ID_SIZE = 6;
export const nextId = (id = ID_SIZE) => nanoid(id);

export const getErrorString = (msg: string, value: any, expected?: string) =>
  `${msg} (${value}).${expected && ` Ожидалось: ${expected}`}`;

const PORT = process.env["PORT"] || "3000";

const app = express();

app.disable("x-powered-by"); // обфускация стека технологий

app.use(...swaggerParams);
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use(apiRouter);

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
  console.log(
    `Swagger UI доступен по адресу http://localhost:${PORT}/api-docs`,
  );
});
