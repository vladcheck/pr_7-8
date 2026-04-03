import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";

let swaggerSpec = {};
try {
  const fileOutput = fs.readFileSync(path.resolve(process.cwd(), "public/swagger.json"), "utf8");
  swaggerSpec = JSON.parse(fileOutput);
} catch (error) {
  console.error("Swagger file not found. Run pnpm start to generate it.", error);
}

export const swaggerParams: any[] = [
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec),
];
