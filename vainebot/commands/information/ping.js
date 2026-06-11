module.exports = {
  name: 'ping',
  description: 'Affiche la latence du bot',
  async execute(interactionOrMessage) {
    // Si c'est un message (v!ping), l'objet n'a pas isCommand
    const isInteraction = typeof interactionOrMessage.isCommand === 'function';

    const sent = await interactionOrMessage.reply({ content: '🏓 Pong!', fetchReply: true });
    const latency = sent.createdTimestamp - interactionOrMessage.createdTimestamp;

    if (isInteraction) {
      await interactionOrMessage.editReply(`🏓 Latence : ${latency}ms`);
    } else {
      await sent.edit(`🏓 Latence : ${latency}ms`);
    }
  }
};
