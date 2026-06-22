FROM node:22-alpine AS build

WORKDIR /app

# Vite reads VITE_* variables at build time.
# Keep /api so the browser calls this same frontend container.
# server.js proxies /api to the Render backend at runtime.
ARG VITE_API_BASE_URL=/api
ARG VITE_API_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_API_URL=${VITE_API_URL}

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV BACKEND_URL=https://vanwallet-backend.onrender.com

COPY --from=build /app/dist ./dist
COPY server.js ./server.js

EXPOSE 8080

CMD ["node", "server.js"]
