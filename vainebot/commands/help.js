const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType
} = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Affiche l\'interface de commande de R1-D1',

  async execute(interactionOrMessage, args, client) {
    // Liste des commandes d'administration à ne pas afficher dans le menu public
    const ignoredCommands = ['reload', 'eval', 'secret', 'shutdown'];

    // Récupération et formatage des commandes
    const allCommands = client.commands
      ?.filter(cmd => !ignoredCommands.includes(cmd.name) && !cmd.hidden)
      .map(cmd => `**\`r1!${cmd.name}\`**\n└ *${cmd.description || 'Aucune description disponible.'}*`)
      || [];

    const pageSize = 5;
    const totalPages = Math.max(1, Math.ceil(allCommands.length / pageSize));
    let currentPage = 0;

    // --- Générateur d'Embed style R1-D1 ---
    const generateEmbed = (page) => {
      const start = page * pageSize;
      const currentCommands = allCommands.slice(start, start + pageSize).join('\n\n');
      
      return new EmbedBuilder()
        .setColor('#00fbff') // Cyan néon R1-D1
        .setTitle('🛰️ Interface de Commande | R1-D1')
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`Bonjour Erwan. Voici les modules opérationnels :\n\n${currentCommands || '*Aucun module détecté.*'}`)
        .addFields({ 
          name: '📡 Statut Système', 
          value: `\`En ligne\` | Latence : \`${client.ws.ping}ms\``, 
          inline: true 
        })
        .setFooter({
          text: `Index : ${page + 1} / ${totalPages} | Unité de service Vainerac`,
          iconURL: client.user.displayAvatarURL()
        })
        .setTimestamp();
    };

    // --- Boutons de Navigation Style Tech ---
    const generateRow = (page) => {
      return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('prev')
          .setLabel('« Précédent')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(page === 0),
        new ButtonBuilder()
          .setCustomId('next')
          .setLabel('Suivant »')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(page === totalPages - 1)
      );
    };

    // --- Envoi initial ---
    const payload = { 
      embeds: [generateEmbed(currentPage)], 
      components: [generateRow(currentPage)],
      fetchReply: true 
    };

    let message;
    try {
      if (interactionOrMessage.isCommand?.()) {
        message = await interactionOrMessage.reply(payload);
      } else {
        message = await interactionOrMessage.channel.send(payload);
      }
    } catch (err) {
      return console.error("Erreur lors de l'envoi du menu help :", err);
    }

    // --- Collector de composants (Boutons) ---
    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 120000 // 2 minutes avant expiration
    });

    collector.on('collect', async i => {
      // Sécurité : Seul celui qui a tapé la commande peut changer de page
      const authorId = interactionOrMessage.user?.id || interactionOrMessage.author?.id;
      if (i.user.id !== authorId) {
        return i.reply({ content: "❌ Accès refusé. Cette interface appartient à Erwan.", ephemeral: true });
      }

      if (i.customId === 'next') currentPage++;
      else if (i.customId === 'prev') currentPage--;

      currentPage = Math.max(0, Math.min(currentPage, totalPages - 1));

      await i.update({
        embeds: [generateEmbed(currentPage)],
        components: [generateRow(currentPage)]
      });
    });

    collector.on('end', async () => {
      // Désactive les boutons à la fin du temps imparti
      const disabledRow = generateRow(currentPage);
      disabledRow.components.forEach(btn => btn.setDisabled(true));
      
      try {
        await message.edit({ components: [disabledRow] });
      } catch (e) {
        // Le message a pu être supprimé
      }
    });
  }
};