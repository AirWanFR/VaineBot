const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'stats',
  description: 'Affiche les statistiques du serveur',
  async execute(interaction) {
    const guild = interaction.guild;

    const embed = new EmbedBuilder()
      .setTitle(`📊 Statistiques du serveur ${guild.name}`)
      .setColor('#00AEFF')
      .addFields(
        { name: 'Membres', value: `${guild.memberCount}`, inline: true },
        { name: 'Salons', value: `${guild.channels.cache.size}`, inline: true },
        { name: 'Rôles', value: `${guild.roles.cache.size}`, inline: true },
        { name: 'Création', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
      )
      .setThumbnail(guild.iconURL())
      .setFooter({ text: 'R1-D1 • Stats' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
