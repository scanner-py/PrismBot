require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const eventHandlers = require("./handlers/eventHandlers");
const handlePrefixCommands = require("./events/interactionCreate/handlePrefixCommands");
const mongoose = require("mongoose");
const { createGuildSettings } = require('./utils/createGuildSettings')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
  ],
});

client.on("messageCreate", async (message) => {
  await handlePrefixCommands(client, message);
});

client.on('guildCreate', async (guild) => {
  await createGuildSettings(guild);
});

client.on("messageCreate", async (message) => {
  const egg = message.content.toLowerCase();
  if (egg.includes("egg")) {
    await message.react("🥚");
  }
});

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB.");
    eventHandlers(client);
    client.login(process.env.BOT_TOKEN);
  } catch (error) {
    console.error("Error connecting to data base :" + error);
  }
})();
