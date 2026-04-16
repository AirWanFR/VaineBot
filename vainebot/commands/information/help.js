const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType
} = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Accès aux bases de données R1-D1 par sections',

  async execute(ctx, args, client) {
    const ignoredCommands = ['reload', 'eval', 'secret', 'shutdown'];
    const authorId = ctx.user?.id || ctx.author?.id;
    const COMMANDS_PER_PAGE = 5;

    // --- 1. Organisation des données ---
    const categoriesMap = {};
    client.commands.forEach(cmd => {
      if (ignoredCommands.includes(cmd.name) || cmd.hidden) return;
      const cat = cmd.category || 'Général';
      if (!categoriesMap[cat]) categoriesMap[cat] = [];
      categoriesMap[cat].push(`**\`v!${cmd.name}\`**\n└ *${cmd.description || 'N/A'}*`);
    });

    const categoryKeys = Object.keys(categoriesMap);
    let currentCatIndex = 0;
    let currentPageIndex = 0;

    // --- 2. Fonctions de génération d'interface ---
    const generateEmbed = (catIdx, pageIdx) => {
      const categoryName = categoryKeys[catIdx];
      const allCmds = categoriesMap[categoryName];
      const totalPages = Math.ceil(allCmds.length / COMMANDS_PER_PAGE);
      
      const start = pageIdx * COMMANDS_PER_PAGE;
      const end = start + COMMANDS_PER_PAGE;
      const paginatedCmds = allCmds.slice(start, end).join('\n\n');

      return new EmbedBuilder()
        .setColor('#00fbff')
        .setTitle(`🛰️ R1-D1 | DATABASE : ${categoryName.toUpperCase()}`)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`>>> Bonjour Erwan. Lecture du module **${categoryName}**.\n\n${paginatedCmds}`)
        .addFields(
          { name: '📂 Section', value: `\`${catIdx + 1} / ${categoryKeys.length}\``, inline: true },
          { name: '📄 Page', value: `\`${pageIdx + 1} / ${totalPages}\``, inline: true }
        )
        .setFooter({ text: 'Système Vainerac • Unité de service R1-D1', iconURL: client.user.displayAvatarURL() })
        .setTimestamp();
    };

    const generateComponents = (catIdx, pageIdx) => {
      const rows = [];
      
      // Ligne 1 : Sélecteur de Sections (Max 5 boutons par ligne)
      const sectionRow = new ActionRowBuilder();
      categoryKeys.forEach((cat, index) => {
        sectionRow.addComponents(
          new ButtonBuilder()
            .setCustomId(`cat_${index}`)
            .setLabel(cat.charAt(0).toUpperCase() + cat.slice(1))
            .setStyle(index === catIdx ? ButtonStyle.Primary : ButtonStyle.Secondary)
        );
      });
      rows.push(sectionRow);

      // Ligne 2 : Navigation dans la section (uniquement si besoin)
      const totalPages = Math.ceil(categoriesMap[categoryKeys[catIdx]].length / COMMANDS_PER_PAGE);
      if (totalPages > 1) {
        const navRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('prev_page')
            .setEmoji('⬅️')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(pageIdx === 0),
          new ButtonBuilder()
            .setCustomId('next_page')
            .setEmoji('➡️')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(pageIdx === totalPages - 1)
        );
        rows.push(navRow);
      }

      return rows;
    };

    // --- 3. Envoi Initial ---
    const payload = { 
      embeds: [generateEmbed(currentCatIndex, currentPageIndex)], 
      components: generateComponents(currentCatIndex, currentPageIndex),
      fetchReply: true 
    };

    const message = ctx.isCommand?.() ? await ctx.reply(payload) : await ctx.channel.send(payload);

    // --- 4. Gestionnaire d'interactions ---
    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 120000 
    });

    collector.on('collect', async i => {
      if (i.user.id !== authorId) return i.reply({ content: "⚠️ Accès refusé.", ephemeral: true });

      if (i.customId.startsWith('cat_')) {
        currentCatIndex = parseInt(i.customId.split('_')[1]);
        currentPageIndex = 0; // Reset la page quand on change de catégorie
      } else if (i.customId === 'next_page') {
        currentPageIndex++;
      } else if (i.customId === 'prev_page') {
        currentPageIndex--;
      }

      await i.update({
        embeds: [generateEmbed(currentCatIndex, currentPageIndex)],
        components: generateComponents(currentCatIndex, currentPageIndex)
      });
    });

    collector.on('end', () => {
      message.edit({ components: [] }).catch(() => null);
    });
  }
};