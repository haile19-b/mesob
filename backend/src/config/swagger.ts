import swaggerJsdoc from 'swagger-jsdoc';
import { env } from '../env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mobile App API',
      version: '1.0.0',
      description: 'API documentation for the Mobile Food Ordering App',
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/modules/**/*.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
