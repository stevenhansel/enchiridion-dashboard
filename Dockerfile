FROM node:16-alpine AS builder

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build

ENV NODE_ENV production

EXPOSE 3000

CMD [ "npm", "run", "preview" ]
