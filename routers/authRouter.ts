import { Router, type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getErrorString, nextId } from "../server";
import { getBadRequest, getNotFound, getOk } from "../utils/requestHelpers";
import User from "../entities/User";
import users from "../mock/users";
import { hashPassword, verifyPassword } from "../utils/password";

const authRouter: Router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация пользователя
 *     description: Создает нового пользователя с хешированным паролем
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - age
 *             properties:
 *               username:
 *                 type: string
 *                 example: ivan
 *               password:
 *                 type: string
 *                 example: qwerty123
 *               age:
 *                 type: integer
 *                 example: 20
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: ab12cd
 *                 username:
 *                   type: string
 *                   example: ivan
 *                 age:
 *                   type: integer
 *                   example: 20
 *                 hashedPassword:
 *                   type: string
 *                   example: $2b$10$kO6Hq7ZKfV4cPzGm8u7mEuR7r4Xx2p9mP0q3t1yZbCq9Lh5a8b1QW
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
*     tags: [Auth]
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
*       200:
*         description: Успешная авторизация
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 login:
*                   type: boolean
*                   example: true
*       400:
*         description: Отсутствуют обязательные поля
*       401:
*         description: Неверные учетные данные
*       404:
*         description: Пользователь не найден
Теперь регистрация выглядит следующим образом:
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
    return res.status(StatusCodes.FORBIDDEN).send("Неверный пароль.");
  }

  return getOk(res, `Здравствуйте, ${u.first_name}.`);
});

export default authRouter;
