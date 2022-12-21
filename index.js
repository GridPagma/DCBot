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

LoadEvents(client);

client.login(process.env.BOT_TOKEN);
