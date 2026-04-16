const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'annonce',
  description: 'Affiche une annonce simple dans un embed',
  options: [
    {
      name: 'message',
      type: 3,
      description: 'Le contenu de l\'annonce',
      required: true
    }
  ],
  async execute(ctx, args, client) {
    const content = ctx.isCommand?.() ? ctx.options.getString('message') : args.join(' ');

    // --- Vérification Permissions ---
    if (!ctx.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return ctx.reply({ content: '❌ Tu n\'as pas la permission d\'utiliser cette commande.', ephemeral: true });
    }

    // --- Construction de l'Embed Classique ---
    const annoncedEmbed = new EmbedBuilder()
      .setColor('#0099ff') // Bleu classique Discord
      .setTitle('📢 Annonce')
      .setDescription(content)
      .setFooter({ 
        text: `Par ${ctx.user?.tag || ctx.author.tag}`, 
        iconURL: (ctx.user || ctx.author).displayAvatarURL() 
      })
      .setTimestamp();

    // --- Envoi ---
    try {
      if (ctx.isCommand?.()) {
        await ctx.reply({ content: 'Annonce envoyée !', ephemeral: true });
        await ctx.channel.send({ embeds: [annoncedEmbed] });
      } else {
        if (ctx.deletable) await ctx.delete().catch(() => null);
        await ctx.channel.send({ embeds: [annoncedEmbed] });
      }
    } catch (err) {
      console.error(err);
    }
  }
};