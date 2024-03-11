const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { red, green } = require("../../../data/colors.json");

module.exports = {
  name: "unban",
  description: "unban a user.",
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

  callback: async (client, interaction) => {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason") || "No reason provided";

    informUserNotBanned(interaction, user);
    const unbanEmbed = await handleUnan(interaction, user, reason);


    await interaction.reply({ embeds: [unbanEmbed] });
  },
  
  run: async (client, message, args) => {
    const deleteRespond = (msg) => {
      setTimeout(() => msg.delete(), 5000);
    };
    const userId = args[0];
    const reason = args.slice(1).join(" ") || "No reason provided";

    informUserNotBanned(message, userId).then(deleteRespond);
    const unbanEmbed = await handleUnan(message, userId, reason);

    await message.channel.send({ embeds: [unbanEmbed] });
  }
};

// check if user is in server ban list
async function informUserNotBanned(interactionOrMsg, user) {
  const bannedUsers = await interactionOrMsg.guild.bans.fetch();
  const userBanned = bannedUsers.get(user.id);

  if (!userBanned) {
    const embed = new EmbedBuilder()
      .setDescription(`<:No:1215704504180146277> ${user.username}is not banned from this server.`)
      .setColor(red);
    return await interactionOrMsg.channel.send({ embeds: [embed], ephemeral: true });
  }
}
// unban and create a confirmation embed
async function handleUnan(interactionOrMsg, user, reason) {
  await interactionOrMsg.guild.members.unban(user, reason);
  const embed = new EmbedBuilder()
    .setDescription(`<:right:1216014282957918259> ${user.username}was unbanned. | ${reason} `)
    .setColor(green);
  return embed;
}