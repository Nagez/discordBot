const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('About squire!'),
    /**
     * @param {ChatInputCommandInteraction} interaction
    */
    async execute(interaction) {
        await interaction.reply(`Squire! The Spooky Ghost is a dicord bot made by Nagez.\nSquire is here to bring a ghostly charm to your Discord experience so go ahead and try to possess your mates and roll some dice.`);
    },

}