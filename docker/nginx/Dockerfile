FROM nginx:1.25

WORKDIR /var/www/html

ENV TZ=UTC

COPY ./docker/nginx/*.conf /etc/nginx/conf.d/
COPY ./docker/nginx/mime.types /etc/nginx/mime.types
