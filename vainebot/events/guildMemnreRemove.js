const { log } = require('../utils/logger');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member, client) {
    await log(
      client,
      '👋 Départ',
      `🔹 ${member.user.tag} (\`${member.id}\`) a quitté le serveur.`,
      '#e67e22'
    );
  }
};
