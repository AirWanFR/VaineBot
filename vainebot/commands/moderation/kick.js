const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'kick',
  description: 'Expulse un utilisateur du serveur.',
  options: [
    {
      name: 'utilisateur',
      description: 'L\'utilisateur à expulser',
      type: 6, // USER
      required: true,
    },
    {
      name: 'raison',
      description: 'La raison de l\'expulsion',
      type: 3, // STRING
      required: false,
    }
  ],
  async execute(interaction) {
    if (!interaction.isCommand || !interaction.isCommand()) return;

    if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return interaction.reply({ content: '❌ Accès refusé : Vous n\'avez pas la permission d\'expulser des membres.', ephemeral: true });
    }

    const targetUser = interaction.options.getUser('utilisateur');
    const reason = interaction.options.getString('raison') || 'Aucune raison fournie.';
    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (!targetMember) {
      return interaction.reply({ content: '❌ Utilisateur introuvable sur le serveur.', ephemeral: true });
    }

    if (!targetMember.kickable) {
      return interaction.reply({ content: '❌ Impossible d\'expulser cet utilisateur (rôle supérieur ou permissions manquantes).', ephemeral: true });
    }

    try {
      await targetMember.kick(reason);
      const embed = new EmbedBuilder()
        .setColor('#eab308')
        .setTitle('🔨 Expulsion')
        .setDescription(`**${targetUser.tag}** a été expulsé.`)
        .addFields({ name: 'Raison', value: reason })
        .setFooter({ text: 'Vainy Moderation', iconURL: interaction.client.user.displayAvatarURL() });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: '❌ Une erreur est survenue lors de l\'expulsion.', ephemeral: true });
    }
  }
};
