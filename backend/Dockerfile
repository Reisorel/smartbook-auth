FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer TOUTES les dépendances (y compris devDependencies pour la compilation)
RUN npm install

# Copier le reste du code source
COPY . .

# Compiler TypeScript en JavaScript
RUN npm run build

# Exposer le port utilisé par l'application
EXPOSE 3000

# Commande de démarrage
CMD ["node", "dist/server.js"]
