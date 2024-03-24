const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get info about a user or a server!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Info about a user')
                .addUserOption(option => option.setName('target').setDescription('The user')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Info about the server')),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'user') {
            // interaction.user is the object representing the User who ran the command
            // interaction.member is the GuildMember object, which represents the user in the specific guild
            await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
        }
        if (subcommand === 'server') {
            await interaction.reply(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`);
        }

    },
};
