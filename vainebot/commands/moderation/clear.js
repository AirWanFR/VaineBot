const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'clear',
  description: 'Supprime un certain nombre de messages.',
  options: [
    {
      name: 'montant',
      description: 'Nombre de messages à supprimer (1-100)',
      type: 4, // INTEGER
      required: true,
    }
  ],
  async execute(interaction) {
    if (!interaction.isCommand || !interaction.isCommand()) {
      return interaction.reply({ content: 'Cette commande ne peut être utilisée qu\'en Slash Command.', ephemeral: true }).catch(() => null);
    }

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({ content: '❌ Accès refusé : Vous n\'avez pas la permission de gérer les messages.', ephemeral: true });
    }

    const amount = interaction.options.getInteger('montant');

    if (amount < 1 || amount > 100) {
      return interaction.reply({ content: '⚠️ Veuillez spécifier un montant entre 1 et 100.', ephemeral: true });
    }

    try {
      const messages = await interaction.channel.bulkDelete(amount, true);
      const embed = new EmbedBuilder()
        .setColor('#10b981')
        .setDescription(`✅ **${messages.size}** messages ont été supprimés.`)
        .setFooter({ text: 'Vainy Moderation', iconURL: interaction.client.user.displayAvatarURL() });

      const reply = await interaction.reply({ embeds: [embed], fetchReply: true });
      setTimeout(() => reply.delete().catch(() => null), 5000);
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: '❌ Une erreur est survenue lors de la suppression des messages.', ephemeral: true });
    }
  }
};
