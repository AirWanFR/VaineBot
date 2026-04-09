const { log } = require('../utils/logger');

module.exports = {
  name: 'messageUpdate',
  async execute(oldMessage, newMessage, client) {
    if (oldMessage.partial || !oldMessage.guild || oldMessage.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;

    await log(
      client,
      '✏️ Message édité',
      `**Auteur :** ${oldMessage.author.tag} (\`${oldMessage.author.id}\`)
**Salon :** <#${oldMessage.channel.id}>
**Avant :**\n\`\`\`\n${oldMessage.content}\n\`\`\`
**Après :**\n\`\`\`\n${newMessage.content}\n\`\`\``,
      '#f1c40f'
    );
  }
};
