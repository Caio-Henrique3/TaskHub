import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import "dotenv/config";

const PORT = process.env.PORT || 3000;

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TaskHub API",
      version: "1.0.0",
      description: "Documentação completa da API TaskHub | Para iniciar crie um usuário através do endpoint /users. Após isso, faça login com as credenciais e autentique com o token obtido. Divirta-se!",
      contact: {
        name: "Equipe de Desenvolvimento",
        email: "m.henrique.caio@gmail.com",
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Servidor de desenvolvimento",
      },
    ],
  },
  apis: ["./src/routes/**/*.ts", "./src/models/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export function swaggerConfigs(app: Express) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("/docs.json", (request: Request, response: Response) => {
    response.setHeader("Content-Type", "application/json");
    response.send(swaggerSpec);
  });

  console.log(`📑 Swagger docs available at http://localhost:${PORT}/docs`);
}
