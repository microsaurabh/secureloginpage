FROM node:22-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./frontend/
COPY package*.json ./
RUN npm install --workspace=@secure-login-portal/frontend
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/frontend/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
