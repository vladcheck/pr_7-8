import express from "express";
import cors from "cors";
import morgan from "morgan";
import { swaggerParams } from "./src/swagger";
import apiRouter from "./src/routers/apiRouter";
import path from "node:path";

const STATIC_ROUTE = "/api/public";
const staticPath = path.join(__dirname, "public");
const PORT = process.env["PORT"] || "3000";

const app = express();
app.disable("x-powered-by"); // обфускация стека технологий

app
  .use(...swaggerParams)
  .use(cors())
  .use(morgan("dev"))
  .use(express.json())
  .use(STATIC_ROUTE, express.static(staticPath))
  .use(apiRouter);

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
  console.log(
    `Swagger UI доступен по адресу http://localhost:${PORT}/api-docs`,
  );
});
