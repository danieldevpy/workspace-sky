FROM node:latest

WORKDIR /app

COPY /. .

RUN rm -rf .next
RUN rm -rf node_modules
RUN npm install -y
RUN npm run build

CMD [ "npm", "run", "start" ]

