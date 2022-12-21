const { Guild, EmbedBuilder } = require("discord.js");
const { config } = require("dotenv");
const Database = require("../Schemas/LiveData");
const axios = require("axios");
const { channel } = require("diagnostics_channel");
const { channelLink, messageLink } = require("discord.js");
const { clear } = require("console");
const { cpuUsage } = require("process");
config();

async function Live(streamer, serverData, client) {
  try {
    // Make a request to the Twitch API to get the stream information for the specified user
    let response = await axios.get(
      `https://api.twitch.tv/helix/streams?user_login=${streamer}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITCH_OAUTH}`,
          "Client-ID": process.env.TWICH_CLIENT,
        },
      }
    );

    const data = response.data;
    response = await axios.get(
      `https://api.twitch.tv/helix/users?login=${streamer}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITCH_OAUTH}`,
          "Client-ID": process.env.TWICH_CLIENT,
        },
      }
    );
    const resUser = response.data;

    // Get the data from the response

    // Check if the streamer is currently live
    if (data.data.length > 0) {
      if (serverData.LIVE === false) {
        // Streamer is live, send a message to the Discord channel
        serverData.set({ LIVE: true }) && (await serverData.save());
        const inData = data.data[0];
        let url = `${inData.thumbnail_url}`;
        url = url.replace("{width}", "1920");
        url = url.replace("{height}", "1080");
        const StreamUrl = `https://www.twitch.tv/${inData.user_name}`;

        const LiveEmbed = new EmbedBuilder()
          .setColor(0x6441a5)
          .setURL(StreamUrl)
          .setAuthor({
            name: `${inData.user_name} is now live on Twitch!`,
            iconURL: resUser.data[0].profile_image_url,
          })
          .setTitle(`${inData.title}`)
          .setDescription(`Playing ${inData.game_name}`)
          .setImage(url)
          .setTimestamp()
          .setFooter({ text: "Noti by Grid" });

        const channels = client.channels.cache.get(serverData.LiveChannel);
        channels.send({
          content: `@everyone ${StreamUrl}`,
          embeds: [LiveEmbed],
        });
        console.log(
          `${streamer} is streaming, message sent in ${
            client.guilds.cache.get(serverData.Guild).name
          } :)`
        );
      }
    } else {
      serverData.set({ LIVE: false }) && (await serverData.save());
    }
  } catch (error) {
    serverData.set({ TRACKING: false }) && (await serverData.save());
    console.error(error);
    clearInterval(Intervals[serverData.Guild]);
    console.log(`Make sure you typed the right name`);
  }
}

module.exports = { Live };
