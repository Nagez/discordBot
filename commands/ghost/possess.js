const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'ghost',
    cooldown: 15,
    data: new SlashCommandBuilder()
        .setName('possess')
        .setDescription('Possess somebody, changing the name and icon')
        .addSubcommand(subcommand =>
            subcommand
                .setName('member')
                .setDescription('Possess a member of the guild')
                .addUserOption(option =>
                    option.setName('target')
                        .setDescription('The name of the member to possess')
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('npc')
                .setDescription('Possess a custom character')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('The new character name')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('avatar')
                        .setDescription('The new character avatar picture, put a URL of an image')
                        .setRequired(true)
                )),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        try {
            if (subcommand === 'member') {
                const target = interaction.options.getMember("target")
                const memberAvatar = target.user.avatarURL();
                await interaction.guild.members.me.setNickname(target.displayName);
                await interaction.guild.members.client.user.setAvatar(memberAvatar);
                await interaction.reply(`Possessing ${target.displayName}`);
            }
            if (subcommand === 'npc') {
                const npcName = interaction.options.getString("name")
                const npcAvatar = interaction.options.getString("avatar")
                await interaction.guild.members.me.setNickname(npcName);
                await interaction.guild.members.client.user.setAvatar(npcAvatar);
                await interaction.reply(`Possessing ${npcName}`);
            }
        } catch (error) {
            await interaction.reply({ content: `I need a little time to possess againm let's try in a few moments`, ephemeral: true });
            console.error(error);
        }
    },
};