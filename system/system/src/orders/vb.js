const {
    EmbedBuilder,
} = require("discord.js");
const roles = require("../config/roles.json");
const channels = require("../config/channles.json");
const links = require("../config/links.json");
const name = require("../config/names.json");
const color = require("../config/colors.json");

module.exports = {
    data: {
        name: "vb",
    },
    async execute(client, message, args) {
        try {
            const embedNoPermission = new EmbedBuilder()
                .setColor(color.red)
                .setDescription("You don't have permission to execute that command.")
                .setTimestamp()
                .setFooter({ text: `${name.nameserver} Verification`, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 1024 }) });

            if (!message.member.roles.cache.has(roles.verification_staff)) {
                return message.reply({ embeds: [embedNoPermission] });
            }

            const userId = message.content.slice(3).trim();
            let member;
            if (message.mentions.members.first()) {
                member = message.mentions.members.first();
            } else if (userId) {
                member = await message.guild.members.fetch(userId).catch(() => { });
            }

            const embedInvalidUsage = new EmbedBuilder()
                .setTitle(`${name.nameserver} Verification`)
                .setDescription("Invalid usage. You should mention a user.")
                .setColor(color.red)
                .setTimestamp()
                .setFooter({ text: `${name.nameserver} Verification`, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 1024 }) });

            if (!member) {
                return message.reply({ embeds: [embedInvalidUsage] });
            }

            const embedAlreadyVerified = new EmbedBuilder()
                .setTitle(`${name.nameserver} Verification`)
                .setDescription("This user is already verified.")
                .setColor(color.red)
                .setTimestamp()
                .setFooter({ text: `${name.nameserver} Verification`, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 1024 }) });

            if (member.roles.cache.has(roles.verified) || member.roles.cache.has(roles.verified_male)) {
                return message.reply({ embeds: [embedAlreadyVerified] });
            }

            await member.roles.add(roles.verified).catch(console.error);
            await member.roles.add(roles.verified_male).catch(console.error);
            await member.roles.remove(roles.unverified).catch(console.error);

            const embedVerified = new EmbedBuilder()
                .setTitle(`New Verified User`)
                .setDescription(`<@${member.user.id}> has been verified.`)
                .setColor(color.green)
                .setTimestamp()
                .setFooter({ text: `${name.nameserver} Verification | Command By ${message.author.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 1024 }) });

            await message.reply({ embeds: [embedVerified] });

            const joinTimestamp = Math.floor(member.joinedTimestamp / 1000);
            const verifyTimestamp = Math.floor(message.createdTimestamp / 1000);
            const logChannel = client.channels.cache.get(channels.verify_logs);

            const embedLog = new EmbedBuilder()
                .setTitle(`${name.nameserver} Logs`)
                .setColor(color.green)
                .setTimestamp()
                .addFields(
                    { name: "Verified Male:", value: `<@${member.user.id}>` },
                    { name: "Verified By:", value: `<@${message.author.id}>` },
                    { name: "Joined Server:", value: `<t:${joinTimestamp}:R>` },
                    { name: "Verified Since:", value: `<t:${verifyTimestamp}:R>` }
                )
                .setThumbnail(member.displayAvatarURL({ dynamic: true }));

            await logChannel.send({ embeds: [embedLog] });

            const embedDM = new EmbedBuilder()
                .setTitle(`Welcome to ${name.nameserver}`)
                .setDescription(`You have successfully verified in ${message.guild.name} by <@${message.author.id}>. Enjoy your stay.\nPlease take a moment to read our rules in <#${channels.Rules}>.`)
                .setColor(color.green)
                .setImage(links.welcomeImage)
                .setTimestamp()
                .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: `${name.nameserver} Server`, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 1024 }) });

            await member.send({ embeds: [embedDM] }).catch(() => {
                message.channel.send(`<@${member.user.id}> has their DMs closed.`);
            });
        } catch (err) {
            console.error(err);
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