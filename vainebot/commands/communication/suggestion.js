const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'suggestion',
  description: 'Soumets une suggestion pour améliorer le serveur',
  options: [
    {
      name: 'contenu',
      type: 3,
      description: 'Ta suggestion',
      required: true
    }
  ],
  async execute(ctx, args, client) {
    let contenu;

    if (ctx.isCommand?.()) {
      // Slash command
      contenu = ctx.options.getString('contenu');
    } else if (ctx.content) {
      // Commande texte type "cn!suggestion blabla"
      contenu = args.join(' ');
    }

    if (!contenu || contenu.length < 3) {
      return ctx.reply?.('❌ Merci de fournir une suggestion valable.') || ctx.channel.send('❌ Merci de fournir une suggestion valable.');
    }

    const embed = new EmbedBuilder()
      .setTitle('💡 Nouvelle suggestion')
      .setDescription(contenu)
      .setColor('#00AEFF')
      .setFooter({ text: `Suggestion de ${ctx.user?.tag || ctx.author.tag}`, iconURL: ctx.user?.displayAvatarURL() || ctx.author.displayAvatarURL() })
      .setTimestamp();

    const suggestionsChannel = ctx.guild.channels.cache.find(ch => ch.name === '💡・suggestions-reçus');

    if (suggestionsChannel) {
      await suggestionsChannel.send({ embeds: [embed] });
      if (ctx.reply) await ctx.reply({ content: '✅ Suggestion envoyée !', ephemeral: true });
      else ctx.channel.send('✅ Suggestion envoyée !');
    } else {
      const warning = '⚠️ Le salon `#suggestions` est introuvable.';
      if (ctx.reply) await ctx.reply({ content: warning, ephemeral: true });
      else ctx.channel.send(warning);
    }
  }
};
