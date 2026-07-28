export const healthService = {
  getStatus() {
    return {
      status: 'ok',
      service: 'secure-login-portal-api',
      timestamp: new Date().toISOString()
    };
  }
};
