const {
  Collection,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder
} = require("discord.js");
const DB = require("../../db/db.js");
const roles = require("../../config/roles.json");
const channels = require("../../config/channels.json");
const links = require("../../config/links.json");

module.exports = {
  name: "guildMemberAdd",
  async execute(member, client) {
    const { guild } = member;
    const accountAge = (Date.now() - member.user.createdAt) / (1000 * 60 * 60 * 24);

    const verificationChannel = await guild.channels.cache.get(channels.verification_chat);

    async function handleJailedMember() {
      if (member.roles.cache.has(roles.booster)) {
        await member.roles.set([roles.booster]);
        await member.roles.add(roles.jailed);
      } else {
        await member.roles.set([]);
        await member.roles.add(roles.jailed);
      }
    }

    async function sendJailNotification(reason) {
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle(client.user.username)
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .setDescription(`**🚨 <@${member.id}> you got jailed.**`)
        .addFields({ name: "🚨 Reason:", value: reason })
        .setFooter({ text: "To solve your problem **please contact us**" })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setStyle("Link")
          .setLabel("Contact Us")
          .setURL(links.serverInvite)
      );

      try {
        await member.send({ embeds: [embed], components: [row] });
      } catch (error) {
        console.error(error);
      }

      const logChannel = await guild.channels.cache.get(channels.jail_logs);
      await logChannel.send({
        content: `**<@${member.id}> Has Been Detected by Our Anti-Tokens System.**`
      });
    }

    async function handleNewAccount() {
      await handleJailedMember();
      DB.addToJail(member.id, client.user.id, "New to Discord", null, [roles.unverified], Date.now());
      await sendJailNotification("Your account has been detected by our system. Click to go to the jail room and your problem will be solved.");
    }

    if (DB.checkIfJailed(member.id)) {
      await handleJailedMember();
    } else if (accountAge < 120) {
      await handleNewAccount();
    } else {
      await member.roles.add(roles.unverified);
    }
  },
};




/**
 * Project: Management bot
 * Author: @patrick
 * this code is under the MIT license.
 * For more information, contact us at
 * https://discord.gg/sakora
 */