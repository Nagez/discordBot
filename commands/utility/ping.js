const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    category: 'utility',
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        //await interaction.reply('Pong!');
        await interaction.deferReply({ ephemeral: true });
        await wait(4_000);
        await interaction.editReply('Pong!');
        const message = await interaction.fetchReply(); //fetch a response
        console.log(message);
        await interaction.deleteReply();//delete the initial response
        await interaction.followUp({ content: 'Pong again!', ephemeral: true }); //show an additional response
    },
};