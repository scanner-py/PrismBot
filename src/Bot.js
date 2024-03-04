require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const eventHandlers = require("./handlers/eventHandlers");
const { intersection } = require("lodash");
// const getAllFiles = require("./src/handlers/getAllFiles");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});


eventHandlers(client);

client.login(process.env.BOT_TOKEN);
