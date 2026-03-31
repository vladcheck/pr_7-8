import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { UserEntity } from "../entities/User";
import authMiddleware from "../middleware/authMiddleware";
import dbAdapter from "../utils/DbAdapter";
import { getBadRequest, getNotFound, getOk } from "../utils/requestHelpers";
import type { Response, Request } from "express";
import path from "node:path";
import roleMiddleware from "../middleware/roleMiddleware";

const usersRouter: Router = Router();
const usersPath = path.resolve(__dirname, "../db/users.json");

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *       - id
 *       - firstName
 *       - lastName
 *       - email
 *       - password
 *      properties:
 *        id:
 *          type: string
 *          description: Уникальный ID пользователя
 *        firstName:
 *          type: string
 *          description: Имя
 *        lastName:
 *          type: string
 *          description: Фамилия
 *        email:
 *          type: string
 *          description: Почта, она же и логин
 *        password:
 *          type: string
 *          description: Пароль
 *      example:
 *        id: "adfs31"
 *        firstName: Сергей
 *        lastName: Овчинников
 *        email: sergei_ovchinnikov@yandex.ru
 *        password: "12345678"
 */

/**
 * @swagger
 * /api/users:
 *  get:
 *    summary: Получить всех пользователей
 *    tags: [Users]
 *    responses:
 *      200:
 *        descrition: Пользователи найдены
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/User'
 */
usersRouter.get("/", async (_req: Request, res: Response) => {
  const entries: UserEntity[] = await dbAdapter.readEntries(usersPath);
  return res.status(StatusCodes.OK).json(entries);
});

/**
 * @swagger
 * /api/users/:id:
 *  get:
 *    summary: Получить пользователя по ID
 *    tags: [Users]
 *    responses:
 *      400:
 *        description: ID не определен
 *      404:
 *        description: Пользователя с таким ID не существует
 *      200:
 *        description: Пользователь найден
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *  delete:
 *    summary: Удалить пользователя по ID
 *    tags: [Users]
 *    responses:
 *      400:
 *        description: ID не определен
 *      404:
 *        description: Пользователя с таким ID не существует
 *      200:
 *        description: Пользователь удален
 */
usersRouter
  .get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return getBadRequest(res);
    }
    const entries: UserEntity[] = await dbAdapter.readEntries(usersPath);
    const user = entries.find((u) => u.id === id);
    if (!user) {
      return getNotFound(res);
    }

    return res.status(StatusCodes.OK).json(user);
  })
  .delete(
    "/:id",
    authMiddleware,
    roleMiddleware(["admin"]),
    async (req: Request, res: Response) => {
      const { id } = req.params;
      if (!id) {
        return getBadRequest(res, "uid not provided");
      }

      try {
        await dbAdapter.deleteEntryById(usersPath, id as string);
        return getOk(res, "user deleted");
      } catch (error) {
        console.error(error);
        return getNotFound(
          res,
          `user with id ${id} was not found or doesn't exist`,
        );
      }
    },
  );

export default usersRouter;
