const { config } = require("dotenv");
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const { Guilds, GuildMembers, GuildMessages, MessageContent } =
  GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
config();

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages, MessageContent],
  partials: [User, Message, GuildMember, ThreadMember],
});

const { LoadEvents } = require("./Handlers/eventHandler.js");

Intervals = {};
client.commands = new Collection();
client.subCommands = new Collection();
client.events = new Collection();

const { connect } = require("mongoose");
connect(process.env.DATABASEURL, {}).then(() =>
  console.log("The client is now connected to the database.")
);
//
const express = require("express");
const http = require("http");

const app = express();
const router = express.Router();

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Methods", "GET");
  next();
});

router.get("/healthz", (req, res) => {
  res.status(200).send("Ok");
});

app.use("/api/v1", router);

const server = http.createServer(app);
server.listen(3000);
//
LoadEvents(client);

client.login(process.env.BOT_TOKEN);
