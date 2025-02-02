const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Retorna as informações do usuário que utilizar o comando'),
	async execute(interaction) {
		await interaction.reply(`Esse comando foi executado por ${interaction.user.username}, que entrou no servidor em ${interaction.member.joinedAt}.`);
	},
};
