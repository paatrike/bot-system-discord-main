const fs = require("fs");

module.exports = (client) => {
  client.handleEvents = async () => {
    const eventFolders = fs.readdirSync("./src/events");
    for (const folder of eventFolders) {
      const eventFiles = fs
        .readdirSync(`./src/events/${folder}`)
        .filter((file) => file.endsWith(".js"));
      switch (folder) {
        case "client":
          for (const file of eventFiles) {
            const event = require(`../../events/${folder}/${file}`);
            if (event.once) {
              client.once(event.name, (...args) =>
                event.execute(...args, client));
            } else {client.on(event.name, (...args) =>
                event.execute(...args, client));}
          }
          break;

        default:
          break;
      }
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
