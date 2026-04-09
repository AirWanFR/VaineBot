const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'role',
  description: 'Envoie le message pour obtenir les rôles 2027 et 2028',
  hidden: true,
  async execute(message, args, client) {
    const embed = new EmbedBuilder()
      .setTitle('📚 Choisis ton année')
      .setDescription('Réagis pour obtenir ton rôle :\n\n🟢 — 2027\n🔵 — 2028')
      .setColor('#5865F2')
      .setFooter({ text: 'CyberNotes Bot' })
      .setTimestamp();

    // Envoie l'embed et récupère le message envoyé
    const sentMessage = await message.channel.send({ embeds: [embed] });

    // Ajoute les réactions au message envoyé
    await sentMessage.react('🟢');
    await sentMessage.react('🔵');
  }
};
