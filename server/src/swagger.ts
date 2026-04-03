import fs from 'node:fs';
import path from 'node:path';
import swaggerUi from 'swagger-ui-express';

let swaggerSpec = {};
try {
	const fileOutput = fs.readFileSync(
		path.resolve(process.cwd(), 'public/swagger.json'),
		'utf8',
	);
	swaggerSpec = JSON.parse(fileOutput);
} catch (error) {
	console.error(
		'Swagger file not found. Run pnpm start to generate it.',
		error,
	);
}

export const swaggerParams: unknown[] = [
	'/api-docs',
	swaggerUi.serve,
	swaggerUi.setup(swaggerSpec),
];
