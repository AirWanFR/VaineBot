const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'ets2',
  description: 'Affiche le statut en direct de ma session Euro Truck Simulator 2',
  async execute(interactionOrMessage) {
    const isInteraction = typeof interactionOrMessage.isCommand === 'function';

    // On vérifie si les données existent et si elles sont récentes (moins de 2 minutes)
    if (!global.ets2Data || (Date.now() - global.ets2Data.lastUpdate) > 120000) {
      const msg = '🚚 **Je ne suis pas en train de jouer à ETS2 actuellement.** (Ou la télémétrie est éteinte).';
      return isInteraction ? interactionOrMessage.reply(msg) : interactionOrMessage.reply(msg);
    }

    const data = global.ets2Data;

    // Création de l'Embed
    const embed = new EmbedBuilder()
      .setColor('#38bdf8')
      .setTitle('🚚 En direct d\'Euro Truck Simulator 2')
      .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/4/4b/Euro_Truck_Simulator_2_logo.png');

    // Informations du Camion
    let truckInfo = `**Modèle :** ${data.truck.brand} ${data.truck.model}\n`;
    truckInfo += `**Vitesse :** ${data.truck.speed} km/h (Limite: ${data.truck.speedLimit > 0 ? data.truck.speedLimit : '--'} km/h)\n`;
    truckInfo += `**Carburant :** ${data.truck.fuel}%\n`;
    truckInfo += `**Dégâts Camion :** ${data.truck.damage}%`;
    
    if (data.trailer) {
      truckInfo += `\n**Dégâts Remorque :** ${data.trailer.damage}%`;
    }

    embed.addFields({ name: '🚛 Véhicule', value: truckInfo, inline: false });

    // Informations du Trajet (si en mission)
    if (data.job) {
      const jobInfo = `**Mission :** ${data.job.cargo}\n` +
                      `**Trajet :** ${data.job.sourceCity} ➔ ${data.job.destinationCity}\n` +
                      `**Distance :** ${data.navigation.distance} km restants\n` +
                      `**Temps estimé :** ${data.navigation.timeText}\n` +
                      `**Revenus :** ${new Intl.NumberFormat('fr-FR').format(data.job.income)} €`;
      embed.addFields({ name: '📦 Livraison en cours', value: jobInfo, inline: false });
    } else {
      embed.addFields({ name: '📦 Livraison', value: 'En balade libre', inline: false });
    }

    embed.setFooter({ text: 'Télémétrie en direct via VaineBot' })
         .setTimestamp(new Date(data.lastUpdate));

    if (isInteraction) {
      await interactionOrMessage.reply({ embeds: [embed] });
    } else {
      await interactionOrMessage.reply({ embeds: [embed] });
    }
  }
};
