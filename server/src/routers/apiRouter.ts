import { Router, type Request, type Response } from "express";
import authRouter from "./authRouter";
import usersRouter from "./usersRouter";
import productsRouter from "./productsRouter";
import { getOk } from "../utils/requestHelpers";

const apiRouter: Router = Router();
apiRouter.use("/api/auth", authRouter);
apiRouter.use("/api/users", usersRouter);
apiRouter.use("/api/products", productsRouter);

/*\
 * @swagger
 * /:
 *  get:
 *    summary: Возвращает OK
 *    description: Возвращает OK для проверки, что сервер запущен
 *    responses:
 *      200:
 *        description: Сервер работает
 */
apiRouter.get("/api/", async (_req: Request, res: Response) => {
  return getOk(res);
});

export default apiRouter;
