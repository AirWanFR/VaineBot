const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'reglement',
  description: 'Affiche le règlement complet du serveur',
  hidden: true, // Ce champ n'est pas utilisé par Discord, mais peut t'aider en interne
  async execute(message, args, client) {
    // Vérifie si l'utilisateur a la permission de gérer les messages
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply('❌ Tu n\'as pas la permission de faire une annonce.');
    }

    const embed = new EmbedBuilder()
      .setTitle('📚 Règlement du serveur CyberNotes')
      .setColor('#1E90FF')
      .setDescription(`
Bienvenue sur **CyberNotes**, un serveur dédié au partage de ressources et à l'entraide entre élèves.  
Afin de garantir un environnement sain, respectueux et efficace, merci de respecter les règles suivantes :

**1️⃣ Respect et courtoisie**  
- Chaque membre mérite respect et bienveillance, évite les insultes, le harcèlement ou toute forme de discrimination (sexe, origine, orientation, religion, etc.).  
- Les débats sont autorisés mais toujours dans le respect de l’autre.

**2️⃣ Partage de ressources**  
- Seules les ressources éducatives pertinentes sont autorisées.  
- Ne partage pas de contenu piraté, illégal ou soumis à droits d’auteur sans autorisation.  
- Mentionne la source des documents si possible.

**3️⃣ Organisation des salons**  
- Utilise les salons dédiés aux différentes matières pour poster tes ressources ou poser tes questions.  
- Évite le hors-sujet dans les salons spécialisés.

**4️⃣ Pas de spam ni publicité**  
- Les messages répétitifs, publicités non autorisées, liens douteux ou scams sont interdits.  
- Pour toute publicité, contacte un modérateur avant de poster.

**5️⃣ Confidentialité et vie privée**  
- Ne partage pas d’informations personnelles (adresse, numéro, photos privées) sans consentement.  
- Respecte la vie privée des autres membres.

**6️⃣ Comportement en classe virtuelle / sessions d’entraide**  
- Sois ponctuel et respectueux pendant les sessions en vocal ou écrites.  
- Utilise un langage approprié et évite les distractions inutiles.

**7️⃣ Signalement et modération**  
- Si tu observes un comportement ou un contenu inapproprié, utilise les salons de signalement ou contacte directement un modérateur.  
- Les décisions des modérateurs sont à respecter, en cas de désaccord, une discussion privée est préférable.

**8️⃣ Sécurité et bots**  
- N’invite pas de bots externes sans approbation des administrateurs.  
- Ne clique pas sur des liens inconnus envoyés dans le serveur.

---

Merci à tous de contribuer à faire de **CyberNotes** un lieu d’entraide et de partage agréable pour tous les élèves.  
Pour toute question, n’hésite pas à contacter un membre de l’équipe modération.

---

*CyberNotes © 2025*
      `)
      .setFooter({ text: 'CyberNotes Bot' })
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  }
};
