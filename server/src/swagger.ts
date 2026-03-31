import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";

const PORT = process.env["PORT"] || "3000";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    failOnErrors: true,
    info: { title: "API AUTH", version: "1.0.0" },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Локальный сервер",
      },
    ],
  },
  apis: [path.resolve(__dirname, "./routers/*.ts")],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const swaggerParams: any[] = [
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec),
];
