const { EmbedBuilder } = require("discord.js");
const { transparent } = require("../../../data/colors.json");

module.exports = {
  name: "ping",
  description: "Check the bot ping",
  /**
   * Handles the ping command when used as a slash command.
   * @param {import('discord.js').Client} client The Discord client instance.
   * @param {import('discord.js').Interaction} interaction The interaction object representing the command usage.
   */
  callback: async (client, interaction) => {
    await interaction.deferReply();
    const reply = await interaction.fetchReply();

    const botPing = reply.createdTimestamp - interaction.createdTimestamp;
    const wsping = client.ws.ping;

    const pingEmbed = createPingEmbed(botPing, wsping);
    interaction.editReply({ embeds: [pingEmbed] });
  },

  /**
   * Handles the ping command when used as a prefix command.
   * @param {import('discord.js').Client} client The Discord client instance.
   * @param {import('discord.js').Message} message The message object representing the command usage.
   */
  run: async (client, message) => {
    const loadingMessage = await message.channel.send("Getting ping....");

    const botPing = loadingMessage.createdTimestamp - message.createdTimestamp;
    const wsping = client.ws.ping;

    loadingMessage.delete();
    const pingEmbed = createPingEmbed(botPing, wsping);
    message.channel.send({ embeds: [pingEmbed] });
  },
};

/**
 * Creates an embed displaying the bot ping and Discord API latency.
 * @param {number} botPing The latency between the bot and the Discord server.
 * @param {number} wsping The latency between the Discord client and the WebSocket server.
 * @returns {EmbedBuilder} The ping embed.
 */
function createPingEmbed(botPing, wsping) {
  return new EmbedBuilder()
    .setTitle("Pong!")
    .setDescription(
      `**Client latency**: \`${botPing}ms\`\n\n**Discord API latency **: \`${wsping}ms\``
    )
    .setColor(transparent)
    .setTimestamp();
}