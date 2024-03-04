module.exports = {
  // options: [{}],
  // deleted: false,
  // devOnly: false,
  // testOnly: true,
  name: "help",
  description: "need help?",

  callback: (client, intersection) => {
    intersection.reply(`sorry but i cannot help you now`);
  },
};
