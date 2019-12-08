FROM nginx:1.17.6-alpine

RUN apk add --update --no-cache curl

COPY nginx.conf /etc/nginx
COPY maintenance.html /usr/share/nginx/html/index.html

RUN gzip -6 -k /usr/share/nginx/html/index.html