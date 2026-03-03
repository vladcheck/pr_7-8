import express, { json } from "express";
import { nanoid } from "nanoid";
import { swaggerParams } from "./swagger";
import type { Response, Request } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { getBadRequest, getNotFound, getOk } from "./utils/requestHelpers";
import Product from "./entities/Product";
import productsOriginal from "./mock/products";
import usersOriginal from "./mock/users";
import User from "./entities/User";
import { hashPassword, verifyPassword } from "./utils/password";

const ID_SIZE = 6;
const nextId = (id = ID_SIZE) => nanoid(id);

const getErrorString = (msg: string, value: any, expected?: string) =>
  `${msg} (${value}).${expected && ` Ожидалось: ${expected}`}`;

let users = usersOriginal;
let products = productsOriginal;

const PORT = process.env["PORT"] || "3000";

const app = express();
app.use(...swaggerParams);
app.use(json());

app.get("/api/users", async (_req: Request, res: Response) => {
  return res.status(StatusCodes.OK).json(users);
});

app.get("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return getBadRequest(res);
  }
  const user = users.find((u) => u.id === id);
  if (!user) {
    return getNotFound(res);
  }

  return res.status(StatusCodes.OK).json(products);
});

app.post("/api/auth/register", async (req: Request, res: Response) => {
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

app.post("/api/auth/login", async (req: Request, res: Response) => {
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

app.get("/api/products", async (_req: Request, res: Response) => {
  return res.status(StatusCodes.OK).json(products);
});

app.post("/api/products", async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(StatusCodes.BAD_REQUEST).send("body is empty");
  }
  if (!req.body.price || !req.body.title || !req.body.category) {
    return res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST);
  }
  if (isNaN(req.body.price) || parseFloat(req.body.price) < 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(
        getErrorString(
          `Некорректная цена`,
          req.body.price,
          `неотрицательное число`,
        ),
      );
  }

  const newProduct: Product = {
    id: nextId(),
    title: req.body.title,
    category: req.body.category,
    price: parseFloat(req.body.price),
    description: req.body.description ?? "",
  };

  products.push(newProduct);
  return res
    .status(StatusCodes.CREATED)
    .json(newProduct)
    .send(ReasonPhrases.CREATED);
});

app.get("/api/products/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return getBadRequest(res);
  }
  const product = products.find((p) => p.id === id);
  if (!product) {
    return getNotFound(res);
  }

  return getOk(res);
});

app.put("/api/products/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return getBadRequest(res);
  }

  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex === -1) {
    return getNotFound(res);
  }

  const p = products[productIndex]!;
  const b = req.body;

  if (b.title) p.title = b.title;
  if (b.description) p.description = b.description;
  if (b.price) {
    if (isNaN(b.price) || parseFloat(b.price) < 0) {
      return getBadRequest(
        res,
        getErrorString("Некорректная цена", b.price, "неотрицательное число"),
      );
    } else {
      p.price = parseFloat(b.price);
    }
  }

  products = products.splice(productIndex, 1, p);
  return getOk(res);
});

app.delete("/api/products/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return getBadRequest(res);
  }

  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex === -1) {
    return getNotFound(res);
  }

  products = products.splice(productIndex, 1);
  return getOk(res);
});

app.get("/", async (_req: Request, res: Response) => {
  return getOk(res);
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
  console.log(`Swagger UI доступен по адресу http://localhost:${PORT}/api-
docs`);
});
