FROM caddy:2 AS web
WORKDIR /var/www/html

# Laravel public
COPY src/public ./public

# フロントエンドのビルド漏れを検知
RUN test -f public/build/manifest.json

RUN rm -rf public/storage \
    && ln -s ../storage/app/public public/storage

# Caddyfileを同梱
COPY docker/caddy/Caddyfile /etc/caddy/Caddyfile

EXPOSE 80
EXPOSE 443
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
