//rock paper scissor multiplayer game (with no slash command builder) https://www.youtube.com/watch?v=bDEgBZmsdI4
//https://emojidb.org/
const { ChatInputCommandInteraction, ApplicationCommandOptionType, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

const choices_regular = [
    { name: 'Rock', emoji: '🪨', beats: ['Scissors'] },
    { name: 'Paper', emoji: '📄', beats: ['Rock'] },
    { name: 'Scissors', emoji: '✂️', beats: ['Paper'] },
];
const choices_LS = [
    { name: 'Rock', emoji: '🪨', beats: ['Scissors','Lizard'] },
    { name: 'Paper', emoji: '📄', beats: ['Rock','Spock'] },
    { name: 'Scissors', emoji: '✂️', beats: ['Paper','Lizard'] },
    { name: 'Lizard', emoji: '🦎', beats: ['Paper','Spock'] },
    { name: 'Spock', emoji: '🖖', beats: ['Scissors','Rock'] },
];

TIMEOUT = 2_400_000;

module.exports = {
    category: 'game',
    data: new SlashCommandBuilder()
        .setName('rock_paper_scissors')
        .setDescription('Rock Paper Scissors (lizard spock) game.')
        .setDMPermission(false) //prevent being used in a direct message
        .addSubcommand(subcommand =>
            subcommand
                .setName('lizard_spock')
                .setDescription('rock paper scissors lizard spock edition.')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to play with')
                        .setRequired(true))                
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('regular')
                .setDescription('rock paper scissors game.')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to play with')
                        .setRequired(true))
        ),

    /**
    * @param {ChatInputCommandInteraction} interaction
    */
    async execute(interaction) {

        try {
            const targetUser = interaction.options.getUser('user');
            
            if (interaction.user.id === targetUser.id || targetUser.bot) {
                interaction.reply({ content: 'you can not play rock paper scissors with yourself or a bot.', ephemeral: true, });
                return;
            }
            
            const subcommand = interaction.options.getSubcommand();

            let choices = choices_regular;
            let image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Rock-paper-scissors.svg/1200px-Rock-paper-scissors.svg.png';
            if (subcommand === 'lizard_spock') {
                choices = choices_LS;
                image = 'https://static.wikia.nocookie.net/bigbangtheory/images/7/7d/RPSLS.png/revision/latest?cb=20120822205915c'
            }

            const embed = new EmbedBuilder()
                .setTitle('Rock Paper Scissors')
                .setDescription(`It's currently ${targetUser} turn`)
                .setColor('Yellow')
                .setTimestamp(new Date())
                .setImage(image)

            const buttons = choices.map((choice) => {
                return new ButtonBuilder()
                    .setCustomId(choice.name)
                    .setLabel(choice.name)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(choice.emoji)
            });

            const row = new ActionRowBuilder().addComponents(buttons);

            const reply = await interaction.reply({
                content: `${targetUser} you have been challenged to a game of Rock Paper Scissors, by ${interaction.user}.`,
                embeds: [embed],
                components: [row],
            });

            const targetUserInteraction = await reply.awaitMessageComponent({
                filter: (i) => i.user.id === targetUser.id,
                time: TIMEOUT,
            }).catch(async (error) => {
                embed.setDescription(`The time for a reply from ${targetUser} ran out.`);
                await reply.edit({ embeds: [embed], components: [] });
            })
            if (!targetUserInteraction) return;

            const targetUserChoice = choices.find(
                (choice) => choice.name === targetUserInteraction.customId,
            );

            await targetUserInteraction.reply({
                content: `You picked ${targetUserChoice.name + targetUserChoice.emoji}`,
                ephemeral: true,
            });

            //Edit embed with the updated user turn
            embed.setDescription(`It's currently ${interaction.user}'s turn.`)
            await reply.edit({
                content: `${interaction.user} it's your turn now.`,
                embeds: [embed],
            });

            const initialUserInteraction = await reply.awaitMessageComponent({
                filter: (i) => i.user.id === interaction.user.id,
                time: TIMEOUT, //30 seconds
            }).catch(async (error) => {
                embed.setDescription(`The time for a reply from ${interaction.user} ran out.`);
                await reply.edit({ embeds: [embed], components: [] });
            })
            if (!initialUserInteraction) return;

            const initialUserChoice = choices.find(
                (choice) => choice.name === initialUserInteraction.customId,
            );

            let result;

            if (targetUserChoice.beats.includes(initialUserChoice.name)) {
                result = `${targetUser} won!`
            }

            if (initialUserChoice.beats.includes(targetUserChoice.name)) {
                result = `${interaction.user} won!`
            }

            if (initialUserChoice.name === targetUserChoice.name) {
                result = `It was a tie!`
            }

            embed.setDescription(
                `${targetUser} picked ${targetUserChoice.name + targetUserChoice.emoji}\n
                ${interaction.user} picked ${initialUserChoice.name + initialUserChoice.emoji}\n
                \n${result}`
            );

            reply.edit({ embeds: [embed], components: [] })

        } catch (error) {
            console.log('Error in rps');
            console.error(error);
        }
    },
}
