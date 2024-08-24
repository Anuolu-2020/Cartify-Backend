FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN --mount=type=secret,id=sentry_auth_token npm run build

EXPOSE 8000

CMD ["npm", "run", "start:prod"]


