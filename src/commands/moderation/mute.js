const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const ms = require("ms");
const checkUserPermissions = require("../../utils/checkUserPermissions");
const checkUserPermissionsPrefixCmd = require("../../utils/checkUserPermissionsPrefixCmd");
const { red, green } = require("../../../data/colors.json");
module.exports = {
  name: "mute",
  description: "Mute a user.",
  options: [
    {
      name: "user",
      description: "User you want to mute.",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "duration",
      description: "Mute duration for ex (30m, 1h, 1 day).",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "reason",
      description: "Reason for the mute.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.MuteMembers],
  botPermissions: [PermissionFlagsBits.MuteMembers],

  callback: async (client, interaction) => {
    const mentionable = interaction.options.get("user").value;
    const duration = interaction.options.get("duration").value; // 1d, 1 day, 1s 5s, 5m
    const reason = interaction.options.get("reason")?.value || "No reason provided";

    const targetUser = await checkUserPermissions(interaction, mentionable);
    if (!targetUser) return;

    const msDuration = ms(duration);
    validateMuteDuration(msDuration, interaction);
    const muteEmbed = await handleMute(targetUser, reason, msDuration, interaction)

    await interaction.reply({ embeds: [muteEmbed] });
  },

  run: async (client, message, args) => {
    const mentionedUser = message.mentions.members.first();
    const duration = args[1];
    const reason = args.slice(2).join(" ") || "No reason provided";

    const targetUser = await checkUserPermissionsPrefixCmd(message, mentionedUser);
    if (!targetUser) return;

    const msDuration = ms(duration);
    validateMuteDuration(msDuration, message);
    const muteEmbed = await handleMute(mentionedUser, reason, msDuration, message);

    return message.channel.send({ embeds: [muteEmbed] });
  }
};

async function validateMuteDuration(msDuration, interactionOrmsg) {
  // check if duration given is a valid number or not
  if (isNaN(msDuration)) {
    const embed = new EmbedBuilder()
      .setDescription(`<:No:1215704504180146277> Please provide a valid mute duration.`)
      .setColor(red);
    return await interactionOrmsg.channel.send({ embeds: [embed], ephemeral: true });
  }
  // check if duration given by user is greater 5 and less then 28 days
  if (msDuration < 5000 || msDuration > 2.419e9) {
    const embed = new EmbedBuilder()
      .setDescription(`<:No:1215704504180146277> Mute duration cannot be less than 5 seconds or more than 28 days.`)
      .setColor(red);
    return await interactionOrmsg.channel.send({ embeds: [embed], ephemeral: true });

  }
}

async function handleMute(targetUser, reason, msDuration, interactionOrMsg) {
  const { default: prettyMs } = await import("pretty-ms");
  try {
    if (targetUser.isCommunicationDisabled()) {
      await targetUser.timeout(msDuration, reason);
      const embed = new EmbedBuilder()
        .setDescription(`<:right:1216014282957918259> ${targetUser}'s mute duration has been updated to ${prettyMs(msDuration, { verbose: true, })} | ${reason}`)
        .setColor(green);
      return embed;
    } else {
      await targetUser.timeout(msDuration, reason);
      const embed = new EmbedBuilder()
        .setDescription(`<:right:1216014282957918259> ${targetUser} was muted for ${prettyMs(msDuration, { verbose: true, })} |  ${reason}`)
        .setColor(green);
      return embed;
    }
  } catch (e) {
    console.log(e)
    interactionOrMsg.channel.send('An error occurred')
  }
}