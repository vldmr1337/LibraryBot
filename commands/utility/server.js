const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Retorna as informações do servidor.'),
	async execute(interaction) {
		await interaction.reply(`Esse é o servidor ${interaction.guild.name} e tem ${interaction.guild.memberCount} membros.`);
	},
};
