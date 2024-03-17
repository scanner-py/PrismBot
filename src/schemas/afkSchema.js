const { Schema, model } = require("mongoose");

const afkSchema = new Schema({
	userId: {
		type: String,
		required: true,
	},
	guildId: {
		type: String,
		required: true,
	},
	nickname: {
		type: String
	},
	message: {
		type: String
	},
	timeStamp: {
		type: Number
	}

});

module.exports = model("afk", afkSchema);