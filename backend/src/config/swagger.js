import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerDocument = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Secure Login Portal API',
      version: '1.0.0',
      description: 'Versioned REST API for the Secure Login Portal platform.'
    },
    servers: [{ url: '/api/v1', description: 'Current API version' }],
    components: {
      schemas: {
        Error: {
          type: 'object',
          required: ['error'],
          properties: { error: { type: 'object', properties: { message: { type: 'string' } } } }
        }
      }
    }
  },
  apis: ['./src/modules/**/*.routes.js']
});
