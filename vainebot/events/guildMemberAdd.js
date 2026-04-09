const { log } = require('../utils/logger');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {
    await log(
      client,
      '👋 Nouveau membre',
      `🔹 ${member.user.tag} (\`${member.id}\`) a rejoint le serveur.`,
      '#2ecc71'
    );
  }
};
