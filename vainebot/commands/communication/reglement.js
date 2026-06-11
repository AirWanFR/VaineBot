const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'reglement',
  description: 'Affiche le règlement complet du serveur',
  hidden: true, 
  async execute(message, args, client) {
    // Vérifie si l'utilisateur a la permission de gérer les messages
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply('❌ Tu n\'as pas la permission de lancer le règlement.');
    }

    const embed = new EmbedBuilder()
      .setTitle('🚀 Code de conduite — Le QG & Projets')
      .setColor('#00FFFF') // Un cyan un peu plus électrique / tech
      .setDescription(`
Bienvenue ici ! Ce serveur, c'est notre espace à nous : à la fois notre salon pour **chill entre potes** et notre bureau pour **faire avancer mes projets**. 

Pour que tout le monde s'y retrouve et qu'on avance bien, on s'impose juste quelques règles de bon sens :

**1️⃣ Bonne ambiance & Respect (Évidemment)**
- On est entre potes, donc l'humour et le second degré sont les bienvenus, mais on évite de basculer dans la toxicité ou le manque de respect lourd.
- Les débats d'idées sur les projets, c'est oui. Les embrouilles d'ego, c'est non.

**2️⃣ Organisation & Salons (Le secret de la productivité)**
- Respecte la thématique des salons. Ne spamme pas les salons avec des mèmes, et évite de lancer un pavé technique dans le général.
- Chaque chose à sa place pour éviter que les infos importantes se perdent dans le flood.

**3️⃣ Gestion de Projet & Suivi**
- Quand on bosse sur un projet commun, essaie de tenir à jour tes tâches (Trello, GitHub, ou les salons dédiés).
- Si tu as un contretemps ou que tu lâches un dossier, dis-le franchement. La comm', c'est la clé, on ne laisse pas les autres dans le flou.

**4️⃣ Ping & Mentions avec modération**
- Utilise les \`@everyone\` ou \`@here\` uniquement pour les urgences ou les grosses annonces de projet.
- Si tu as besoin d'une réponse rapide sur un projet, ping les rôles concernés plutôt que de harceler en MP.

**5️⃣ Salons Vocaux & Réunions**
- En vocal "chill", fais ce que tu veux. En vocal "réunion de projet", on essaie de rester focus pour ne pas faire durer le call 3 heures.
- Si tu as un micro qui sature ou du bruit de fond (famille, travaux, aspirateur), passe en *Push-to-Talk* ou active la réduction de bruit.

**6️⃣ Confidentialité & Sécurité**
- Tout ce qui est partagé ici (idées de projets, codes sources, fichiers persos, dossiers d'école/boulot) reste entre nous. Pas de fuite à l'extérieur sans l'accord du groupe.
- N'invite pas de personnes externes ou de bots sans avoir demandé l'avis général avant.

---

Bref, on est là pour kiffer, créer des trucs cool et avancer ensemble. Merci à tous de jouer le jeu ! 🛠️✨
      `)
      .setFooter({ text: 'Vainy • Règlement officiel' })
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  }
};