const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  name: 'status',
  description: 'Analyse l\'état opérationnel de vainerac.fr',
  async execute(ctx, args, client) {
    const url = 'https://vainerac.fr';
    
    // Message d'attente pour le côté "analyse en cours"
    const processingEmbed = new EmbedBuilder()
      .setColor('#FFA500')
      .setDescription('📡 **Vainy :** Analyse du serveur web en cours...');
    
    const msg = ctx.reply 
      ? await ctx.reply({ embeds: [processingEmbed], fetchReply: true }) 
      : await ctx.channel.send({ embeds: [processingEmbed] });

    const startTime = Date.now();

    try {
      const response = await axios.get(url, { timeout: 5000 });
      const responseTime = Date.now() - startTime;

      const successEmbed = new EmbedBuilder()
        .setColor('#00fbff')
        .setTitle('🌐 État de Vainerac.fr')
        .setThumbnail(client.user.displayAvatarURL())
        .addFields(
          { name: '🔌 Connexion', value: '🟢 **OPÉRATIONNELLE**', inline: true },
          { name: '⚡ Latence Web', value: `\`${responseTime}ms\``, inline: true },
          { name: '📄 Code HTTP', value: `\`${response.status} OK\``, inline: true }
        )
        .setFooter({ text: 'Vainy Monitoring System' })
        .setTimestamp();

      if (ctx.editReply) await ctx.editReply({ embeds: [successEmbed] });
      else await msg.edit({ embeds: [successEmbed] });

    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('⚠️ ALERTE SYSTÈME')
        .setDescription(`**Vainy** ne parvient pas à joindre **vainerac.fr**.`)
        .addFields(
          { name: 'Erreur détectée', value: `\`${error.message}\`` }
        )
        .setFooter({ text: 'Vainy Emergency Protocol' })
        .setTimestamp();

      if (ctx.editReply) await ctx.editReply({ embeds: [errorEmbed] });
      else await msg.edit({ embeds: [errorEmbed] });
    }
  }
};