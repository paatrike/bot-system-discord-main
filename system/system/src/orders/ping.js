const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
} = require("discord.js");
const ms = require('ms');

module.exports = {
  data: {
      name: "ping",
  },
  async execute(client, message, args) {
      const totalSeconds = client.uptime / 1000;
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = Math.floor(totalSeconds % 60);

      const uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
      const apiLatency = Math.round(client.ws.ping);
      const lastHeartbeat = ms(Date.now() - client.ws.shards.first().lastPingTimestamp, { long: true });

      const pingEmbed = new EmbedBuilder()
          .setTitle('API Latency')
          .setColor("#0cf317")
          .setDescription(`**API Latency:** ${apiLatency} ms 🛰️\n**Last Heartbeat Calculated Ago:** ${lastHeartbeat}\n**Uptime:** ${uptime}`);

      const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
              .setStyle('Success')
              .setLabel(`Ping: ${apiLatency}ms`)
              .setCustomId('pingButton')
              .setDisabled(true)
      );

      return message.channel.send({ embeds: [pingEmbed], components: [row] });
  }
};



/**
 * Project: Management bot
 * Author: @patrick
 * this code is under the MIT license.
 * For more information, contact us at
 * https://discord.gg/sakora
 */