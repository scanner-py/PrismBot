const { EmbedBuilder, version } = require("discord.js");
const os = require("os");
const { createEmbed } = require("../../utils/templates/butterEmbed");

module.exports = {
  name: "ping",
  description: "Check the bot's ping",

  callback: async (client, interaction) => {
    await interaction.deferReply();
    const reply = await interaction.fetchReply();

    const botPing = reply.createdTimestamp - interaction.createdTimestamp;
    const wsping = client.ws.ping;

    const embed = createEmbed()
      .setTitle("Pong!")
      .setDescription(
        `**Client latency**: \`${botPing}ms\`\n\n**Discord API latency **: \`${wsping}ms\``
      )
      .setColor("f1c40f")

      .setTimestamp();

    interaction.editReply({ embeds: [embed] });
  },
};
