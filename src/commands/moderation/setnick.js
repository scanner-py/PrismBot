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
		const oldNickname = targetMember.nickname;
		const sucEmbed = await handleSetNick(targetUser, newNickname, targetMember, oldNickname);

		interaction.reply({ embeds: [sucEmbed] }) // send success message.
	},

	run: async (client, message, args) => {
		const mentionedUser = message.mentions.members.first();
		const newNickname = args.slice(1).join(" ");
		const targetMember = await message.guild.members.fetch(mentionedUser.id);
		const oldNickname = targetMember.nickname;

		const embed = new EmbedBuilder()
			.setColor(red)
			.setDescription('<:No:1215704504180146277> please mention a user and provide nickname.')

		// check if user is mentioned and nickname is given.
		if (!mentionedUser || !newNickname) return message.channel.send({ embeds: [embed] });
		const sucEmbd = await handleSetNick(mentionedUser, newNickname, targetMember, oldNickname);

		await message.channel.send({ embeds: [sucEmbd] })

	}
}

async function handleSetNick(targetUser, newNickname, targetMember, oldNickname) {

	try {
		const embed = new EmbedBuilder()
			.setColor(green)
			.setDescription(`<:right:1216014282957918259> Set ${oldNickname} to ${newNickname}`)
		await targetMember.setNickname(newNickname);
		return embed;
	} catch (error) {
		const embed = new EmbedBuilder()
			.setColor(red)
			.setDescription('<:No:1215704504180146277> failed to change nickname')
		return embed;
	}


}