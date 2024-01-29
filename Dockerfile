FROM node:20 as build
WORKDIR /usr/src/app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-slim
RUN apt update && apt install libssl-dev dumb-init -y --no-install-recommends
WORKDIR /usr/src/app

# Copy necessary files
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/.env .env
COPY --chown=node:node --from=build /usr/src/app/package.json .
COPY --chown=node:node --from=build /usr/src/app/package-lock.json .
COPY --chown=node:node --from=build /usr/src/app/node_modules/.prisma/client  ./node_modules/.prisma/client
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma

# Install production node_modules
RUN npm install --omit=dev

ENV NODE_ENV production
EXPOSE 5000

# Use dumb-init to handle process management
ENTRYPOINT ["dumb-init", "--"]

# Custom script to run prisma db push and then start the app
CMD ["sh", "-c", "npx prisma db push && npm run start:prod"]