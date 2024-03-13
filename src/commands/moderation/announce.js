const { EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const { transparent, green } = require("../../../data/colors.json");

module.exports = {
  name: "announce",
  description: "Send an announcement using bot.",
  options: [
    {
      name: "channel",
      description: "Channel you want to send announcement in.",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "message",
      description: "Message you want to send.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.SendMessagesInThreads, PermissionFlagsBits.MentionEveryone],

  callback: async (client, interaction) => {
    const channelId = interaction.options.get('channel').value;
    const messageValue = interaction.options.get('message').value;
    handleAnnouncement(client, channelId, messageValue, interaction)

    const embed = new EmbedBuilder()
      .setColor(green)
      .setTitle('success')
      .setDescription('<:right:1216014282957918259> Announcement sent')

    interaction.reply({ embeds: [embed], ephemeral: true, })
  },

  run: async (client, message, args) => {
    const mentionedChannel = message.mentions.channels.first();
    const messageValue = args.slice(1).join(" ");
    mentionedChannel && messageValue ? handleAnnouncement(client, mentionedChannel.id, messageValue, message) : message.channel.send('Please provide a valid channel and message to make announcement').then(deleteResponse)

  }
}

function handleAnnouncement(client, channelId, message, interactionOrMsg) {
  try {
    const channel = client.channels.cache.get(channelId)
    const embed = new EmbedBuilder()
      .setColor('#808080')
      .setDescription(message)
      .setTimestamp()
    channel.send({ embeds: [embed] })
  } catch (error) {
    interactionOrMsg.channel.send('An error occurred')
  }
}

function deleteResponse(message) {
  setTimeout(() => message.delete(), 5000); // Delete the message after 5 seconds
}