const { EmbedBuilder } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const roles = require("../config/roles.json");

module.exports = {
    data: {
        name: "join",
    },
    async execute(client, message, args) {

        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`You need to be in a voice channel to use this command.`)
                        .setColor("#0cf317")
                ]
            });
        }

        try {
            joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`Joined voice channel <#${voiceChannel.id}>`)
                        .setColor("#0cf317")
                ]
            });
        } catch (error) {
            console.error(error);
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription('There was an error joining the voice channel.')
                        .setColor("#ff0000")
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
