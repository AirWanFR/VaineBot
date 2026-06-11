const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'serverinfo',
  description: 'Affiche les informations relatives au serveur.',
  async execute(interaction) {
    if (!interaction.isCommand || !interaction.isCommand()) return;

    const guild = interaction.guild;
    const owner = await guild.fetchOwner();

    const embed = new EmbedBuilder()
      .setColor('#3b82f6')
      .setTitle(`ℹ️ Informations du serveur : ${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: '👑 Propriétaire', value: owner.user.tag, inline: true },
        { name: '👥 Membres', value: `${guild.memberCount}`, inline: true },
        { name: '📅 Date de création', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
        { name: '💬 Salons', value: `${guild.channels.cache.size}`, inline: true },
        { name: '🎭 Rôles', value: `${guild.roles.cache.size}`, inline: true },
        { name: '🌟 Boosts', value: `Niveau ${guild.premiumTier} (${guild.premiumSubscriptionCount || 0} boosts)`, inline: true }
      )
      .setFooter({ text: 'Vainy Information', iconURL: interaction.client.user.displayAvatarURL() });

    await interaction.reply({ embeds: [embed] });
  }
};
