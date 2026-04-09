FROM node:20-alpine

ENV NODE_ENV=production

# On utilise le répertoire personnel de l'user node (déjà autorisé)
WORKDIR /home/node/app

# On copie les dépendances
COPY --chown=node:node package*.json ./

# On passe en utilisateur node AVANT de faire quoi que ce soit
USER node

# Installation propre
RUN npm ci --omit=dev

# On copie tout ton code
COPY --chown=node:node . .

# Si ton code a VRAIMENT besoin de croire qu'il est dans /opt/discordbot,
# on peut créer un lien symbolique, mais c'est rarement nécessaire.
# Sinon, on lance juste :
CMD ["node", "index.js"]
