

FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./



RUN npm ci

COPY . .

RUN ./node_modules/.bin/ng build --configuration production --output-path=dist/browser

FROM nginx:1.27-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/browser/browser/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
