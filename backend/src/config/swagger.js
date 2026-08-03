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
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
      schemas: {
        Error: {
          type: 'object',
          required: ['error'],
          properties: { error: { type: 'object', properties: { message: { type: 'string' } } } }
        }
      }
    },
    paths: {
      '/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Create an account and send verification email',
          responses: {
            201: { description: 'Account created' },
            409: { description: 'Email already exists' }
          }
        }
      },
      '/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Authenticate and start a session',
          responses: {
            200: { description: 'Access token and HttpOnly refresh cookie' },
            401: { description: 'Invalid credentials' },
            423: { description: 'Account locked' }
          }
        }
      },
      '/auth/refresh': {
        post: {
          tags: ['Authentication'],
          summary: 'Rotate the refresh token and issue a new access token',
          responses: {
            200: { description: 'Session refreshed' },
            401: { description: 'Invalid refresh token' }
          }
        }
      },
      '/csrf-token': {
        get: {
          tags: ['System'],
          summary: 'Issue a CSRF token for cookie-backed session requests',
          responses: { 200: { description: 'CSRF token issued' } }
        }
      },
      '/health/ready': {
        get: {
          tags: ['System'],
          summary: 'Return database readiness',
          responses: { 200: { description: 'Ready' }, 503: { description: 'Not ready' } }
        }
      },
      '/metrics': {
        get: {
          tags: ['System'],
          summary: 'Return protected application counters',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Metrics snapshot' } }
        }
      },
      '/auth/logout': {
        post: {
          tags: ['Authentication'],
          summary: 'Revoke the current refresh token',
          responses: { 204: { description: 'Session ended' } }
        }
      },
      '/auth/forgot-password': {
        post: {
          tags: ['Authentication'],
          summary: 'Request password reset instructions',
          responses: { 202: { description: 'Request accepted' } }
        }
      },
      '/auth/reset-password': {
        post: {
          tags: ['Authentication'],
          summary: 'Reset a password with a one-time token',
          responses: {
            204: { description: 'Password reset' },
            400: { description: 'Invalid reset token' }
          }
        }
      },
      '/auth/change-password': {
        post: {
          tags: ['Authentication'],
          summary: 'Change the authenticated user password',
          security: [{ bearerAuth: [] }],
          responses: {
            204: { description: 'Password changed' },
            401: { description: 'Authentication required' }
          }
        }
      },
      '/auth/verify-email': {
        post: {
          tags: ['Authentication'],
          summary: 'Verify email with a one-time token',
          responses: {
            204: { description: 'Email verified' },
            400: { description: 'Invalid verification token' }
          }
        }
      }
    }
  },
  apis: ['./src/modules/**/*.routes.js']
});
