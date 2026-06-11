const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'Bannit un utilisateur du serveur.',
  options: [
    {
      name: 'utilisateur',
      description: 'L\'utilisateur à bannir',
      type: 6, // USER
      required: true,
    },
    {
      name: 'raison',
      description: 'La raison du bannissement',
      type: 3, // STRING
      required: false,
    }
  ],
  async execute(interaction) {
    const isInteraction = typeof interaction.isCommand === 'function';

    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({ content: '❌ Accès refusé : Vous n\'avez pas la permission de bannir des membres.', ephemeral: true });
    }

    let targetUser;
    let reason = 'Aucune raison fournie.';

    if (isInteraction) {
      targetUser = interaction.options.getUser('utilisateur');
      reason = interaction.options.getString('raison') || reason;
    } else {
      targetUser = interaction.mentions.users.first();
      const argsArray = interaction.content.trim().split(/ +/).slice(2);
      if (argsArray.length > 0) reason = argsArray.join(' ');
    }

    if (!targetUser) {
      return interaction.reply({ content: '❌ Veuillez mentionner un utilisateur à bannir (ex: v!ban @Pseudo raison).', ephemeral: true }).catch(() => null);
    }

    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (targetMember && !targetMember.bannable) {
      return interaction.reply({ content: '❌ Impossible de bannir cet utilisateur (rôle supérieur ou permissions manquantes).', ephemeral: true });
    }

    try {
      await interaction.guild.members.ban(targetUser, { reason });
      const embed = new EmbedBuilder()
        .setColor('#ef4444')
        .setTitle('⛔ Bannissement')
        .setDescription(`**${targetUser.tag}** a été banni.`)
        .addFields({ name: 'Raison', value: reason })
        .setFooter({ text: 'Vainy Moderation', iconURL: interaction.client.user.displayAvatarURL() });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: '❌ Une erreur est survenue lors du bannissement.', ephemeral: true });
    }
  }
};
