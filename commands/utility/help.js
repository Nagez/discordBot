const { ChatInputCommandInteraction, ApplicationCommandOptionType, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get info about available commands'),
    async execute(interaction) {
        
        await interaction.reply({ content: 'working on it', ephemeral: true });

    }
  
}

  