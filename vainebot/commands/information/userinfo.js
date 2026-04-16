const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'userinfo',
  description: 'Analyse technique des données d\'un utilisateur',
  options: [
    {
      name: 'utilisateur',
      description: 'Cible de l\'analyse',
      type: 6, // USER
      required: true,
    }
  ],
  async execute(interaction) {
    const user = interaction.options.getUser('utilisateur');
    const member = await interaction.guild.members.fetch(user.id);

    const infoEmbed = new EmbedBuilder()
      .setColor('#00fbff') // Cyan néon R1-D1
      .setTitle(`📡 Rapport d'Analyse : ${user.username}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: '🆔 ID Système', value: `\`${user.id}\``, inline: true },
        { name: '👤 Identité', value: `${user.tag}`, inline: true },
        { name: '📅 Inscription Discord', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:f> (<t:${Math.floor(user.createdTimestamp / 1000)}:R>)`, inline: false },
        { name: '📥 Arrivée Serveur', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:f> (<t:${Math.floor(member.joinedTimestamp / 1000)}:R>)`, inline: false },
        { name: '🎭 Accès Principal', value: `${member.roles.highest}`, inline: true },
        { name: '🤖 Type d\'Entité', value: user.bot ? 'Intelligence Artificielle' : 'Utilisateur Humain', inline: true }
      )
      .setFooter({ text: 'R1-D1 | Diagnostic Terminal', iconURL: interaction.client.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.reply({
      embeds: [infoEmbed]
    });
  }
};