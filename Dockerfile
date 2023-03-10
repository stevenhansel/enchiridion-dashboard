FROM node:16-alpine AS builder

WORKDIR /app

COPY . .

ENV VITE_API_BASE_URL=http://api.beesmart.binus.local/dashboard
ENV VITE_WSS_BASE_URL=http://api.beesmart.binus.local/socket

RUN npm ci

RUN npm run build

ENV NODE_ENV production

EXPOSE 3000

CMD [ "npm", "run", "preview" ]
