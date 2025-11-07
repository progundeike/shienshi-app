# =========================================
# Base (PHP共通)
# =========================================
FROM php:8.3-fpm AS base

# Composer を取り込み
COPY --from=composer:2.2 /usr/bin/composer /usr/bin/composer

RUN apt-get update && \
    # --no-install-recommendで不要なパッケージのインストールを防止
    apt-get -y install --no-install-recommends git zip unzip vim libzip-dev libicu-dev libonig-dev cron mariadb-client && \
    # 以下2行でパッケージインストールで使用したキャッシュファイルを削除
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    # PHPの拡張ライブラリをインストール
    docker-php-ext-install intl pdo_mysql bcmath zip mbstring

# composerをrootで使う警告抑止
ENV COMPOSER_ALLOW_SUPERUSER=1

# 共通の php.ini
COPY ./docker/php/php.ini /usr/local/etc/php/php.ini

# =========================================
# vendor だけ解決（本番用のcomposer --no-dev）
# =========================================
FROM base AS vendor
WORKDIR /var/www/html
COPY src/composer.json src/composer.lock ./

RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --no-scripts --optimize-autoloader

# =========================================
# フロント資産ビルド（Vite）
# =========================================
FROM node:20.5 AS assets
WORKDIR /app
COPY src/package*.json ./
RUN npm ci
COPY src .
RUN npm run build

# =========================================
# 本番イメージ（最小構成）
# =========================================
FROM base AS prod
WORKDIR /var/www/html

# アプリ本体
COPY src ./

# vendor と ビルド済みアセットだけを取り込み
COPY --from=vendor /var/www/html/vendor ./vendor
COPY --from=assets /app/public/build ./public/build

RUN composer dump-autoload -o

ENV APP_ENV=production \
    APP_DEBUG=0

# パーミッション & キャッシュ（失敗しても落ちないように || true）
RUN chown -R www-data:www-data storage bootstrap/cache && \
    php artisan config:cache || true && \
    php artisan route:cache  || true && \
    php artisan view:cache   || true

CMD ["php-fpm"]

# =========================================
# 開発用イメージ（xdebug / Node あり）
# =========================================
FROM base AS dev
# Node 取り込み（ホットリロード等）
COPY --from=node:20.5 /usr/local/bin /usr/local/bin
COPY --from=node:20.5 /usr/local/lib /usr/local/lib
RUN npm install -g npm@10.8.0

# xdebug
RUN pecl install xdebug && docker-php-ext-enable xdebug
COPY ./docker/php/xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini

WORKDIR /var/www/html
ENV APP_ENV=local \
    XDEBUG_MODE=develop,debug

EXPOSE 5173
CMD ["php-fpm"]
