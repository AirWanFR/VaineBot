const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  PermissionsBitField
} = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Accès aux bases de données R1-D1 par sections',

  async execute(ctx, args, client) {
    const ignoredCommands = ['reload', 'eval', 'secret', 'shutdown'];
    const authorId = ctx.user?.id || ctx.author?.id;
    const member = ctx.member;
    const COMMANDS_PER_PAGE = 5;

    // --- 1. CONFIGURATION DES ACCÈS ---
    // Définit ici les dossiers qui demandent un grade spécial
    const privateCategories = ['moderation', 'admin', '🛡️ moderation', '⚙️ admin']; 
    
    // Vérification : Est-ce qu'il est Admin, Modo, ou possède un rôle spécifique ?
    const isStaff = member?.permissions.has(PermissionsBitField.Flags.ManageMessages) || 
                    member?.permissions.has(PermissionsBitField.Flags.Administrator) ||
                    member?.roles.cache.has("1285950633769439270"); // Ton rôle DEV par exemple

    // --- 2. ORGANISATION DES DONNÉES FILTRÉES ---
    const categoriesMap = {};
    client.commands.forEach(cmd => {
      if (ignoredCommands.includes(cmd.name) || cmd.hidden) return;

      const cat = cmd.category || 'Général';
      const isPrivate = privateCategories.includes(cat.toLowerCase());

      // Si la catégorie est privée et que l'user n'est pas staff, on ignore
      if (isPrivate && !isStaff) return;

      if (!categoriesMap[cat]) categoriesMap[cat] = [];
      categoriesMap[cat].push(`**\`v!${cmd.name}\`**\n└ *${cmd.description || 'N/A'}*`);
    });

    const categoryKeys = Object.keys(categoriesMap);
    
    // Sécurité si aucune commande n'est visible
    if (categoryKeys.length === 0) {
      return ctx.reply({ content: "⚠️ Aucune base de données accessible pour votre profil.", ephemeral: true });
    }

    let currentCatIndex = 0;
    let currentPageIndex = 0;

    // --- 3. GÉNÉRATEURS D'INTERFACE ---
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
        .setDescription(`>>> Bonjour <@${authorId}>. Accès autorisé au module **${categoryName}**.\n\n${paginatedCmds}`)
        .addFields(
          { name: '📂 Section', value: `\`${catIdx + 1} / ${categoryKeys.length}\``, inline: true },
          { name: '📄 Page', value: `\`${pageIdx + 1} / ${totalPages}\``, inline: true }
        )
        .setFooter({ text: 'Système Vainerac • Unité de service R1-D1', iconURL: client.user.displayAvatarURL() })
        .setTimestamp();
    };

    const generateComponents = (catIdx, pageIdx) => {
      const rows = [];
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

      const totalPages = Math.ceil(categoriesMap[categoryKeys[catIdx]].length / COMMANDS_PER_PAGE);
      if (totalPages > 1) {
        const navRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('prev_page').setEmoji('⬅️').setStyle(ButtonStyle.Secondary).setDisabled(pageIdx === 0),
          new ButtonBuilder()
            .setCustomId('next_page').setEmoji('➡️').setStyle(ButtonStyle.Secondary).setDisabled(pageIdx === totalPages - 1)
        );
        rows.push(navRow);
      }
      return rows;
    };

    // --- 4. ENVOI ET GESTIONNAIRE ---
    const payload = { 
      embeds: [generateEmbed(currentCatIndex, currentPageIndex)], 
      components: generateComponents(currentCatIndex, currentPageIndex),
      fetchReply: true 
    };

    const message = ctx.isCommand?.() ? await ctx.reply(payload) : await ctx.channel.send(payload);

    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 120000 
    });

    collector.on('collect', async i => {
      if (i.user.id !== authorId) return i.reply({ content: "⚠️ Accès refusé. Interface verrouillée sur l'émetteur original.", ephemeral: true });

      if (i.customId.startsWith('cat_')) {
        currentCatIndex = parseInt(i.customId.split('_')[1]);
        currentPageIndex = 0;
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