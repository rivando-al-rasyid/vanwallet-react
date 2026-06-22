FROM node:22-alpine AS build

WORKDIR /app

# Vite reads VITE_* variables at build time.
# Default to /api so the browser calls this same frontend container,
# then Nginx proxies /api to the Render backend.
ARG VITE_API_BASE_URL=/api
ARG VITE_API_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_API_URL=${VITE_API_URL}

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

# Render provides PORT at runtime. Keep a safe local default.
ENV PORT=8080
ENV BACKEND_URL=https://vanwallet-backend.onrender.com

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
