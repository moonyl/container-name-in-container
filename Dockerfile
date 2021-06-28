FROM node:lts-alpine
EXPOSE 8080
WORKDIR /work
ADD . /work
CMD npm start 