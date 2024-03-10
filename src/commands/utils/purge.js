const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { green } = require("../../../data/colors.json");

module.exports = {
  callback: async (client, interaction) => {
    const amount = interaction.options.getInteger("amount");
    await interaction.deferReply();

    const messages = await interaction.channel.messages.fetch({
      limit: amount,
    });
    await interaction.channel.bulkDelete(messages, true);

    const successEmbed = new EmbedBuilder()
      .setColor(green)
      .setDescription(`Deleted ${messages.size} messages.`);

    return interaction.channel.send({ embeds: [successEmbed] });
  },
  name: "purge",
  description: "Delete messages in bulk limit 100",
  options: [
    {
      name: "amount",
      description: "Number of messages to delete",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],

  run: async (client, message, args) => {
    const amount = parseInt(args[0]) || 100; // Default to 100 if no amount is provided

    const messages = await message.channel.messages.fetch({ limit: amount });

    await message.channel.bulkDelete(messages, true);

    const successEmbed = new EmbedBuilder()
      .setColor(green)
      .setDescription(`Deleted ${messages.size} messages.`);

    return message.channel.send({ embeds: [successEmbed] });
  },
  permissionsRequired: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.ManageMessages],
};
