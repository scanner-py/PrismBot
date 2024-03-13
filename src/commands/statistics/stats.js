const { EmbedBuilder, version } = require("discord.js");
const os = require("os");
const { transparent } = require("../../../data/colors.json");
module.exports = {
  name: "stats",
  description: "bot statistics",
  devOnly: true,

  callback: async (client, interaction) => {
    const statsEmbed = getUptimeStats();
    interaction.reply({ embeds: [statsEmbed] });
  },
  run: async (client, message, args) => {
    const statsEmbed = getUptimeStats();
    message.channel.send({ embeds: [statsEmbed] });
  },
};

// Function to retrieve and format system uptime statistics
function getUptimeStats() {
  // Get the system uptime in seconds
  const uptime = process.uptime();

  // Calculate uptime components (days, hours, minutes, seconds)
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor(uptime / 3600) % 24;
  const minutes = Math.floor(uptime / 60) % 60;
  const seconds = Math.floor(uptime % 60);

  // Create a new EmbedBuilder object 
  const embed = new EmbedBuilder()
    .setTitle("Statistics") // Set the title of the embed
    .setColor(transparent) // Set the embed color 
    .addFields( // Add fields with system information
      {
        name: "Uptime",
        value: `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`,
        inline: false, // Display uptime on a single line
      },
      {
        name: "Discord.js Version",
        value: `\`${version}\``, // Display Discord.js version (assuming version is defined)
        inline: true, // Display inline for compact layout
      },
      {
        name: "Node.js Version",
        value: `\`${process.version}\``, // Display Node.js version
        inline: true,
      },
      {
        name: "Platform",
        value: `\`${os.platform()}\``, // Display OS platform (e.g., 'linux', 'darwin')
        inline: true,
      },
      {
        name: "Architecture",
        value: `\`${os.arch()}\``, // Display system architecture (e.g., 'x64', 'arm')
        inline: true,
      },
      {
        name: "CPU Cores",
        value: `\`${os.cpus().length}\``, // Display number of CPU cores
        inline: true,
      },
      {
        name: "Memory Usage",
        value: `\`${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB\``, // Display memory usage in MB (rounded to 2 decimal places)
        inline: true,
      }
    )
    .setTimestamp(); // Set the embed timestamp

  // Return the constructed embed object
  return embed;
}
