const { EmbedBuilder } = require("discord.js");

const createEmbed = () => {
  return new EmbedBuilder()
    .setColor("#f1c40f")
    .setDescription("Default Description");
};

module.exports = { createEmbed };
