module.exports = {
  name: 'ping',
  description: 'Affiche la latence du bot',
  async execute(interaction) {
    if (!interaction.isCommand()) return;

    const sent = await interaction.reply({ content: '🏓 Pong!', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(`🏓 Latence : ${latency}ms`);
  }
};
