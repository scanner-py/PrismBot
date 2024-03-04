module.exports = {
  // options: [{}],
  // devOnly: false,
  // testOnly: true,
  deleted: true,
  name: "ban",
  description: "bans a member from the server",

  callback: (client, intersection) => {
    intersection.reply(`ban`);
  },
};
