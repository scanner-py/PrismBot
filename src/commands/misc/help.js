const { EmbedBuilder } = require("discord.js");
const { transparent } = require("../../../data/colors.json");

module.exports = {
  name: "help",
  description: "Get help with the bot commands",
  deleted: false,

  callback: (client, interaction) => {
    const helpEmbed = createHelpEmbed();
    return interaction.reply({ embeds: [helpEmbed], ephemeral: true });
  },

  run: async (client, message) => {
    const helpEmbed = createHelpEmbed();

    try {
      await message.author.send({ embeds: [helpEmbed] });
      await message.channel.send("I have sent you a direct message.").then(deleteResponse) // Delete the response after a delay
    } catch (error) {
      console.error("Failed to send direct message:", error);
      await message.channel.send("I was unable to send you a direct message.");
    }
  },
};

function createHelpEmbed() {
  return new EmbedBuilder()
    .setDescription(
      `<:No:1215704504180146277> Sorry, but I cannot help you right now.`
    )
    .setColor(transparent);
}

function deleteResponse(message) {
  setTimeout(() => message.delete(), 6000); // Delete the message after 6 seconds
}