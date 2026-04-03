import swaggerJSDoc from "swagger-jsdoc";
import fs from "fs";
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
  apis: [path.resolve(process.cwd(), "src/routers/*.ts")],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
const outputPath = path.resolve(process.cwd(), "public/swagger.json");

if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2), "utf8");
console.log("Swagger documentation statically generated at public/swagger.json");
