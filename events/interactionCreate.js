const { Events, Collection, MessageFlags } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`Esse comando ${interaction.commandName} não existe/não está registrado.`);
      return;
    }

    const { cooldowns } = interaction.client;

    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const defaultCooldownDuration = 3; // segundos
    const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

    if (timestamps.has(interaction.user.id)) {
      const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

      if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1000);
        return interaction.reply({
          content: `Estás em cooldown para o comando \`${command.data.name}\`. Tente novamente <t:${expiredTimestamp}:R>.`,
          flags: MessageFlags.Ephemeral,
        });
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      const replyContent = { content: 'Ocorreu um erro ao executar esse comando.', flags: MessageFlags.Ephemeral };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(replyContent);
      } else {
        await interaction.reply(replyContent);
      }
    }
  },
};
