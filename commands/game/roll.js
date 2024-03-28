const { SlashCommandBuilder } = require('discord.js');
const { randomInteger } = require('../../functions/diceFunc.js');

module.exports = {
    category: 'game',
    cooldown: 2,
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll a dice! (default is 20)')
        .addIntegerOption(option =>
            option.setName('sides')
                .setDescription('The number of sides to the dice')
                ),
    async execute(interaction) {
        let input = interaction.options.getInteger('sides');
        if (!input) {
            input = 20;
        }
        result = randomInteger(input).toString();
        await interaction.reply('My distinguished individual, you rolled a ' + result)

        if (result == 20){
            await interaction.followUp({ content:'https://tenor.com/view/nat-20-baldur%27s-gate-baldur%27s-gate-3-critical-sucess-gif-14789122616741343796'})
        }
        if (result == 1){
            await interaction.followUp({ content: 'https://tenor.com/view/critical-failure-baldur%27s-gate-3-dice-dice-roll-critical-gif-16389621355368608807'}); 
        }
    }
}        