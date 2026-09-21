# Build React UI
FROM node:22-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

# Run UI + API from one Node.js container
FROM node:22-alpine
WORKDIR /app

COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

COPY server/src ./server/src
COPY --from=client-build /app/client/dist ./client/dist

ENV PORT=3000
EXPOSE 3000

CMD ["node", "server/src/app.js"]