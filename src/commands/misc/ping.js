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

  run: async (client, message, args) => {
    message.channel.send("Loading data....").then(async (msg) => {
      msg.delete();
      const embed = new EmbedBuilder()
        .setTitle("Pong!")
        .setDescription(
          `**Client latency**: \`${
            msg.createdTimestamp - message.createdTimestamp
          }ms\`\n\n**Discord API latency**: \`${client.ws.ping}ms\``
        )
        .setColor("f1c40f")
        .setTimestamp();
      message.channel.send({ embeds: [embed] });
    });
  },
};
