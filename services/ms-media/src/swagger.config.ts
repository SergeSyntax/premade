import path from "node:path";
import { fileURLToPath } from "node:url";

import swaggerJSDoc, { OAS3Definition, Options } from "swagger-jsdoc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const swaggerDefinition: OAS3Definition = {
  openapi: "3.0.0",
  info: {
    title: "Express API for JSONPlaceholder",
    version: "1.0.0",
    description:
      "This is a REST API application made with Express. It retrieves data from JSONPlaceholder.",
    license: {
      name: "Licensed Under MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      name: "JSONPlaceholder",
      url: "https://jsonplaceholder.typicode.com",
    },
  },
  servers: [
    {
      url: "http://localhost:5001",
      description: "Development server",
    },
  ],
};

const options: Options = {
  swaggerDefinition,
  apis: [path.join(__dirname, "routes", "*.ts")],
};

export const swaggerSpec = swaggerJSDoc(options);
