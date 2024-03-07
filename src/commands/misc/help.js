module.exports = {
  // options: [{}],
  // deleted: false,
  // devOnly: false,
  // testOnly: true,
  name: "help",
  description: "need help?",

  callback: (client, interaction) => {
    interaction.reply("Sorry, but I cannot help you right now.");
  },
  run: (client, message, args ) => {
    message.reply("Sorry, but I cannot help you right now.");
  },
};
