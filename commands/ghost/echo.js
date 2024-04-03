const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'ghost',
    cooldown: 2,
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Replies with your input!')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The input to echo back')
                .setRequired(true)
        ),
    async execute(interaction) {
        const input = interaction.options.getString("input")
        //await interaction.reply(input)
        try {
            if (interaction.member.roles.cache.some(role => role.name === 'DM') === true) {
                interaction.deferReply({ content: input, ephemeral: true})
                interaction.deleteReply();
                await interaction.channel.send(input)
            }else{
                await interaction.reply({ content: "DM only command", ephemeral: true})
            }

        } catch (error) {
            console.error(error);
            await interaction.reply(`There was an error with echo \`${error.message}\``);
        }

    }
}