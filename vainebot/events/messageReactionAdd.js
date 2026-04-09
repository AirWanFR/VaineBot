module.exports = {
  name: 'messageReactionAdd',
  async execute(reaction, user, client) {
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;

    const roleMap = {
      '🟢': '1381236575475728435', // Rôle 2027
      '🔵': '1381236675820126278', // Rôle 2028
    };

    const roleId = roleMap[reaction.emoji.name];
    if (!roleId) return;

    const guild = reaction.message.guild;
    const member = await guild.members.fetch(user.id);
    if (!member.roles.cache.has(roleId)) {
      await member.roles.add(roleId);
    }
  }
};
