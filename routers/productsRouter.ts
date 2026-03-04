import { Router, type Request, type Response } from "express";
import { getErrorString, nextId } from "../server";
import { getBadRequest, getNotFound, getOk } from "../utils/requestHelpers";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import Product from "../entities/Product";
import originalProducts from "../mock/products";

const productsRouter: Router = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Product:
 *      type: object
 *      required:
 *      - id
 *      - title
 *      - category
 *      - price
 *      optional:
 *      - description
 *      properties:
 *       id:
 *         type: string
 *         description: Автоматически сгенерированный ID товара
 *       title:
 *         type: string
 *       description:
 *         type: string
 *       category:
 *         type: string
 *         description: Категория товаров, к которой относится этот товар
 *       price:
 *         type: number
 *         description: Цена в рублях
 *      example:
 *       id: "dfas31"
 *       title: "Фарфоровая чашка"
 *       category: "Посуда"
 *       description: "Фарворовая чашка на восьмое марта! Подари маме, бабушке, подруге!"
 *       price: 1400
 */
let products = originalProducts;

/**
 * @swagger
 * /api/products:
 *    get:
 *      summary: Получить все товары
 *      tags: [Products]
 *      responses:
 *        200:
 *          description: Товары получены
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Product'
 *    post:
 *      summary: Создать товар
 *      tags: [Products]
 *      requestBody:
 *        required: true
 *      responses:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *        400:
 *          description: Некорректное тело запроса
 *        201:
 *          description: Товар успешно создан
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Product'
 */
productsRouter
  .get("/", async (_req: Request, res: Response) => {
    return res.status(StatusCodes.OK).json(products);
  })
  .post("/", async (req: Request, res: Response) => {
    if (!req.body) {
      return res.status(StatusCodes.BAD_REQUEST).send("body is empty");
    }
    if (!req.body.price || !req.body.title || !req.body.category) {
      return getBadRequest(res);
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

/**
 * @swagger
 * /api/products/:id:
 *    get:
 *      summary: Получить товар по ID
 *      tags: [Products]
 *      responses:
 *        400:
 *          description: Некорректное тело запроса
 *        404:
 *          description: Товара с таким ID не существует
 *        200:
 *          description: Товар найден
 *          content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Product'
 *    put:
 *      summary: Обновить информацию о товаре с определенным ID
 *      tags: [Products]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      responses:
 *       400:
 *          description: Некорректное тело запроса
 *       404:
 *          description: Товара с таким ID не существует
 *       200:
 *          description: Товар обновлен
 *    delete:
 *      summary: Удалить товар по ID
 *      tags: [Products]
 *      responses:
 *        400:
 *          description: ID не передан
 *        404:
 *          description: Товара с таким ID не существует
 *        200:
 *          description: Товар успешно удален
 */
productsRouter
  .get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return getBadRequest(res);
    }
    const product = products.find((p) => p.id === id);
    if (!product) {
      return getNotFound(res);
    }

    return getOk(res);
  })
  .put("/:id", async (req: Request, res: Response) => {
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
  })
  .delete("/:id", async (req: Request, res: Response) => {
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

export default productsRouter;
