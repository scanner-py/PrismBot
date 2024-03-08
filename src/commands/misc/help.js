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
    return interaction.reply({ embeds: [embed], ephemeral: true })
  },
  run: async (client, message, args) => {
    const deleteRespond = (msg) => {
      setTimeout(() => msg.delete(), 6000); // delete the reply after 5 sce
    };
    const embed = new EmbedBuilder()
      .setDescription(`:x: Sorry, but I cannot help you right now.`)
      .setColor("#ff1e45");
      try {
        await message.author.send({ embeds: [embed] });
        await message.channel.send('I have sent you a direct message.').then(deleteRespond);
      } catch (error) {
        console.error('Failed to send direct message:', error);
        await message.channel.send('I was unable to send you a direct message.');
      }
  },
};
