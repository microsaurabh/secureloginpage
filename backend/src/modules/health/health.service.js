import mongoose from 'mongoose';

export const healthService = {
  getStatus() {
    return {
      status: 'ok',
      service: 'secure-login-portal-api',
      timestamp: new Date().toISOString()
    };
  },
  getReadiness() {
    const connected = mongoose.connection.readyState === 1;
    return {
      status: connected ? 'ready' : 'not_ready',
      database: connected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    };
  }
};
