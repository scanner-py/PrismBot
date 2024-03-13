const { Schema, model } = require('mongoose');

const guildSchema = new Schema({
    guildId: {
        type: String,
        required: true,
        unique: true
    },
    prefix: {
        type: String,
        default: '?' // Default prefix
    }
});

module.exports = model('Guild', guildSchema);