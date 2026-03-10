import { Router, type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../entities/User";
import users from "../mock/users";
import jwt, { JwtPayload } from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware";
import { getErrorString, nextId } from "../../server";
import { hashPassword, verifyPassword } from "../utils/password";
import {
  getBadRequest,
  getNotFound,
  getInternalServerError,
} from "../utils/requestHelpers";
import JwtSingleton from "../utils/jwt";

const authRouter: Router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация пользователя
 *     description: Создает нового пользователя с хешированным паролем
 *     tags: [Auth, Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - password
 *               - email
 *             properties:
 *                first_name:
 *                 type: string
 *                 example: Ivan
 *                last_name:
 *                  type: string
 *                  example: Sidelnikov
 *                password:
 *                 type: string
 *                 example: qwerty123
 *                email:
 *                 type: string
 *                 example: ivan@yandex.ru
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  id:
 *                    type: string
 *                    example: ab12cd
 *                  first_name:
 *                    type: string
 *                    example: Ivan
 *                  last_name:
 *                    type: string
 *                    example: Sidelnikov
 *                  email:
 *                    type: string
 *                    example: ivan@yandex.ru
 *                  hashedPassword:
 *                    type: string
 *                    example: $2b$10$kO6Hq7ZKfV4cPzGm8u7mEuR7r4Xx2p9mP0q3t1yZbCq9Lh5a8b1QW
 *       400:
 *         description: Некорректные данные
 */
authRouter.post("/register", async (req: Request, res: Response) => {
  const b = req.body;

  if (["email", "password", "first_name", "last_name"].some((key) => !b[key])) {
    return getBadRequest(res);
  }
  if (b.password.length < 4) {
    return getBadRequest(
      res,
      getErrorString("Слишком короткий пароль", b.password),
    );
  } else if (b.password.length > 32) {
    return getBadRequest(
      res,
      getErrorString("Слишком длинный пароль", b.password),
    );
  } else if (
    !b.password.match(/[a-zA-Z0-9_\{\}\[\]\(\);:!\?\$%\.\,\^\\\/]{4,32}/)
  ) {
    return getBadRequest(
      res,
      getErrorString(
        "Пароль может содержать только латинские буквы, цифры от 0 до 9, и символы !?:;.,$^/\[](){}%",
        b.password,
      ),
    );
  }

  if (!b.first_name.match(/[A-ZА-ЯЁ][a-zа-яё]{1,63}/)) {
    return getBadRequest(res, getErrorString("Некорретное имя", b.first_name));
  }

  if (!b.last_name.match(/[A-ZА-ЯЁ][a-zа-яё]{1,63}/)) {
    return getBadRequest(
      res,
      getErrorString("Некорретная фамилия", b.first_name),
    );
  }

  if (b.email.length < 5) {
    return getBadRequest(
      res,
      getErrorString("Почта не может быть короче пяти символов", b.first_name),
    );
  } else if (!b.email.match(/[a-zA-Z0-9_]{1,}@[a-z0-9]{1,}\.[ru|com|yahoo]/)) {
    return getBadRequest(
      res,
      getErrorString("Неправильная почта", b.first_name),
    );
  } else if (users.some((u) => u.email === b.email)) {
    return res
      .status(StatusCodes.CONFLICT)
      .send("Профиль с такой почтой уже существует.");
  }

  const u: User = {
    id: nextId(),
    first_name: b.first_name,
    last_name: b.last_name,
    email: b.email,
    hash: await hashPassword(b.password),
  };
  users.push(u);

  return res.status(StatusCodes.CREATED).json(u);
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Авторизация пользователя
 *     description: Проверяет логин и пароль пользователя
 *     tags: [Auth, Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: ivan
 *               password:
 *                 type: string
 *                 example: qwerty123
 *     responses:
 *       400:
 *         description: Отсутствуют обязательные поля или введены неверные учетные данные (напр. пароли не совпадают)
 *       404:
 *         description: Пользователь не найден
 *       200:
 *         description: Пользователь успешно авторизован
 */
authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return getBadRequest(res);
  }

  const u = users.find((u) => u.email === email);
  if (!u) {
    return getNotFound(res);
  }

  const passwordsMatch = await verifyPassword(password, u.hash);
  if (!passwordsMatch) {
    return getBadRequest(res, "Invalid credentials.");
  }

  const accessToken = JwtSingleton.grantAccessToken(
    u.id,
    Object.entries(u).filter(([k]) => {
      return k !== "id";
    }),
  );

  return res.status(StatusCodes.OK).json({ accessToken });
});

/**
 * @swagger
 * /api/auth/me:
 *  get:
 *    summary: Получить данные клиента, если он авторизован
 *    tags: [Users, Auth]
 *    description: Если клиент авторизован, то вернет информацию о нем
 *    headers:
 *      Authorization:
 *        required: true
 *    responses:
 *      500:
 *        description: Ошибка на стороне сервера
 *      404:
 *        description: Пользователь с таким ID не обнаружен
 *      200:
 *        description: Пользователь авторизован
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                id:
 *                  type: string
 *                  example: dfas12
 *                first_name:
 *                  type: string
 *                  example: Сергей
 *                last_name:
 *                  type: string
 *                  example: Овчинников
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 */
authRouter.get(
  "/me",
  authMiddleware,
  async (req: Request & JwtPayload, res: Response) => {
    const id = req["user"].sub;
    if (!id) {
      return getInternalServerError(res);
    }

    const u = users.find((u) => u.id === id);
    if (!u) {
      return getNotFound(res);
    }

    res.status(StatusCodes.OK).json(u);
  },
);

export default authRouter;
