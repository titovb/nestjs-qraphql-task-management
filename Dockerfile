FROM node:12.16.1
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY ./ ./
RUN npm run build

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.6.0/wait /wait
RUN chmod +x /wait

CMD /wait && npm run start:prod
