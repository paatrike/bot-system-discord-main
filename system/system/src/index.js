require("dotenv").config();
const { Client, GatewayIntentBits, Partials, Collection, ActivityType } = require("discord.js");
const fs = require("fs");

const token = process.env.TOKEN;

const client = new Client({
  intents: Object.values(GatewayIntentBits),
  partials: Object.values(Partials),
  presence: {
    activities: [
      {
        name: "something goes here",
        type: ActivityType.Custom, // Using ActivityType enum for better readability
        state: "By patrick || By patrick",
      },
    ],
  },
});

client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.commandArray = [];
client.orders = new Collection();
client.voiceManager = new Collection();

const functionFolders = fs.readdirSync("./src/functions");
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles) {
    require(`./functions/${folder}/${file}`)(client);
  }
}

client.handleEvents();
client.handleCommands();
client.handleComponents();
client.handleOrders();

client.login(token);
