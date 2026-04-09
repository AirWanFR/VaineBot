const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [];

// Récupération récursive des fichiers de commandes
const loadCommands = (dir) => {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      loadCommands(filePath);
    } else if (file.name.endsWith('.js')) {
      const command = require(filePath);
      if (command.name && command.description) {
        commands.push({
          name: command.name,
          description: command.description,
          options: command.options || []
        });
      } else {
        console.warn(`⚠️ Ignoré : ${file.name} (commande invalide)`);
      }
    }
  }
};

loadCommands(path.join(__dirname, 'commands'));

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log('🧹 Suppression des commandes slash existantes...');
    // Supprime toutes les commandes slash dans la guild
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: [] }
    );
    console.log('✅ Commandes supprimées.');

    console.log('🚀 Déploiement des nouvelles slash commands...');
    // Déploie les nouvelles commandes
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('✅ Slash commands déployées avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors du déploiement :', error);
  }
})();
