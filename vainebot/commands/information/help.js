const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType
} = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Affiche l\'interface de commande de R1-D1 par catégories',

  async execute(ctx, args, client) {
    const ignoredCommands = ['reload', 'eval', 'secret', 'shutdown'];
    const authorId = ctx.user?.id || ctx.author?.id;

    // --- 1. Organisation des commandes par catégories ---
    const categories = {};

    client.commands.forEach(cmd => {
      if (ignoredCommands.includes(cmd.name) || cmd.hidden) return;

      // On utilise la propriété 'category' (nom du dossier) définie lors du chargement
      const categoryName = cmd.category || 'Général';
      if (!categories[categoryName]) categories[categoryName] = [];
      
      categories[categoryName].push(`**\`r1!${cmd.name}\`**\n└ *${cmd.description || 'Pas de description.'}*`);
    });

    const categoryKeys = Object.keys(categories);
    let currentPage = 0;

    // --- 2. Générateur d'Embed ---
    const generateEmbed = (pageIndex) => {
      const categoryName = categoryKeys[pageIndex];
      const commandsList = categories[categoryName].join('\n\n');
      const categoryLabel = categoryName.toUpperCase();

      return new EmbedBuilder()
        .setColor('#00fbff')
        .setTitle(`🛰️ Interface R1-D1 | Module : ${categoryLabel}`)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`Bonjour Erwan. Accès aux protocoles de la section **${categoryLabel}** :\n\n${commandsList}`)
        .addFields({ 
          name: '📊 Indexation', 
          value: `Dossier \`${pageIndex + 1} sur ${categoryKeys.length}\``, 
          inline: true 
        })
        .setFooter({
          text: `R1-D1 Unit | Système de fichiers Vainerac`,
          iconURL: client.user.displayAvatarURL()
        })
        .setTimestamp();
    };

    // --- 3. Boutons de Navigation ---
    const generateRow = (pageIndex) => {
      return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('prev')
          .setLabel('📁 Dossier Précédent')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(pageIndex === 0),
        new ButtonBuilder()
          .setCustomId('next')
          .setLabel('Dossier Suivant 📁')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(pageIndex === categoryKeys.length - 1)
      );
    };

    // --- 4. Envoi et Gestionnaire ---
    const payload = { 
      embeds: [generateEmbed(currentPage)], 
      components: [generateRow(currentPage)],
      fetchReply: true 
    };

    const message = ctx.isCommand?.() ? await ctx.reply(payload) : await ctx.channel.send(payload);

    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60000 
    });

    collector.on('collect', async i => {
      if (i.user.id !== authorId) {
        return i.reply({ content: "❌ Accès refusé. Cette interface est verrouillée.", ephemeral: true });
      }

      if (i.customId === 'next') currentPage++;
      else if (i.customId === 'prev') currentPage--;

      await i.update({
        embeds: [generateEmbed(currentPage)],
        components: [generateRow(currentPage)]
      });
    });

    collector.on('end', () => {
      const disabledRow = generateRow(currentPage);
      disabledRow.components.forEach(btn => btn.setDisabled(true));
      message.edit({ components: [disabledRow] }).catch(() => null);
    });
  }
};