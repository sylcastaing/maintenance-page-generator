FROM nginx:1.19.2-alpine

RUN apk add --update --no-cache curl

COPY nginx.conf /etc/nginx
COPY index.html *.ico /usr/share/nginx/html/

RUN gzip -6 -k /usr/share/nginx/html/index.html