const { log } = require('../utils/logger');

module.exports = {
  name: 'messageDelete',
  async execute(message, client) {
    if (!message.guild || message.partial || message.author?.bot) return;

    await log(
      client,
      '🗑️ Message supprimé',
      `**Auteur :** ${message.author.tag} (\`${message.author.id}\`)\n**Salon :** <#${message.channel.id}>\n**Contenu :**\n\`\`\`\n${message.content || 'Aucun texte'}\n\`\`\``,
      '#e74c3c'
    );
  }
};
