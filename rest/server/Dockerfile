#stage 1 building our code
FROM node as builder
WORKDIR /usr/index
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

#stage 2 running
FROM node
WORKDIR /usr/index
COPY package*.json ./
RUN npm install --production

COPY --from=builder /usr/index/dist ./dist

COPY ormconfig.docker.js ./ormconfig.js
COPY .env .

EXPOSE 5000
CMD node dist/server.js