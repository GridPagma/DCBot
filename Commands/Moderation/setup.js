const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const Database = require("../../Schemas/LiveData");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup your server for notifcations")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addChannelOption((options) =>
      options
        .setName("notifications")
        .setDescription("Set the channel for notifications")
        .setRequired(true)
    )
    .addChannelOption((options) =>
      options
        .setName("log")
        .setDescription("Set the channel for bot logs")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    const { options, guild } = interaction;

    const noti = options.getChannel("notifications");
    const log = options.getChannel("log");

    let userData = await Database.findOne({ Guild: guild.id });
    if (!userData)
      userData = await Database.create({
        Guild: guild.id,
        LogChannel: log.id,
        LiveChannel: noti.id,
        LIVE: false,
        TRACKING: false,
        Streamer: "TimelessOW",
      });
    else {
      userData.set({ LogChannel: log.id }) &&
        userData.set({ LiveChannel: noti.id }) &&
        (await userData.save());
    }

    const successEmbed = new EmbedBuilder()
      .setAuthor({ name: "Setup", iconURL: guild.iconURL() })
      .setColor("Gold")
      .setDescription(
        `You have set ${log.name} as the log channel and are now sending notifications to ${noti.name}!`
      );

    return interaction.reply({ embeds: [successEmbed], ephemeral: true });
  },
};
