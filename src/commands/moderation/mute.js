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
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const mentionable = interaction.options.get("user").value;
    const duration = interaction.options.get("duration").value; // 1d, 1 day, 1s 5s, 5m
    const reason =
      interaction.options.get("reason")?.value || "No reason provided";

    // Check if the user is trying to mute themselves
    if (mentionable === interaction.user.id) {
      const embed = new EmbedBuilder()
        .setDescription(
          `<:TickNo:1215704449020989500> You cannot mute yourself.`
        )
        .setColor(red);
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    // await interaction.deferReply();
    const targetUser = await checkUserPermissions(interaction, mentionable);
    if (!targetUser) return;
    const msDuration = ms(duration);
    if (isNaN(msDuration)) {
      const embed = new EmbedBuilder()
        .setDescription(
          `<:TickNo:1215704449020989500> Please provide a valid mute duration.`
        )
        .setColor(red);
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (msDuration < 5000 || msDuration > 2.419e9) {
      const embed = new EmbedBuilder()
        .setDescription(
          `<:TickNo:1215704449020989500> Mute duration cannot be less than 5 seconds or more than 28 days.`
        )
        .setColor(red);
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    // Timeout the user
    try {
      const { default: prettyMs } = await import("pretty-ms");

      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(msDuration, reason);
        const embed = new EmbedBuilder()
          .setDescription(
            `<:TickYes:1215704707432190063> ${targetUser}'s mute duration has been updated to ${prettyMs(
              msDuration,
              {
                verbose: true,
              }
            )} | ${reason}`
          )
          .setColor(green);
        await interaction.reply({ embeds: [embed] });
        return;
      }

      // Send a DM to the kicked user
      const dmEmbed = new EmbedBuilder()
        .setDescription(
          `<:butterCry:1215371057868054588> You have been Muted in **${
            interaction.guild.name
          }** by **${interaction.user.username}** for **${prettyMs(msDuration, {
            verbose: true,
          })}**. \nReason: ${reason}`
        )
        .setColor(red);
      await targetUser.send({ embeds: [dmEmbed] }).catch((error) => {
        console.error(
          `Failed to send DM to ${targetUser.user.username}: ${error}`
        );
      });

      await targetUser.timeout(msDuration, reason);
      const embed = new EmbedBuilder()

        .setDescription(
          `<:TickYes:1215704707432190063> ${targetUser} was muted for ${prettyMs(
            msDuration,
            {
              verbose: true,
            }
          )} |  ${reason}`
        )
        .setColor(green);
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.log(`There was an error when timing out: ${error}`);
    }
  },

  run: async (client, message, args) => {
    const deleteRespond = (msg) => {
      setTimeout(() => msg.delete(), 5000); // delete the reply after 5 sce
    };
    const mentionedUser = message.mentions.members.first();
    const duration = args[1];
    const reason = args.slice(2).join(" ") || "No reason provided";
    const targetUser = await checkUserPermissionsPrefixCmd(
      message,
      mentionedUser
    );

    if (mentionedUser.id === message.author.id) {
      const embed = new EmbedBuilder()
        .setDescription(
          `<:TickNo:1215704449020989500> You cannot mute yourself.`
        )
        .setColor(red);
      return message.channel.send({ embeds: [embed] }).then(deleteRespond);
    }

    if (!targetUser) return; // If the function returns null, exit the command

    const msDuration = ms(duration);
    if (isNaN(msDuration)) {
      const embed = new EmbedBuilder()
        .setDescription(
          `<:TickNo:1215704449020989500> Please provide a valid mute duration.`
        )
        .setColor(red);
      return message.channel.send({ embeds: [embed] }).then(deleteRespond);
    }

    if (msDuration < 5000 || msDuration > 2.419e9) {
      const embed = new EmbedBuilder()
        .setDescription(
          `<:TickNo:1215704449020989500> Mute duration cannot be less than 5 seconds or more than 28 days.`
        )
        .setColor(red);
      return message.channel.send({ embeds: [embed] }.then(deleteRespond));
    }

    try {
      const { default: prettyMs } = await import("pretty-ms");

      if (mentionedUser.isCommunicationDisabled()) {
        await mentionedUser.timeout(msDuration, reason);
        const embed = new EmbedBuilder()
          .setDescription(
            `<:TickYes:1215704707432190063> | ${mentionedUser}'s mute duration has been updated to ${prettyMs(
              msDuration,
              {
                verbose: true,
              }
            )} | ${reason}`
          )
          .setColor(green);
        return message.channel.send({ embeds: [embed] });
      }

      const dmEmbed = new EmbedBuilder()
        .setDescription(
          `<:butterCry:1215371057868054588> You have been muted in **${
            message.guild.name
          }** by **${message.author.username}** for **${prettyMs(msDuration, {
            verbose: true,
          })}**. \nReason: ${reason}`
        )
        .setColor(red);
      await mentionedUser.send({ embeds: [dmEmbed] }).catch((error) => {
        console.error(
          `Failed to send DM to ${mentionedUser.user.username}: ${error}`
        );
      });

      await mentionedUser.timeout(msDuration, reason);
      const embed = new EmbedBuilder()
        .setDescription(
          `<:TickYes:1215704707432190063> ${mentionedUser} was muted for ${prettyMs(
            msDuration,
            {
              verbose: true,
            }
          )} | ${reason}`
        )
        .setColor(green);
      return message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.log(`There was an error when timing out: ${error}`);
    }
  },

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
};
