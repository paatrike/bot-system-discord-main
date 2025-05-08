const { EmbedBuilder } = require("discord.js");
const DB = require("../db/db.js");
const roles = require("../config/roles.json");

module.exports = {
    data: {
        name: "info",
    },
    async execute(client, message, args) {
        const { guild, member, channel } = message;
        const userId = message.mentions.users.first()?.id || args[0];
        
        if (!userId) {
            return message.reply("Please mention a user or provide a valid user ID.");
        }

        const user = await guild.members.fetch(userId).catch(() => null);
        if (!user) {
            return message.reply("Unknown User!");
        }

        const formatRoles = (roleIds) => {
            return roleIds
                .filter(id => id)
                .map(id => `<@&${id}>`)
                .join("\n") || 'None';
        };

        if (!member.roles.cache.has(roles.hammer)) {
            return channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xff0000)
                        .setDescription("You do not have permission to use this command.")
                ]
            });
        }

        if (DB.checkIfJailed(user.id)) {
            const userInfo = DB.getInfoJail(user.id);

            return channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setThumbnail(user.user.displayAvatarURL())
                        .setDescription(`**<@${userInfo.userId}> was jailed by <@${userInfo.memberId}>**`)
                        .addFields(
                            { name: 'Roles:', value: formatRoles(userInfo.roles) },
                            { name: 'Reason:', value: userInfo.reason },
                            { name: 'At:', value: new Date(userInfo.timeStamp).toString() }
                        )
                        .setTimestamp()
                ]
            });
        } else {
            return channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xffd966)
                        .setDescription(`<@${user.id}> is not in jail!`)
                ]
            });
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