FROM node:20-alpine

ENV NODE_ENV=production

# Le répertoire de travail doit appartenir à node AVANT le passage en USER node,
# sinon npm ne peut pas créer node_modules (EACCES).
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app

# On copie les dépendances
COPY --chown=node:node package*.json ./

# On passe en utilisateur node AVANT de faire quoi que ce soit
USER node

# Installation propre
RUN npm install --omit=dev

# On copie tout ton code
COPY --chown=node:node . .

# Si ton code a VRAIMENT besoin de croire qu'il est dans /opt/discordbot,
# on peut créer un lien symbolique, mais c'est rarement nécessaire.
# Sinon, on lance juste :
# Express (API et site) écoute sur le port 3000
EXPOSE 3000

CMD ["node", "index.js"]
