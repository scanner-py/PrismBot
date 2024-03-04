module.exports = {
  // options: [{}],
  // deleted: false,
  // devOnly: false,
  // testOnly: true,
  name: "ping",
  description: "shows current bot ping with a Pong1",

  callback: (client, intersection) => {
    intersection.reply(`ping ${client.ws.ping}ms Pong!`);
  },
};
