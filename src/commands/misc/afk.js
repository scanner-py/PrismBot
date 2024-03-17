const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { red, green } = require("../../../data/colors.json");
const AFK = require("../../schemas/afkSchema");

module.exports = {
	name: "afkset",
	description: "Set and AFK status shown when you are mentioned, disply in nickname",
	aliases: ["afk"],
	options: [
		{
			name: 'message',
			description: 'message to set',
			type: ApplicationCommandOptionType.String

		},
	],

	callback: async (client, interaction) => {
		const message = interaction.options.get('message')?.value || '';
		const guildid = interaction.guild.id;
		const date = new Date();
		const milliseconds = date.getTime();

		const targetMember = await interaction.guild.members.fetch(interaction.user.id);
		const nickname = targetMember.nickname;

		let userData = await AFK.findOne({ guildId: guildid, userId: interaction.user.id });

		// check if user in DB 
		try {
			if (userData) {
				return interaction.reply('you are already AFK')
			} else {
				userData = new AFK({
					userId: interaction.user.id,
					guildId: interaction.guild.id,
					nickname: nickname,
					message: message,
					timeStamp: milliseconds
				});
				await userData.save();
			}
		} catch (error) {
			console.log('there was an error in setting afk')
		}

		interaction.reply(`afk set AFK: ${message}`)

	},

	run: async (client, message, args) => {
		const afkMessage = args.join(' ');
		const guildid = message.guild.id;
		const date = new Date();
		const milliseconds = date.getTime();

		let userData = await AFK.findOne({ guildId: guildid, userId: message.author.id });

		const targetMember = await message.guild.members.fetch(message.author.id);
		const nickname = targetMember.nickname;

		if (userData) {
			message.channel.send('You are already AFK');
		} else {
			userData = new AFK({
				userId: message.author.id,
				guildId: message.guild.id,
				nickname: nickname,
				message: afkMessage,
				timeStamp: milliseconds
			});
			await userData.save();
			message.channel.send(`AFK set: ${afkMessage}`);
		}
	}
}