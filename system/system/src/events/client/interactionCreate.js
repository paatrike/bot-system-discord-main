const { InteractionType } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const { commands } = client;
      const { commandName } = interaction;

      const command = commands.get(commandName);
      if (!command) return;

      try {
        await interaction.deferReply();
        await command.execute(interaction, client);
      } catch (error) {
        console.log(error);
      }
    }
    else if (interaction.isButton()) {
      const { buttons } = client;
      const { customId } = interaction;
      const button = buttons.get(customId);
      if (!button) return new Error("There is no code for this button.");
      try {
        await button.execute(interaction, client);
      } catch (err) {
        console.error(err);
      }
    }
    else if (interaction.isStringSelectMenu()) {
      const { selectMenus } = client;
      const { customId } = interaction;
      const menu = selectMenus.get(customId);
      if (!menu) return new Error("There is no code for this select menu.");

      try {
        await interaction.deferReply({ephemeral:true});
        await menu.execute(interaction, client);
      } catch (error) {
        console.error(error);
      }
    }
    else if (interaction.type == InteractionType.ModalSubmit) {
      const { modals } = client;
      const { customId } = interaction;
      const modal = modals.get(customId);
      if (!modal) return new Error("There is no code for this modal.");

      try {
        await modal.execute(interaction, client);
      }
      catch (e) {
        console.error(e);
      }
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