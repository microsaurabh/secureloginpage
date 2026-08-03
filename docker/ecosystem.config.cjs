module.exports = {
  apps: [
    {
      name: 'secure-login-portal-api',
      script: 'src/server.js',
      cwd: '/app/backend',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      max_memory_restart: '300M',
      env_production: { NODE_ENV: 'production' }
    }
  ]
};
