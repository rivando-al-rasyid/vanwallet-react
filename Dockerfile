# build package  for web
FROM node:trixie AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM nginx:alpine

# best practice remove all setting insisde it, to remove  annoying if have duplicate server/setting
RUN rm -rf /usr/share/nginx/html/*

# copy build output from dist to html folder
COPY --from=build /app/dist /usr/share/nginx/html

COPY --from=build /app/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]

