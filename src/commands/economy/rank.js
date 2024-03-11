const { Client, Interaction, ApplicationCommandOptionType, AttachmentBuilder } = require("discord.js");
const canvacord = require("canvacord");
const Level = require("../../schemas/level");
const calculateLevelXp = require("../../utils/calculateLevelXp");

module.exports = {
  name: "rank",
  description: "Shows your/someone's level.",
  options: [
    {
      name: "user",
      description: "The user whose level you want to see.",
      type: ApplicationCommandOptionType.Mentionable,
    },
  ],

  callback: async (client, interaction) => {
    await interaction.deferReply();

    // Get the mentioned user or use the command executor's member if no user is mentioned.
    const mentionedUserId = interaction.options.get("user")?.value;
    const targetUserId = mentionedUserId || interaction.member.id;
    const targetUserObj = await interaction.guild.members.fetch(targetUserId);

    // Call the getRankData function to fetch and process the level data.
    const { fetchedLevel, allLevels, currentRank } = await getRankData(targetUserId, interaction.guild.id);

    if (!fetchedLevel) {
      return interaction.editReply(
        mentionedUserId
          ? `${targetUserObj.user.tag} doesn't have any levels yet. Try again when they chat a little more.`
          : "You don't have any levels yet. Chat a little more and try again."
      );
    }

    // Build and send the rank image.
    const rankImage = await buildRankImage(targetUserObj, fetchedLevel, currentRank);
    interaction.editReply({ files: [rankImage] });
  },

  run: async (client, message, args) => {
    const mentionedUser = message.mentions.users.first();
    const targetUserId = mentionedUser ? mentionedUser.id : message.author.id;
    const targetUserObj = await message.guild.members.fetch(targetUserId);

    // Call the getRankData function to fetch and process the level data.
    const { fetchedLevel, allLevels, currentRank } = await getRankData(targetUserId, message.guild.id);

    if (!fetchedLevel) {
      return message.reply(
        mentionedUser
          ? `${targetUserObj.user.tag} doesn't have any levels yet. Try again when they chat a little more.`
          : "You don't have any levels yet. Chat a little more and try again."
      );
    }

    // Build and send the rank image.
    const rankImage = await buildRankImage(targetUserObj, fetchedLevel, currentRank);
    message.channel.send({ files: [rankImage] });
  },
};

async function getRankData(targetUserId, guildId) {
  const fetchedLevel = await Level.findOne({ userId: targetUserId, guildId });

  let allLevels = await Level.find({ guildId }).select("-_id userId level xp");

  allLevels.sort((a, b) => {
    if (a.level === b.level) {
      return b.xp - a.xp;
    } else {
      return b.level - a.level;
    }
  });

  const currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;

  return { fetchedLevel, allLevels, currentRank };
}

async function buildRankImage(targetUserObj, fetchedLevel, currentRank) {
  const rank = new canvacord.Rank()
    .setAvatar(targetUserObj.user.displayAvatarURL({ size: 256 }))
    .setRank(currentRank)
    .setLevel(fetchedLevel.level)
    .setCurrentXP(fetchedLevel.xp)
    .setRequiredXP(calculateLevelXp(fetchedLevel.level))
    .setProgressBar("#FFFF", "COLOR")
    .setUsername(targetUserObj.user.displayName);
  rank.setStatus(targetUserObj.presence?.status || "offline");

  const data = await rank.build();
  return new AttachmentBuilder(data);
}