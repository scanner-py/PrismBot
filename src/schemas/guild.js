const { Schema, model } = require('mongoose');
const { defaultPrefix } = require('../../config.json')

const guildSchema = new Schema({
	guildId: {
		type: String,
		required: true,
		unique: true
	},
	prefix: {
		type: String,
		default: defaultPrefix 
	},
	xpSystem: {
		type: Boolean,
		default: true,
	}
});

module.exports = model('Guild', guildSchema);