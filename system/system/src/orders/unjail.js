const { EmbedBuilder } = require("discord.js");
const roles = require("../config/roles.json");
const channels = require("../config/channels.json");
const DB = require("../db/db.js");

module.exports = {
    data: {
        name: "unjail",
        async execute(client, message, args) {
            const { guild, member, channel } = message;
            const userId = message.mentions.users.first()?.id || args[0];
            const user = await guild.members.cache.get(userId);
            const reason = args.slice(1).join(" ");
            const proof = findURLs(reason) || null;
            const jail_logs = await guild.channels.cache.get(channels.jail_logs);

            if (!user) return message.reply("Please mention a user");

            if (channel.id !== channels.jail_place) {
                return message.channel.send(`This command can only be used in <#${channels.jail_place}>.`);
            }

            if (!member.roles.cache.has(roles.hammer)) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xff0000)
                            .setDescription("You can't use this command.")
                    ]
                });
            }

            if (!DB.checkIfJailed(user.id)) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xffd966)
                            .setDescription(`<@${user.id}> is already freed!`)
                    ]
                });
            }

            let theWho = DB.whoJailed(user.id);

            if (theWho !== member.id && !member.roles.cache.has(roles.owners)) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xffd966)
                            .setDescription(`<@${user.id}> can only be freed by <@${theWho}>`)
                    ]
                });
            }

            let old_roles = DB.removeFromJail(user.id);
            for (let role of old_roles) {
                if (role) {
                    try {
                        await user.roles.add(role);
                    } catch (error) {
                        console.error(`Couldn't add role ${role} to user ${user.id}: ${error}`);
                    }
                }
            }

            await user.roles.remove(roles.jailed);

            await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x00ff00)
                        .setDescription(`<@${user.id}> has been unjailed.`)
                ]
            });

            await jail_logs.send({
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
                            .setThumbnail(user.displayAvatarURL())
                            .setDescription(`**<@${user.id}> Congrats! You have been freed from jail!**`)
                            .setFooter({ text: 'To solve your problem, please contact us.' })
                            .setTimestamp()
                    ]
                });
            } catch (e) {
                await message.channel.send(`<@${user.id}> has their DMs closed.`);
            }
        }
    }
};

/**
 * Project: Management bot
 * Author: @patrick
 * This code is under the MIT license.
 * For more information, contact us at
 * https://discord.gg/sakora
 */
