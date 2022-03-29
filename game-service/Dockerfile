FROM node:14-alpine as builder

WORKDIR /app

COPY package.json ./
RUN yarn install

COPY . .
RUN yarn run build

FROM node:14-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package.json ./
RUN yarn install

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

CMD ["yarn", "run", "start:prod"]