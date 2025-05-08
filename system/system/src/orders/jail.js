const { EmbedBuilder } = require("discord.js");
const roles = require("../config/roles.json");
const channels = require("../config/channels.json");
const DB = require("../db/db.js");

module.exports = {
    data: {
        name: "unjail",
    },
    async execute(client, message, args) {
        const { guild, member, channel } = message;
        const userId = message.mentions.users.first()?.id || args[0];
        const user = await guild.members.cache.get(userId);
        const reason = args.slice(1).join(" ");
        const proof = findURLs(reason);
        const jailLogs = await guild.channels.cache.get(channels.jail_logs);

        if (!user) {
            return message.reply("Please mention a user");
        }

        if (channel.id !== channels.jail_place) {
            return message.channel.send({ content: `This command can only be used in <#${channels.jail_place}>.` });
        }

        if (!member.roles.cache.has(roles.hammer)) {
            return sendEmbed(channel, 0xff0000, "You can't use this command.");
        }

        if (!DB.checkIfJailed(user.id)) {
            return sendEmbed(channel, 0xffd966, `<@${user.id}> is not jailed.`);
        }

        const jailerId = DB.whoJailed(user.id);
        if (jailerId !== member.id && !member.roles.cache.has(roles.owners)) {
            return sendEmbed(channel, 0xffd966, `<@${user.id}> can only be freed by <@${jailerId}>.`);
        }

        const oldRoles = DB.removeFromJail(user.id);

        for (const roleId of oldRoles) {
            if (roleId) {
                try {
                    await user.roles.add(roleId);
                } catch (error) {
                    console.error("Couldn't add roles to this user.", error);
                }
            }
        }

        await user.roles.remove(roles.jailed);

        await sendEmbed(channel, 0x00ff00, `<@${user.id}> has been unjailed.`);
        await jailLogs.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(0x00ff00)
                    .setDescription(`<@${member.id}> has unjailed <@${user.id}>.`)
            ]
        });

        try {
            await user.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x00ff00)
                        .setThumbnail(user.user.displayAvatarURL())
                        .setDescription(`**<@${user.id}> 🎉 Congrats! You have been freed from jail! 🎉**`)
                        .setFooter({ text: 'To solve your problem **please contact us**' })
                        .setTimestamp()
                ]
            });
        } catch (e) {
            await message.channel.send(`<@${user.id}> has their DMs closed.`);
        }
    }
};


/**
 * Project: Management bot
 * Author: @patrick
 * this code is under the MIT license.
 * For more information, contact us at
 * https://discord.gg/sakora
 */