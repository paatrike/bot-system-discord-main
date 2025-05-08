const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");

const fs = require("fs");

module.exports = (client) => {
  client.handleCommands = async () => {
    const commandFolders = fs.readdirSync("./src/commands");
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));

      const { commands, commandArray } = client;
      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        commands.set(command.data.name, command);
        commandArray.push(command.data.toJSON());
        console.log(`Command: ${command.data.name} has loaded.`);
      }
    }

    const clientId = process.env.clientId;
    const guildId = process.env.guildId;
    const rest = new REST({ version: "10" }).setToken(process.env.token);
    try {
      console.log(
        `Started refreshing application (/) commands.`,
      );

      // The put method is used to fully refresh all commands in the guild with the current set
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: client.commandArray },
      );

      console.log(
        `Successfully reloaded application (/) commands.`,
      );
    } catch (error) {
      // And of course, make sure you catch and log any errors!
      console.error(error);
    }
  };
};


/**
 * Project: Management bot
 * Author: @patrick
 * this code is under the MIT license.
 * For more information, contact us at
 * https://discord.gg/sakora
 */
