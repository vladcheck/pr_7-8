import { Router } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import path from "path";
import { Product as ProductEntity } from "../../../shared/types/Product";
import authMiddleware from "../middleware/authMiddleware";
import dbFacade from "../utils/DbFacade";
import {
  getBadRequest,
  getErrorString,
  getInternalServerError,
  getNotFound,
  getOk,
} from "../utils/requestHelpers";
import type { Response, Request } from "express";
import roleMiddleware from "../middleware/roleMiddleware";
import nextId from "../utils/nextId";
import { ProductRequestBody } from "../types/productsRouter";
import multer from "multer";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

const storage = multer.diskStorage({
  destination: function (_req: any, _file: any, cb: any) {
    cb(null, path.resolve(__dirname, "../../public/images/products"));
  },
  filename: function (_req: any, file: any, cb: any) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

const productsRouter: Router = Router();
export const productsPath = path.resolve(__dirname, "../db/products.json");

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
  .get("/", async (req: Request, res: Response) => {
    const queryParams: { author_id?: string; page?: string; limit?: string } =
      req.query as any;
    const entries: ProductEntity[] = await dbFacade.readEntries(productsPath);
    const filteredEntries = entries.filter((p) => {
      return queryParams.author_id
        ? p.author_id === queryParams.author_id
        : true;
    });

    const page = parseInt(queryParams.page || String(DEFAULT_PAGE), 10);
    const limit = parseInt(queryParams.limit || String(DEFAULT_LIMIT), 10);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const items = filteredEntries.slice(startIndex, endIndex);

    return res.status(StatusCodes.OK).json({
      items,
      total: filteredEntries.length,
      page,
      limit,
      totalPages: Math.ceil(filteredEntries.length / limit),
    });
  })
  .post(
    "/",
    upload.array("images", 10),
    async (req: Request, res: Response) => {
      const body: ProductRequestBody = req.body;
      if (!body) {
        return getBadRequest(res, "body is empty");
      }
      if (!body.price || !body.title || !body.category || !body.author_id) {
        return getBadRequest(res);
      }
      if (isNaN(parseFloat(body.price)) || parseFloat(body.price) < 0) {
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

      const files = req.files as Express.Multer.File[];
      const uploadedImages =
        files?.map((f) => `/api/public/images/products/${f.filename}`) || [];

      const newProduct: ProductEntity = {
        id: nextId(),
        title: req.body.title,
        category: req.body.category,
        price: parseFloat(req.body.price),
        description: req.body.description ?? "",
        author_id: req.body.author_id,
      };

      if (uploadedImages.length > 0) {
        newProduct.images = uploadedImages;
      }

      try {
        await dbFacade.appendEntry(productsPath, newProduct);
        return res
          .status(StatusCodes.CREATED)
          .json(newProduct)
          .send(ReasonPhrases.CREATED);
      } catch (error) {
        console.error(error);
        return getInternalServerError(res, error);
      }
    },
  );

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
    // TODO: нужен ли нам authMiddleware для GET?
    const { id } = req.params;
    if (!id) {
      return getBadRequest(res);
    }

    const products: ProductEntity[] = await dbFacade.readEntries(productsPath);
    const product = products.find((p) => p.id === id);
    if (!product) {
      return getNotFound(res);
    }

    return res.status(StatusCodes.OK).json(product);
  })
  .post(
    "/:id",
    authMiddleware,
    roleMiddleware(["seller"]),
    upload.array("images", 10),
    async (req: Request, res: Response) => {
      const { id } = req.params;
      if (!id) {
        return getBadRequest(res);
      }

      const products: ProductEntity[] =
        await dbFacade.readEntries(productsPath);
      const productIndex = products.findIndex((p) => p.id === id);
      if (productIndex === -1) {
        return getNotFound(res);
      }

      const p = products[productIndex]!;
      const b: Record<keyof typeof p, string> = req.body;

      if (b.title) p.title = b.title;
      if (b.description) p.description = b.description;

      const files = req.files as any[];
      if (files && files.length > 0) {
        const uploadedImages = files.map(
          (f) => `/api/public/images/products/${f.filename}`,
        );
        p.images = p.images ? [...p.images, ...uploadedImages] : uploadedImages;
      }

      if (b.price) {
        if (isNaN(parseFloat(b.price)) || parseFloat(b.price) < 0) {
          return getBadRequest(
            res,
            getErrorString(
              "Некорректная цена",
              b.price,
              "неотрицательное число",
            ),
          );
        } else {
          p.price = parseFloat(b.price);
        }
      }

      return getOk(res);
    },
  )
  .delete(
    "/:id",
    authMiddleware,
    roleMiddleware(["seller"]),
    async (req: Request, res: Response) => {
      const { id } = req.params;
      if (!id) {
        return getBadRequest(res);
      }

      const products: ProductEntity[] =
        await dbFacade.readEntries(productsPath);
      const product = products.find((p) => p.id === id);
      if (!product) {
        return getNotFound(res, "product not found");
      }

      try {
        await dbFacade.deleteEntryById(productsPath, product.id);
        return getOk(res);
      } catch (error) {
        console.error(error);
        return getInternalServerError(res, error);
      }
    },
  );

export default productsRouter;
