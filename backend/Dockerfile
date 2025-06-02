FROM node:18

WORKDIR /app

# Installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le code source
COPY . .

# Compiler TypeScript en JavaScript
RUN npm run build

# Exposer le port et démarrer l'application
EXPOSE 3000
CMD ["node", "dist/server.js"]
