const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { green } = require("../../../data/colors.json");

module.exports = {
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
  permissionsRequired: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.ManageMessages],

  callback: async (client, interaction) => {
    const amount = interaction.options.getInteger("amount");
    await interaction.deferReply();
    const messages = await interaction.channel.messages.fetch({ limit: amount, });

    const fooEmbed = await bulkDeleteMessages (interaction, messages, amount)
    return interaction.channel.send({ embeds: [fooEmbed] });
  },

  run: async (client, message, args) => {
    const amount = parseInt(args[0]) || 100; // Default to 100 if no amount is provided
    const messages = await message.channel.messages.fetch({ limit: amount });

    const fooEmbed = await bulkDeleteMessages (message, messages, amount)
    return message.channel.send({ embeds: [fooEmbed] });
  },
};

async function bulkDeleteMessages (interactionOrMsg, messages, amount) {
  await interactionOrMsg.channel.bulkDelete(messages, true);

  const successEmbed = new EmbedBuilder()
    .setColor(green)
    .setDescription(`<:right:1216014282957918259> Deleted ${messages.size} messages.`);
  return successEmbed;
}