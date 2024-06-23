# Используем официальный образ Node.js как базовый
FROM node:22-alpine AS build-stage

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем файлы проекта в рабочую директорию
COPY package*.json ./
COPY webpack.config.js ./

# Устанавливаем зависимости
RUN npm install

# Копируем файлы и собираем проект
COPY src ./src
COPY assets ./assets
RUN npm run build

# Используем образ Nginx для раздачи собранных файлов
FROM nginx:alpine

# Копируем собранные файлы из стадии сборки в Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Копируем нашу настроенную конфигурацию Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Открываем 80 порт для веб-сервера
EXPOSE 80

# Запускаем Nginx в foreground
CMD ["nginx", "-g", "daemon off;"]
