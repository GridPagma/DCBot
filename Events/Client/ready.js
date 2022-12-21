const { loadCommands } = require("../../Handlers/commandHandler");
const Database = require("../../Schemas/LiveData");
const mongoose = require("mongoose");
const { Live } = require("../../Functions/live");

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log("The client is ready");

    loadCommands(client);

    const server = mongoose.model("LiveData");

    server
      .find({ TRACKING: true })
      .sort("Guild")
      .limit(5)
      .exec((err, servers) => {
        if (err) {
          console.error(err);
        } else {
          servers.forEach((server) => {
            console.log(
              `Restarted Tracker for ${
                client.guilds.cache.get(server.Guild).name
              }`
            );
            Live(server.Streamer, server, client);
            Intervals[server.Guild] = setInterval(function () {
              Live(server.Streamer, server, client);
            }, 1000 * 60 * 1);
          });
        }
      });
  },
};
