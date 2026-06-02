# Stage 1: Build aplikasi React
FROM node:alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Jalankan Nginx

FROM nginx:1.31.1-alpine3.23-perl

# Menghapus file bawaan Nginx
RUN rm -rf /usr/share/nginx/html/*

# Salin hasil build React (pastikan folder hasil build Anda bernama 'dist' atau 'build')
COPY --from=build /app/dist /usr/share/nginx/html

# Salin konfigurasi Nginx langsung dari file lokal Anda
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]
