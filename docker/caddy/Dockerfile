FROM node:20.5 AS assets
WORKDIR /app
COPY src/package*.json ./
RUN npm ci
COPY src .
RUN npm run build

FROM caddy:2 AS web
WORKDIR /var/www/html

# Laravel public
COPY src/public ./public

# Vite build成果物
COPY --from=assets /app/public/build ./public/build

# Caddyfileを同梱
COPY docker/caddy/Caddyfile /etc/caddy/Caddyfile

EXPOSE 80
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
