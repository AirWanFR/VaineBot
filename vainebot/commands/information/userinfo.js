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
    const isInteraction = typeof interaction.isCommand === 'function';

    let user;
    if (isInteraction) {
      user = interaction.options.getUser('utilisateur');
    } else {
      user = interaction.mentions.users.first();
    }

    if (!user) {
      return interaction.reply({ content: '❌ Veuillez mentionner un utilisateur (ex: v!userinfo @Pseudo).', ephemeral: true }).catch(() => null);
    }

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    const infoEmbed = new EmbedBuilder()
      .setColor('#00fbff') // Cyan néon Vainy
      .setTitle(`📡 Rapport d'Analyse : ${user.username}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: '🆔 ID Système', value: `\`${user.id}\``, inline: true },
        { name: '👤 Identité', value: `${user.tag}`, inline: true },
        { name: '📅 Inscription Discord', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:f> (<t:${Math.floor(user.createdTimestamp / 1000)}:R>)`, inline: false },
        { name: '🤖 Type d\'Entité', value: user.bot ? 'Intelligence Artificielle' : 'Utilisateur Humain', inline: true }
      );

    if (member) {
      infoEmbed.addFields(
        { name: '📥 Arrivée Serveur', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:f> (<t:${Math.floor(member.joinedTimestamp / 1000)}:R>)`, inline: false },
        { name: '🎭 Accès Principal', value: `${member.roles.highest}`, inline: true }
      );
    }

    infoEmbed.setFooter({ text: 'Vainy • Rapport d\'Analyse', iconURL: interaction.client.user.displayAvatarURL() }).setTimestamp();

    await interaction.reply({ embeds: [infoEmbed] });
  }
};