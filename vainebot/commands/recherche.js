const { ChannelType } = require('discord.js');

module.exports = {
  name: 'recherche',
  description: 'Recherche les posts avec un tag spécifique dans les salons forums accessibles',
  options: [
    {
      name: 'tag',
      type: 3,
      description: 'Nom du tag à rechercher',
      required: true
    },
    {
      name: 'salon',
      type: 7,
      description: 'Salon forum spécifique (optionnel)',
      required: false
    }
  ],

  async execute(ctx, args, client) {
    const isSlash = ctx.isCommand?.();
    const tagName = isSlash ? ctx.options.getString('tag') : args[0];
    const specifiedChannel = isSlash ? ctx.options.getChannel('salon') : null;
    const member = ctx.member;
    const guild = ctx.guild;

    if (!tagName) {
      const msg = '❌ Tu dois spécifier un tag à rechercher.';
      return ctx.reply?.({ content: msg, ephemeral: true }) || ctx.channel.send(msg);
    }

    // 🧭 Détermine les forums à parcourir
    let forumsToSearch;

    if (specifiedChannel) {
      if (specifiedChannel.type !== ChannelType.GuildForum) {
        const msg = '❌ Le salon spécifié n\'est pas un salon forum.';
        return ctx.reply?.({ content: msg, ephemeral: true }) || ctx.channel.send(msg);
      }

      if (!specifiedChannel.viewable || !specifiedChannel.permissionsFor(member).has('ViewChannel')) {
        const msg = '❌ Tu n\'as pas accès à ce salon.';
        return ctx.reply?.({ content: msg, ephemeral: true }) || ctx.channel.send(msg);
      }

      forumsToSearch = [specifiedChannel];
    } else {
      forumsToSearch = guild.channels.cache
        .filter(channel =>
          channel.type === ChannelType.GuildForum &&
          channel.viewable &&
          channel.permissionsFor(member).has('ViewChannel')
        )
        .map(channel => channel);
    }

    if (forumsToSearch.length === 0) {
      const msg = '❌ Aucun salon forum accessible trouvé.';
      return ctx.reply?.({ content: msg, ephemeral: true }) || ctx.channel.send(msg);
    }

    // 🔍 Cherche le tag dans les salons
    let foundTag = null;
    let tagId = null;

    for (const forum of forumsToSearch) {
      const match = forum.availableTags.find(t => t.name.toLowerCase() === tagName.toLowerCase());
      if (match) {
        foundTag = match;
        tagId = match.id;
        break;
      }
    }

    // ❌ Aucun tag correspondant trouvé
    if (!foundTag) {
      let tagListText = '';

      for (const forum of forumsToSearch) {
        if (!forum.availableTags.length) continue;

        const tagLines = forum.availableTags.map(tag => `• \`${tag.name}\``).join('\n');
        tagListText += `\n### 🗂️ ${forum.name}\n${tagLines}\n`;
      }

      const msg = `❌ Tag **${tagName}** introuvable dans les salons forum accessibles.\n\n📋 **Tags disponibles :**${tagListText || '\n*Aucun tag disponible*'}`;
      return ctx.reply?.({ content: msg, ephemeral: true }) || ctx.channel.send(msg);
    }

    // ✅ Recherche les posts avec le tag trouvé
    let totalResults = 0;
    let resultText = '';

    for (const forum of forumsToSearch) {
      // Ce salon contient-il le tag ?
      if (!forum.availableTags.find(t => t.id === tagId)) continue;

      const threads = await forum.threads.fetchActive();
      const matchingThreads = threads.threads.filter(thread =>
        thread.appliedTags.includes(tagId)
      );

      if (matchingThreads.size > 0) {
        totalResults += matchingThreads.size;
        resultText += `\n### 🗂️ ${forum.name} (${matchingThreads.size} post${matchingThreads.size > 1 ? 's' : ''})\n`;
        resultText += matchingThreads.map(thread =>
          `• [${thread.name}](https://discord.com/channels/${guild.id}/${thread.id})`
        ).join('\n') + '\n';
      }
    }

    if (totalResults === 0) {
      const msg = `🔍 Aucun post trouvé avec le tag **${foundTag.name}** dans les salons forum accessibles.`;
      return ctx.reply?.({ content: msg, ephemeral: true }) || ctx.channel.send(msg);
    }

    const header = `🔎 Résultats pour le tag **${foundTag.name}** :\n`;
    const content = header + resultText;

    return ctx.reply?.({ content, ephemeral: false }) || ctx.channel.send(content);
  }
};
