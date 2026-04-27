# Étape 1 : Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copie des fichiers de configuration
COPY package*.json ./
COPY prisma ./prisma/

# Installation des dépendances et génération de Prisma
RUN npm install
RUN npx prisma generate

# Copie du reste du code et build
COPY . .
RUN npm run build

# Étape 2 : Run
FROM node:20-alpine

WORKDIR /app

# Copie uniquement du nécessaire depuis le builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# Commande de démarrage (on lance les migrations avant de démarrer)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]