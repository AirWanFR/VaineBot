module.exports = {
  name: 'ressource',
  description: 'Partage une ressource éducative',
  options: [
    { name: 'titre', type: 3, description: 'Titre de la ressource', required: true },
    { name: 'lien', type: 3, description: 'Lien de la ressource', required: true },
    { name: 'description', type: 3, description: 'Description courte', required: false }
  ],
  async execute(interaction) {
    const titre = interaction.options.getString('titre');
    const lien = interaction.options.getString('lien');
    const desc = interaction.options.getString('description') || 'Aucune description fournie.';

    const embed = new EmbedBuilder()
      .setTitle(titre)
      .setURL(lien)
      .setDescription(desc)
      .setColor('#00AEFF')
      .setFooter({ text: 'CyberNotes • Ressource' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
