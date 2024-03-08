const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const checkUserPermissions = require("../../utils/checkUserPermissions");
const checkUserPermissionsPrefixCmd = require("../../utils/checkUserPermissionsPrefixCmd");

module.exports = {
  callback: async (client, interaction) => {
    const mentionable = interaction.options.get("user").value; // target user
    const reason =
      interaction.options.get("reason")?.value || "No reason provided"; // reason
    // check if user is trying to kick himself
    if (mentionable === interaction.user.id) {
      const embed = new EmbedBuilder()
        .setDescription(`:x: You cannot kick yourself.`)
        .setColor("#ff1e45");
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const targetUser = await checkUserPermissions(interaction, mentionable);
    if (!targetUser) return;

    try {
      // Send a DM to the kicked user
      const dmEmbed = new EmbedBuilder()
        .setDescription(
          `You have been kicked from **${interaction.guild.name}** by **${interaction.user.username}**. \nReason: ${reason}`
        )
        .setColor("#2ecc71");
      await targetUser.send({ embeds: [dmEmbed] }).catch((error) => {
        console.error(
          `Failed to send DM to ${targetUser.user.username}: ${error}`
        );
      });

      await targetUser.kick(reason);
      const embed = new EmbedBuilder()
        .setDescription(
          `:white_check_mark: ${targetUser} was kicked. | ${reason}`
        )
        .setColor("#2ecc71");
      await interaction.reply({ embeds: [embed] });
      return;
    } catch (error) {
      console.log(error);
    }
  },

  run: async (client, message, args) => {
    const deleteRespond = (msg) => {
      setTimeout(() => msg.delete(), 5000); // delete the reply after 5 sce
    };

    const mentionedUser = message.mentions.members.first();
    const reason = args.slice(1).join(" ") || "No reason provided";

    const targetUser = await checkUserPermissionsPrefixCmd(
      message,
      mentionedUser
    );

    if (mentionedUser.id === message.author.id) {
      const embed = new EmbedBuilder()
        .setDescription(`:x: You cannot kick yourself.`)
        .setColor("#ff1e45");
      return message.channel.send({ embeds: [embed] }).then(deleteRespond);
    }

    if (!targetUser) return;
    try {
      const dmEmbed = new EmbedBuilder()
        .setDescription(
          `You have been kicked from **${message.guild.name}** by **${message.author.username}**. \nReason: ${reason}`
        )
        .setColor("#ff1e45");
      await mentionedUser.send({ embeds: [dmEmbed] }).catch((error) => {
        console.error(
          `Failed to send DM to ${mentionedUser.user.username}: ${error}`
        );
      });

      await targetUser.kick(reason);
      const embed = new EmbedBuilder()
        .setDescription(
          `:white_check_mark: ${targetUser} was kicked. | ${reason}`
        )
        .setColor("#2ecc71");
      await message.channel.send({ embeds: [embed] });
      return;
    } catch (error) {
      console.log(error);
    }
  },
  name: "kick",
  description: "kick a user.",
  options: [
    {
      name: "user",
      description: "User you want to kick.",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "reason",
      description: "Reason for the kick.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.KickMembers],
  botPermissions: [PermissionFlagsBits.KickMembers],
};
