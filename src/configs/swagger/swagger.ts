import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import "dotenv/config";

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
        url: `https://taskhub-wkh0.onrender.com/`,
        description: "Servidor de Produção",
      },
    ],
  },
  apis: ["./src/routes/**/*.ts", "./src/models/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export function swaggerConfigs(app: Express) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("/docs.json", (_: any, response: Response) => {
    response.setHeader("Content-Type", "application/json");
    response.send(swaggerSpec);
  });
}
