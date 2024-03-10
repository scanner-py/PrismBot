const chalk = require('chalk');

const { ActivityType } = require("discord.js");
module.exports = (client) => {
  console.log(chalk.hex("#FFFFFF")(`${client.user.tag} is Online`));
  client.user.setPresence({
    activities: [{ name: '/help | ?help', type: ActivityType.Playing }],
    status: 'online',
  });
};
