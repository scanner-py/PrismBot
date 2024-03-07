const { EmbedBuilder, version } = require("discord.js");
const os = require("os");

module.exports = {
  name: "stats",
  description: "bot statistics",

  callback: async (client, interaction) => {
    await interaction.deferReply();
    const uptime = process.uptime();

    const days = Math.floor(uptime / 86400);
    const hours = Math.floor(uptime / 3600) % 24;
    const minutes = Math.floor(uptime / 60) % 60;
    const seconds = Math.floor(uptime % 60);

    const embed = new EmbedBuilder()
      .setTitle("Statistics")
      .setColor("#f1c40f")
      .addFields(
        {
          name: "Uptime",
          value: `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`,
          inline: false,
        },
        { name: "Discord.js Version ", value: `\`${version}\``, inline: true },
        {
          name: "Node.js Version ",
          value: `\`${process.version}\``,
          inline: true,
        },
        { name: "Platform ", value: `\`${os.platform()}\``, inline: true },
        { name: "Architecture ", value: `\`${os.arch()}\``, inline: true },
        { name: "CPU Cores ", value: `\`${os.cpus().length}\``, inline: true },
        {
          name: "Memory Usage ",
          value: `\`${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(
            2
          )} MB\``,
          inline: true,
        }
      )
      .setTimestamp();

    interaction.editReply({ embeds: [embed] });
  },
};
