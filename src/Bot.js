require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const eventHandlers = require("./handlers/eventHandlers");
const handlePrefixCommands = require("./events/interactionCreate/handlePrefixCommands");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});

client.on("messageCreate", (message) => {
  handlePrefixCommands(client, message);
});

client.on("messageCreate", (message) => {
  const egg = message.content.toLowerCase();
  if (egg.includes('egg')) {
    message.react("🥚");
  }
});

eventHandlers(client);

client.login(process.env.BOT_TOKEN);
