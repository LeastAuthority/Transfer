FROM node:current

RUN mkdir /app

WORKDIR /app

# depends on application source volume
EXPOSE 8080
CMD npm run serve
