FROM node:22-alpine AS production
WORKDIR /app
COPY backend/package*.json ./backend/
COPY package*.json ./
RUN npm install --omit=dev --workspace=@secure-login-portal/backend
COPY backend ./backend
WORKDIR /app/backend
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 CMD node -e "fetch('http://127.0.0.1:3000/api/v1/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
CMD ["node", "src/server.js"]
