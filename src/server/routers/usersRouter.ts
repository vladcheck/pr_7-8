import type { Request, Response } from "express";
import { getBadRequest, getNotFound } from "../src/utils/requestHelpers";
import { StatusCodes } from "http-status-codes";
import users from "../mock/users";
import { Router } from "express";

const usersRouter: Router = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *       - id
 *       - first_name
 *       - last_name
 *       - email
 *       - password
 *      properties:
 *        id:
 *          type: string
 *          description: Уникальный ID пользователя
 *        first_name:
 *          type: string
 *          description: Имя
 *        last_name:
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
 *        first_name: Сергей
 *        last_name: Овчинников
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
  return res.status(StatusCodes.OK).json(users);
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
 */
usersRouter.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return getBadRequest(res);
  }
  const user = users.find((u) => u.id === id);
  if (!user) {
    return getNotFound(res);
  }

  return res.status(StatusCodes.OK).json(user);
});

export default usersRouter;
