const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const Database = require("../../Schemas/LiveData");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Stop tracking")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false),

  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   * @param { Client } client
   *
   */
  async execute(interaction, client) {
    const { guild, member } = interaction;
    let serverData = await Database.findOne({ Guild: guild.id });

    if (!serverData)
      return interaction.reply({
        content: "You haven't even set up your server yet!",
        ephemeral: true,
      });

    serverData.set({ TRACKING: false }) && (await serverData.save());
    clearInterval(Intervals[serverData.Guild]);
    console.log(
      `Tracking for ${
        client.guilds.cache.get(serverData.Guild).name
      } has been cancelled by ${member.user.tag}`
    );
    return interaction.reply({
      content: `You have canceled tracking for ${serverData.Streamer}.`,
      ephemeral: true,
    });
  },
};
