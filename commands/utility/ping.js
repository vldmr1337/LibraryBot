const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('responde com pong'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
