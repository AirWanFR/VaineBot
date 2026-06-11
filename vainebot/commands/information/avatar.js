const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'avatar',
  description: 'Affiche la photo de profil d\'un utilisateur.',
  options: [
    {
      name: 'utilisateur',
      description: 'L\'utilisateur dont vous souhaitez voir l\'avatar',
      type: 6, // USER
      required: false,
    }
  ],
  async execute(interaction) {
    const isInteraction = typeof interaction.isCommand === 'function';
    
    let user;
    if (isInteraction) {
      user = interaction.options.getUser('utilisateur') || interaction.user;
    } else {
      user = interaction.mentions.users.first() || interaction.author;
    }

    const embed = new EmbedBuilder()
      .setColor('#a855f7')
      .setTitle(`🖼️ Avatar de ${user.username}`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setFooter({ text: 'Vainy Information', iconURL: interaction.client.user.displayAvatarURL() });

    if (isInteraction) {
      await interaction.reply({ embeds: [embed] });
    } else {
      await interaction.reply({ embeds: [embed] });
    }
  }
};
