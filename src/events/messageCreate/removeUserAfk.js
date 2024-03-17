const AFK = require('../../schemas/afkSchema');

module.exports = async (client, message) => {
	const { guild, author, mentions, content } = message;

	// Handle the case where the user is no longer AFK
	const userAFK = await AFK.findOne({ guildId: guild.id, userId: author.id });
	if (userAFK) {
		try {
			await AFK.deleteOne({ guildId: guild.id, userId: author.id });
			message.reply(`Welcome back! \`${userAFK.nickname}\`. I removed your AFK`);
		} catch (error) {
			console.error('Error deleting AFK data:', error);
		}
		return;
	} else {


		try {
			const members = message.mentions.users.first();
			if (!members) return;

			const data = await AFK.findOne({ guildId: guild.id, userId: members.id })
			if (!data) return;

			const member = message.guild.members.cache.get(members.id)

			const date = new Date();
			const milliseconds = date.getTime();

			const afkTime = data.timeStamp - milliseconds
			const { default: prettyMs } = await import("pretty-ms");

			if (message.content.includes(member)) {
				await message.reply(`\`${data.nickname}\` is AFK: ${data.message} ${prettyMs(afkTime, { verbose: true, compact: true })}`)
			}
		} catch (error) {
			console.log(error)
		}
	}

}