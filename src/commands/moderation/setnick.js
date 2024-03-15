const { EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const { red, green } = require("../../../data/colors.json");

module.exports = {
	name: 'setnick',
	description: 'Change nickname of a user',
	options: [
		{
			name: "user",
			description: "User to change nickname for",
			type: ApplicationCommandOptionType.Mentionable,
			required: true,
		},
		{
			name: "nickname",
			description: "New nickname for the user.",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],
	permissionsRequired: [PermissionFlagsBits.ManageNicknames],
	botPermissions: [PermissionFlagsBits.ManageNicknames],

	callback: async (client, interaction) => {
		const targetUser = interaction.options.getUser('user');
		const newNickname = interaction.options.getString('nickname');
		const targetMember = await interaction.guild.members.fetch(targetUser.id);
		await handleSetNick(targetUser, newNickname, targetMember, interaction);
	},

	run: async (client, message, args) => {
		const mentionedUser = message.mentions.members.first();
		const newNickname = args.slice(1).join(" ");
		const targetMember = await message.guild.members.fetch(mentionedUser.id);
		const embed = new EmbedBuilder()
			.setColor(red)
			.setDescription('<:No:1215704504180146277> please mention a user and provide nickname.')
		if (!mentionedUser || !newNickname) return message.channel.send({ embeds: [embed] });

		await handleSetNick(mentionedUser, newNickname, targetMember, message);

	}
}

async function handleSetNick(targetUser, newNickname, targetMember, interactionOrMsg) {
	const oldNickname = targetMember.nickname;
	const embed = new EmbedBuilder()
		.setColor(green)
		.setDescription(`<:right:1216014282957918259> Set ${oldNickname} to ${newNickname}`)

	try {
		await targetMember.setNickname(newNickname);

		await interactionOrMsg.channel.send({ embeds: [embed], ephemeral: true });
	} catch (error) {
		console.error(error);
		interactionOrMsg.channel.send({ content: 'Failed to set nickname.', ephemeral: true });
	}
}