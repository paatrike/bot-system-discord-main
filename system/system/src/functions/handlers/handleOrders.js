const { log } = require("console");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const { prefix } = process.env;

module.exports = (client) => {
    client.handleOrders = async () => {
        const orderFiles = fs.readdirSync("./src/orders").filter((file) => file.endsWith(".js"));
        for (const file of orderFiles) {
            const order = require(`../../orders/${file}`);
            client.orders.set(order.data.name, order);
            console.log(`Order: ${order.data.name} has loaded.`);
        }
        console.log(`Successfully reloaded prefix (${prefix}) orders.`);

        client.on("messageCreate", async (message) => {
            const { content, channel } = message;
            if (content.startsWith(prefix)) {
                const args = content.slice(prefix.length).trim().split(" ");
                const orderName = args.shift().toLowerCase();
                const order = client.orders.get(orderName);
              
                if (!order) {
                    return await message.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(0xff0000)
                                .setDescription("This command is incorrect or doesn't exist!")
                        ], ephemeral: true
                    });
                }

                try {
                    await order.execute(client, message, args);
                } catch (error) {
                    console.error(error);
                    await message.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(0xff0000)
                                .setDescription("There was an error executing that command.")
                        ], ephemeral: true
                    });
                }
            }
        });
    }
}

/**
 * Project: Management bot
 * Author: @patrick
 * this code is under the MIT license.
 * For more information, contact us at
 * https://discord.gg/sakora
 */
