const { ActivityType } = require("discord.js");
module.exports = (client) => {
  console.log(`${client.user.tag} is Online`);
  client.user.setPresence({
    activities: [{ name: `last of us with your mom`, type: ActivityType.Watching }],
    status: 'dnd',
  });
};
