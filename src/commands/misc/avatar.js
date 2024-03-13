const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { transparent } = require("../../../data/colors.json");

module.exports = {
  name: "avatar",
  description: "get a users profile picture",
  aliases: ["av"],
  options: [
    {
      name: "user",
      description: "User you want to ban.",
      type: ApplicationCommandOptionType.Mentionable,
    },
  ],
  

  callback: async (client, interaction) => {
    const targetUser = interaction.options.get("user")?.user;
    const user = targetUser ? targetUser : interaction.user;
    const embed = handleAvatar(user);
    interaction.reply({ embeds: [embed] });
  },
  run: async (client, message, args) => {
    const mentionedUser = message.mentions.members.first();
    const user = mentionedUser ? mentionedUser.user : message.author;
    const embed = handleAvatar(user);
    message.channel.send({ embeds: [embed] });
  },
};

function handleAvatar(target) {
  const avatarUrl = target.avatarURL({ size: 512 });
  const embed = new EmbedBuilder()
    .setColor(transparent)
    .setTitle(`${target.username}'s avatar`)
    .setImage(avatarUrl);
  return embed;
}
