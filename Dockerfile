FROM node:20-alpine
RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN \
  cat /run/secrets/SENTRY_AUTH_TOKEN

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN \
     npm run build ${SENTRY_AUTH_TOKEN} $(cat /run/secrets/SENTRY_AUTH_TOKEN)

EXPOSE 8000

CMD ["npm", "run", "start:prod"]


