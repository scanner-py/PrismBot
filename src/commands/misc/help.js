module.exports = {
  // options: [{}],
  // deleted: false,
  // devOnly: false,
  // testOnly: true,
  name: "help",
  description: "need help?",

  callback: (client, intersection) => {
    const channel = intersection.channel;
    channel.send("Sorry, but I cannot help you right now.");
  },
};
