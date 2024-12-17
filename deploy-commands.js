const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config(); // Importa e carrega as variáveis de ambiente do .env

// Pega as variáveis de ambiente do arquivo .env
const { CLIENT_ID, BOT_TOKEN } = process.env;

const commands = [];
// Obtém todas as pastas de comandos no diretório "commands"
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Obtém todos os arquivos de comandos dentro de cada pasta
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Verifica se os comandos possuem "data" e "execute" corretamente
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] O comando em ${filePath} está faltando a propriedade "data" ou "execute".`);
		}
	}
}

// Cria e configura uma instância do módulo REST
const rest = new REST().setToken(BOT_TOKEN);

// Publica os comandos
(async () => {
	try {
		console.log(`Iniciando a atualização de ${commands.length} comandos de aplicação (/) no Discord.`);

		// Atualiza todos os comandos no servidor especificado
		const data = await rest.put(
			Routes.applicationCommands(CLIENT_ID),
			{ body: commands },
		);

		console.log(`Comandos de aplicação (/) atualizados com sucesso! ${data.length} comandos carregados.`);
	} catch (error) {
		// Captura e exibe erros no processo
		console.error(error);
	}
})();
