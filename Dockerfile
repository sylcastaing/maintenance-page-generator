FROM node:14-alpine

ARG version
ENV VERSION=$version

RUN npm i -g maintenance-page-generator@$VERSION

COPY ./nginx.conf /
