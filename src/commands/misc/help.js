const { EmbedBuilder } = require("discord.js");
module.exports = {
  // options: [{}],
  // deleted: false,
  // devOnly: false,
  // testOnly: true,
  name: "help",
  description: "need help?",

  callback: (client, interaction) => {
    const embed = new EmbedBuilder()
      .setDescription(`:x: Sorry, but I cannot help you right now.`)
      .setColor("#ff1e45");
    return interaction.reply({ embeds: [embed] })
  },
  run: (client, message, args) => {
    const embed = new EmbedBuilder()
      .setDescription(`:x: Sorry, but I cannot help you right now.`)
      .setColor("#ff1e45");
    return message.channel.send({ embeds: [embed] })
  },
};
