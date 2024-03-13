const chalk = require('chalk');
const { ActivityType } = require("discord.js");

module.exports = (client) => {
  const guildIds = client.guilds.cache.map(guild => guild.id);

  console.log(chalk.hex("#FFFFFF")(`${client.user.tag} is Online`));
  client.user.setPresence({
    activities: [{ name: `/help | ?help Currently in ${guildIds.length} servers`, type: ActivityType.Playing }],
    status: 'online',
  });
};