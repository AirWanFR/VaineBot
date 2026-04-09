const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'annonce',
  description: 'Diffuse une transmission officielle sur le canal',
  options: [
    {
      name: 'message',
      type: 3,
      description: 'Le contenu de la transmission',
      required: true
    }
  ],
  async execute(ctx, args, client) {
    let content;

    // --- Extraction du contenu ---
    if (ctx.isCommand?.()) {
      content = ctx.options.getString('message');
    } else {
      content = args.join(' ');
    }

    // --- Vérification Sécurité (Admin/Mod) ---
    const member = ctx.member;
    const hasPermission = member?.permissions.has(PermissionsBitField.Flags.Administrator) ||
                          member?.permissions.has(PermissionsBitField.Flags.ManageMessages);

    if (!hasPermission) {
      const errorMsg = '❌ Erreur de privilèges : Accès refusé.';
      return ctx.reply ? ctx.reply({ content: errorMsg, ephemeral: true }) : ctx.channel.send(errorMsg);
    }

    if (!content || content.length < 3) {
      const errorMsg = '⚠️ Transmission incomplète. Veuillez saisir un message.';
      return ctx.reply ? ctx.reply({ content: errorMsg, ephemeral: true }) : ctx.channel.send(errorMsg);
    }

    // --- Construction de l'Embed ---
    // --- Construction de l'Embed ---
    const broadcastEmbed = new EmbedBuilder()
      .setColor('#00fbff') 
      .setTitle('🛰️ TRANSMISSION OFFICIELLE')
      .setDescription(`\n${content}`)
      .setThumbnail(ctx.guild.iconURL({ dynamic: true }))
      .addFields({ 
        name: '👤 Émetteur', 
        value: `${ctx.user || ctx.author}`, 
        inline: true 
      })
      .setFooter({
        text: 'R1-D1 Unit', // Le texte est obligatoire ici
        iconURL: client.user.displayAvatarURL()
      })
      .setTimestamp();

    // --- Envoi du message ---
    try {
      if (ctx.isCommand?.()) {
        await ctx.reply({ content: '✅ Envoyé.', ephemeral: true });
        await ctx.channel.send({ embeds: [broadcastEmbed] });
      } else {
        // Supprime le préfixe r1!annonce pour ne laisser que l'embed
        await ctx.delete().catch(() => null);
        await ctx.channel.send({ embeds: [broadcastEmbed] });
      }
    } catch (err) {
      console.error(err);
    }
  }
};