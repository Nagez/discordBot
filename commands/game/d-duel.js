const { ChatInputCommandInteraction, SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const { randomInteger } = require('../../functions/diceFunc.js');
const { generateCanvas, generateDiceCanvas } = require('../../functions/canvasUtil.js');
const { loadImage } = require('canvas');

TIMEOUT = 2_400_000;

module.exports = {
    category: 'game',
    cooldown: 3,
    data: new SlashCommandBuilder()
        .setName('d-duel')
        .setDescription('Challenge a member to a dice rolling duel.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to play with')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('sides')
                .setDescription('The number of sides to the dice')),

    /**
     * @param {ChatInputCommandInteraction} interaction
    */
    async execute(interaction) {

        const targetUser = interaction.options.getUser('user');
        
        if (interaction.user.id === targetUser.id) {
            interaction.reply({ content: 'You can not play with yourself young fellow.', ephemeral: true, });
            return;
        }
        
        let input = interaction.options.getInteger('sides');
        if (!input) {
            input = 20;
        }

        const { canvas, context } = await generateCanvas('images\\wallapaper.jpg', 700, 300);

        context.strokeStyle = '#0099ff';
        context.strokeRect(0, 0, canvas.width, canvas.height);

        context.font = '28px sans-serif';
        context.fillStyle = '#ffffff';
        context.textAlign = "center";
        context.fillText(`${interaction.member.displayName} VS ${targetUser.displayName}`, canvas.width / 2, canvas.height / 5);

        context.globalCompositeOperation = 'source-over';

        const avatar = await loadImage(interaction.user.displayAvatarURL({ extension: 'jpg' }));
        const opponentAvatar = await loadImage(targetUser.displayAvatarURL({ extension: 'jpg' }));

        /*//make avatars round
        context.beginPath();
        context.arc(45, 45, 25, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();

        context.beginPath();
        context.arc(canvas.width - 45, 45, 25, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();
        */

        context.drawImage(avatar, 20, 20, 50, 50);

        context.drawImage(opponentAvatar, canvas.width - 70, 20, 50, 50);

        //add the dices with the results
        result = randomInteger(input)

        margin = 10
        const diceOne = await generateDiceCanvas(result.toString());
        context.drawImage(diceOne.canvas, canvas.width / 2 - diceOne.canvas.width - margin, canvas.height - diceOne.canvas.height - margin)

        result2 = randomInteger(input)

        const diceTwo = await generateDiceCanvas(result2.toString());
        context.drawImage(diceTwo.canvas, canvas.width / 2 + margin, canvas.height - diceOne.canvas.height - margin)

        let winner = result > result2 ? interaction.member.displayName : targetUser.displayName;

        const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'squire-d-duel.png' });

        const yesButton = new ButtonBuilder()
            .setCustomId('yes')
            .setLabel('Yes')
            .setStyle(ButtonStyle.Primary)
        const noButton = new ButtonBuilder()
            .setCustomId('no')
            .setLabel('No')
            .setStyle(ButtonStyle.Secondary)
        const row = new ActionRowBuilder().addComponents(yesButton, noButton);


        const response = await interaction.reply({
            content: `${targetUser} have been challenged to a game of Dice duel by ${interaction.user}.\nWould you like to accept?`,
            components: [row],
        });

        const collectorFilter = i => i.user.id === targetUser.id;
        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

            if (confirmation.customId === 'yes') {
                console.log(`d-duel challenge accepted by ${targetUser.displayName}`)
                await confirmation.update({ files: [attachment] , components: [] });
                await confirmation.followUp({ content: `${winner} is the winner!!` });
            } else if (confirmation.customId === 'no') {
                await confirmation.update({ content: `Duel challenge denied.`, components: [] });
            }
        } catch (error) {
            await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
            console.log(error.message);
        }
        
    }
}