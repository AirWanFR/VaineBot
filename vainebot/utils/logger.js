const { EmbedBuilder } = require('discord.js');
require('dotenv').config();

module.exports.log = async (client, title, description, color = '#3498db') => {
  const logChannelId = process.env.LOG_CHANNEL_ID;
  const channel = await client.channels.fetch(logChannelId).catch(() => null);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setTimestamp();

  await channel.send({ embeds: [embed] });
};
