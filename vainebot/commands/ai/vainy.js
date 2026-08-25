const { SlashCommandBuilder } = require('discord.js');
const { askVainy } = require('../../services/aiService');



module.exports = {
  data: new SlashCommandBuilder()
    .setName('vainy')
    .setDescription('Parler avec Vainy')
    .addStringOption(opt =>
      opt.setName('message')
        .setDescription('Ton message ou ta consigne')
        .setRequired(true)
    )
    .addBooleanOption(opt =>
      opt.setName('complexe')
        .setDescription('Activer le modèle lourd pour raisonnement')
        .setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const prompt = interaction.options.getString('message');
    const isComplex = interaction.options.getBoolean('complexe') || false;

    try {
      const response = await askVainy([{ role: 'user', content: prompt }], isComplex);

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
      await interaction.editReply('❌ Impossible de joindre le serveur de calcul Vainy.');
    }
  }
};

