const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const Database = require("../../Schemas/LiveData");
const { checkUsernameExists } = require("../../Functions/userexist");
const { Live } = require("../../Functions/live");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("track")
    .setDescription("Set notifications for a streamer")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addStringOption((options) =>
      options
        .setName("streamer")
        .setDescription("Set the streamers twitch username")
    ),
  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   * @param { Client } client
   */
  async execute(interaction, client) {
    const { options, guild } = interaction;

    const streamer = options.getString("streamer");

    let serverData = await Database.findOne({ Guild: guild.id });
    if (!serverData)
      return interaction.reply({
        content: `${streamer} was not found on twitch, please try again`,
        ephemeral: true,
      });
    const channel = client.channels.cache.get(serverData.LiveChannel);
    const found = await checkUsernameExists(streamer);
    if (!found)
      return interaction.reply({
        embeds: [errorsEmbed.setDescription("Could not find streamer")],
        ephemeral: true,
      });

    if (serverData.Streamer !== streamer || serverData.TRACKING === false) {
      serverData.set({ LIVE: false }) &&
        serverData.set({ Streamer: streamer }) &&
        (await serverData.save());
      try {
        if (typeof Intervals[guild.id] !== "undefined") {
          clearInterval(Intervals[guild.id]);
        }
        console.log(`Streamer set to ${streamer} in ${guild.name}`);
        serverData.set({ TRACKING: true }) && (await serverData.save());
        Live(streamer, serverData, client);
        Intervals[guild.id] = setInterval(function () {
          Live(streamer, serverData, client);
        }, 1000 * 60 * 1);
        interaction.reply({
          content: `Now sending notifications for ${streamer} in ${channel.name}`,
          ephemeral: true,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      interaction.reply({
        content: `Already sending notifications for ${streamer} in ${channel.name}`,
        ephemeral: true,
      });
    }
  },
};
