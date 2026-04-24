import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FaDel API Documentation',
      version: '1.0.0',
      description: "Documentation du parcours d'inscription, verification email et connexion.",
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/modules/auth/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
