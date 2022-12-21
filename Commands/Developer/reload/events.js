const { ChatInputCommandInteraction } = require("discord.js");
const { LoadEvents } = require("../../../Handlers/eventHandler");

module.exports = {
  subCommand: "reload.events",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {
    for (const [key, value] of client.events)
      client.removeListener(`${key}`, value, true);
    LoadEvents(client);
    interaction.reply({
      content: "Reloaded Events",
      ephemeral: true,
    });
  },
};
