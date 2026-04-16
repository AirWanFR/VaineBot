const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'consentement',
  hidden:'true',
  description: 'Invite à accepter le consentement Forge pour obtenir les rôles',
  async execute(interaction) {
    
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
       return interaction.reply({ content: '❌ Tu n\'as pas la permission d\'utiliser cette commande.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('⚠️ Consentement requis')
      .setDescription(
        'Pour obtenir tes rôles sur ce serveur, tu dois accepter le consentement via Forge.\n\n' +
        '[Clique ici pour gérer tes consentements](https://discord.forge.epita.fr/consents)\n\n' +
        'Une fois fait, le bot synchronisera automatiquement tes rôles.'
      )
      .setColor('#0099FF')
      .setFooter({ text: 'EPITA Forge Bot' })
      .setTimestamp();

    // Envoie le message dans le canal où la commande a été utilisée
    await interaction.reply({ content: 'Message publié.', ephemeral: true }); // confirme la commande
    await interaction.channel.send({ embeds: [embed] }); // envoi visible par tous
  }
};
