const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,

} = require("discord.js");

module.exports = {

    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get info about available commands'),
    /**
     * @param {ChatInputCommandInteraction} interaction
    */
    async execute(interaction) {

        try {
            const slashCommands = await interaction.client.application.commands.fetch()

            const embed = new EmbedBuilder()
                .setTitle("Your Squire is here to help! 👻")
                .setDescription(
                    "This is what I can do:"
                )
                .setThumbnail(`${interaction.client.user.avatarURL()}`)
                .setFooter({ text: `Total commands: ${slashCommands.size}` })

            slashCommands.forEach((command) => {
                embed.addFields({
                    name: `${command.name}`,
                    value: `${command.description}`,
                    inline: true,
                })
            })

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
        }
    },

}



