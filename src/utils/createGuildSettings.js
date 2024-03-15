const { Client, GatewayIntentBits } = require('discord.js');
const GuildSettings = require('../schemas/guild'); // Import the Guild model

async function createGuildSettings(guild) {
	try {
		// Check if settings already exist for this guild
		const existingSettings = await GuildSettings.findOne({ guildId: guild.id });
		if (existingSettings) return; // Settings already exist, do nothing

		// Create a new settings document for the guild
		const newSettings = new GuildSettings({ guildId: guild.id });
		await newSettings.save();
		console.log(`Created settings for guild ${guild.name} (${guild.id})`);
	} catch (err) {
		console.error('Error creating guild settings:', err);
	}
}

module.exports = { createGuildSettings }