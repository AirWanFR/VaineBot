
const { askVainy } = require('../../services/aiService');

// Stockage en mémoire de l'historique par utilisateur (ou par salon)
// Ici on utilise l'ID de l'utilisateur pour un contexte personnalisé
const userHistories = new Map();
const MAX_HISTORY = 10; // Garder les 10 derniers messages (5 échanges)

module.exports = {
  name: 'vainy',
  description: 'Parler avec Vainy',
  options: [
    {
      name: 'message',
      description: 'Ton message ou ta consigne',
      type: 3, // ApplicationCommandOptionType.String
      required: true
    },
    {
      name: 'complexe',
      description: 'Activer le modèle lourd pour raisonnement',
      type: 5, // ApplicationCommandOptionType.Boolean
      required: false
    }
  ],

  async execute(interaction) {
    await interaction.deferReply();

    const prompt = interaction.options.getString('message');
    const isComplex = interaction.options.getBoolean('complexe') || false;
    const userId = interaction.user.id;

    if (!userHistories.has(userId)) {
      userHistories.set(userId, []);
    }

    const history = userHistories.get(userId);
    history.push({ role: 'user', content: prompt });

    // Limiter la taille de l'historique
    if (history.length > MAX_HISTORY) {
      history.shift();
    }

    try {
      const response = await askVainy(history, isComplex);
      
      // Ajouter la réponse à l'historique
      history.push({ role: 'assistant', content: response });
      if (history.length > MAX_HISTORY) {
        history.shift();
      }

      if (response.length <= 2000) {
        await interaction.editReply(response);
      } else {
        const chunks = response.match(/[\s\S]{1,1950}/g) || [];
        await interaction.editReply(chunks[0]);
        for (let i = 1; i < chunks.length; i++) {
          await interaction.followUp(chunks[i]);
        }
      }
    } catch (err) {
      console.error('[Vainy Error]:', err);
      history.pop(); // Retirer la question si erreur pour éviter un historique corrompu
      await interaction.editReply('❌ Impossible de joindre le serveur de calcul Vainy.');
    }
  }
};

