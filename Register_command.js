import { REST, Routes } from "discord.js";
import "dotenv/config";

const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
  {
    name: "github",
    description: "Gives github link",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

try {
  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
    body: commands,
  });

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.error(error);
}
