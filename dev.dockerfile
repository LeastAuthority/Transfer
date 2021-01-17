FROM node:current

RUN mkdir /app

WORKDIR /app
COPY ./package.json ./package.json
RUN yarn install

# depends on application source volume
EXPOSE 8080
CMD yarn run serve