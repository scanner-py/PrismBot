const { EmbedBuilder } = require("discord.js");
const os = require("os");

module.exports = {
  name: "ping",
  description: "Check the bot ping",

  callback: async (client, interaction) => {
    await interaction.deferReply();
    const reply = await interaction.fetchReply();

    const botPing = reply.createdTimestamp - interaction.createdTimestamp;
    const wsping = client.ws.ping;

    const embed = new EmbedBuilder()
      .setTitle("Pong!")
      .setDescription(
        `**Client latency**: \`${botPing}ms\`\n\n**Discord API latency **: \`${wsping}ms\``
      )
      .setColor("f1c40f")

      .setTimestamp();

    interaction.editReply({ embeds: [embed] });
  },
};
