const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { randomInteger } = require('../../functions/diceFunc.js');
const { createCanvas, Image } = require('canvas');
const { readFile } = require('fs/promises');

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

        if (result == 20) {
            await interaction.followUp({ content: 'https://tenor.com/view/nat-20-baldur%27s-gate-baldur%27s-gate-3-critical-sucess-gif-14789122616741343796' })
        }
        else if (result == 1) {
            await interaction.followUp({ content: 'https://tenor.com/view/critical-failure-baldur%27s-gate-3-dice-dice-roll-critical-gif-16389621355368608807' });
        } else {
            //await interaction.followUp({ files: ['images/d20.png'] });

            const canvas = createCanvas(200, 200);
            const context = canvas.getContext('2d');

            const background = await readFile('images/d20.png');
            const backgroundImage = new Image();
            backgroundImage.src = background;
            context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

            context.fillStyle = '#ffffff';
            context.font = '60px sans'//applyText(canvas,result);
            context.textAlign = "center";
            context.fillText(result, canvas.width / 2.05, canvas.height / 1.65);
            context.strokeText(result, canvas.width / 2.05, canvas.height / 1.65);

            const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'profile-image.png' });

            await interaction.followUp({ files: [attachment] });
        }
    }
}        