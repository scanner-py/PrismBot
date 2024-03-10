const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { red, green } = require("../../../data/colors.json");
const checkUserPermissions = require("../../utils/checkUserPermissions");
const checkUserPermissionsPrefixCmd = require("../../utils/checkUserPermissionsPrefixCmd");

module.exports = {
  callback: async (client, interaction) => {
    const mentionable = interaction.options.get("user").value;
    const reason =
      interaction.options.get("reason")?.value || "No reason provided";

    const targetUser = await checkUserPermissions(interaction, mentionable);
    if (!targetUser) return;

    try {
      // Send a DM to the kicked user
      const dmEmbed = new EmbedBuilder()
        .setDescription(
          `You have been banned from **${interaction.guild.name}** by **${interaction.user.username}**. | ${reason}`
        )
        .setColor(red);
      await targetUser.send({ embeds: [dmEmbed] }).catch((error) => {
        console.error(
          `Failed to send DM to ${targetUser.user.username}: ${error}`
        );
      });

      // delete 24 hours worth of msgs
      await targetUser.ban({ deleteMessageSeconds: 60 * 60 * 24, reason });
      const embed = new EmbedBuilder()
        .setDescription(
          `<:right:1216014282957918259> ${targetUser.user.username} was banned. | ${reason}`
        )
        .setColor(green);
      await interaction.reply({ embeds: [embed] });
      return;
    } catch (error) {
      console.log(`There whas an error running this command`);
      interaction.channel.send("An error occurred");
    }
  },
  run: async (client, message, args) => {
    const mentionedUser = message.mentions.members.first();
    const reason = args.slice(1).join(" ") || "No reason provided";

    const targetUser = await checkUserPermissionsPrefixCmd(
        message,
        mentionedUser
      );
  
      if (!targetUser) return;
      try {
        const dmEmbed = new EmbedBuilder()
          .setDescription(
            `You have been banned from **${message.guild.name}** by **${message.author.username}**. | ${reason}`
          )
          .setColor(red);
        await mentionedUser.send({ embeds: [dmEmbed] }).catch((error) => {
          console.error(
            `Failed to send DM to ${mentionedUser.user.username}: ${error}`
          );
        });
  
        await targetUser.ban({ deleteMessageSeconds: 60 * 60 * 24, reason });
        const embed = new EmbedBuilder()
          .setDescription(
            `<:right:1216014282957918259> ${targetUser.user.username} was banned. | ${reason}`
          )
          .setColor(green);
        await message.channel.send({ embeds: [embed] });
        return;
      } catch (error) {
        console.log(error);
        message.channel.send('An error occurred');
      }
    },
  name: "ban",
  description: "ban a user.",
  options: [
    {
      name: "user",
      description: "User you want to ban.",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "reason",
      description: "Reason for the ban.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],
};
