const { createEmbed } = require("../../utils/templates/butterEmbed");

module.exports = {
  // options: [{}],
  // deleted: false,
  // devOnly: false,
  // testOnly: true,
  name: "ping",
  description: "Bot Latency with a Pong!",

  callback: (client, intersection) => {
    const embed = createEmbed().setDescription(
      `ping ${client.ws.ping}ms Pong!`
    );
    intersection.reply({ embeds: [embed] });
  },
};
