const { 
  EmbedBuilder, 
  ActionRowBuilder, 
  StringSelectMenuBuilder, 
  StringSelectMenuOptionBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  ComponentType 
} = require('discord.js');

// Structure temporaire pour stocker les listes en mémoire (s'efface si le bot redémarre)
// Pour une vraie prod, il faudrait lier ça à une base de données (SQLite, MongoDB...)
const userTodos = new Map();

module.exports = {
  name: 'todo',
  description: 'Gère ta Todo List personnelle pour tes projets',
  async execute(message, args, client) {
    const userId = message.author.id;

    // 1. Gestion des arguments (Ajout de tâche)
    if (args.length > 0) {
      const task = args.join(' ');
      
      if (!userTodos.has(userId)) {
        userTodos.set(userId, []);
      }
      
      const list = userTodos.get(userId);
      if (list.length >= 10) {
        return message.reply('❌ Tu as atteint la limite de 10 tâches. Termines-en d\'abord !');
      }

      list.push({ text: task, done: false });
      return message.reply(`✅ Tâche ajoutée : "${task}"`);
    }

    // 2. Affichage de la Todo List interactive
    const list = userTodos.get(userId) || [];

    // Fonction pour générer l'embed et les composants (boutons/menus)
    function generateTodoInterface() {
      const currentList = userTodos.get(userId) || [];

      const embed = new EmbedBuilder()
        .setTitle(`📝 Todo List de ${message.author.username}`)
        .setColor('#00FFFF')
        .setTimestamp();

      if (currentList.length === 0) {
        embed.setDescription('*Ta liste est vide pour le moment. Utilise `!todo [ta tâche]` pour ajouter quelque chose !*');
        return { embeds: [embed], components: [] };
      }

      // Construction du texte de la liste
      let description = '';
      currentList.forEach((item, index) => {
        description += `${item.done ? '✅' : '⬜'} **${index + 1}.** ${item.done ? `~~${item.text}~~` : item.text}\n`;
      });
      embed.setDescription(description);

      // Menu déroulant pour cocher/décocher
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('todo_select')
        .setPlaceholder('Coche / Décoche une tâche...')
        .addOptions(
          currentList.map((item, index) => 
            new StringSelectMenuOptionBuilder()
              .setLabel(`${index + 1}. ${item.text.substring(0, 20)}`)
              .setValue(index.toString())
              .setEmoji(item.done ? '⬜' : '✅') // Propose l'inverse de l'état actuel
          )
        );

      // Bouton pour vider les tâches terminées
      const clearButton = new ButtonBuilder()
        .setCustomId('todo_clear')
        .setLabel('Nettoyer les tâches finies')
        .setStyle(ButtonStyle.Danger);

      const rowMenu = new ActionRowBuilder().addComponents(selectMenu);
      const rowButton = new ActionRowBuilder().addComponents(clearButton);

      return { embeds: [embed], components: [rowMenu, rowButton] };
    }

    // Envoi initial de l'interface
    const interfaceData = generateTodoInterface();
    const response = await message.channel.send(interfaceData);

    // Si la liste est vide, on s'arrête là (pas de composants interactifs)
    if (interfaceData.components.length === 0) return;

    // 3. Collecteur pour gérer les interactions (clics, sélections) pendant 10 minutes
    const collector = response.createMessageComponentCollector({
      filter: (i) => i.user.id === userId, // Seul l'auteur de la commande peut interagir
      time: 600000 // 10 minutes d'activité possibles
    });

    collector.on('collect', async (interaction) => {
      const currentList = userTodos.get(userId) || [];

      if (interaction.customId === 'todo_select') {
        const index = parseInt(interaction.values[0]);
        // Alterne l'état (True <-> False)
        currentList[index].done = !currentList[index].done;
        await interaction.deferUpdate();
      } 
      
      else if (interaction.customId === 'todo_clear') {
        // Garde uniquement les tâches qui ne sont pas faites
        const filteredList = currentList.filter(item => !item.done);
        userTodos.set(userId, filteredList);
        await interaction.deferUpdate();
      }

      // Met à jour l'affichage
      const updatedData = generateTodoInterface();
      await response.edit(updatedData);
    });

    // Désactivation des boutons à la fin du chrono
    collector.on('end', () => {
      response.edit({ components: [] }).catch(() => null);
    });
  }
};