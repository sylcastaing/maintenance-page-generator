ARG version

FROM sylcastaing/maintenance-page-generator:$version as builder

WORKDIR /usr/src/mpg

COPY . .

RUN mpg build -f index.html

FROM nginx:1.18-alpine

COPY --from=builder /nginx.conf /etc/nginx/
COPY --from=builder /usr/src/mpg/index.html /usr/src/mpg/*.ico /usr/share/nginx/html/

RUN gzip -6 -k /usr/share/nginx/html/index.html
