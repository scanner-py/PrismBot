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
    const user = interaction.options.getUser("user");
    const reason =
      interaction.options.getString("reason") || "No reason provided";

    const bannedUsers = await interaction.guild.bans.fetch();
    const userBanned = bannedUsers.get(user.id);

    if (!userBanned) {
      const embed = new EmbedBuilder()
        .setDescription(
          `<:No:1215704504180146277> ${user.username}is not banned from this server.`
        )
        .setColor(red);
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    await interaction.guild.members.unban(user, reason);
    const embed = new EmbedBuilder()
      .setDescription(
        `<:right:1216014282957918259> ${user.username}was unbanned. | ${reason} `
      )
      .setColor(green);
    return await interaction.reply({ embeds: [embed] });
  },
  run: async (client, message, args) => {
    const userId = args[0];
    const reason = args.slice(1).join(" ") || "No reason provided";
    const bannedUsers = await message.guild.bans.fetch();
    const userBanned = bannedUsers.get(userId);
    const user = await message.client.users.fetch(userId);
    if (!userBanned) {
        const embed = new EmbedBuilder()
        .setDescription(
          `<:No:1215704504180146277> ${user.username}is not banned from this server.`
        )
        .setColor(red);
      return await message.channel.send({ embeds: [embed]}).then((msg) => {
        setTimeout(() => msg.delete(), 5000); // delete the reply after 5 sce
      });
    }

    try {
      await message.guild.members.unban(userId, reason);
      const embed = new EmbedBuilder()
        .setDescription(
          `<:right:1216014282957918259> ${user.username} was unbanned. | ${reason} `
        )
        .setColor(green);
      return await message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      message.channel.send("An error occurred");
    }
  },
  name: "unban",
  description: "ban a user.",
  options: [
    {
      name: "user",
      description:
        "User you want to unban. enter userID for ex 1021704817720172638",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "reason",
      description: "Reason for the unban.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],
};
