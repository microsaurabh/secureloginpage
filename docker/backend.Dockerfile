FROM node:22-alpine AS production
WORKDIR /app
COPY backend/package*.json ./backend/
COPY package*.json ./
RUN npm install --omit=dev --workspace=@secure-login-portal/backend
COPY backend ./backend
WORKDIR /app/backend
EXPOSE 3000
CMD ["node", "src/server.js"]
