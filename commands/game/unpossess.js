const { SlashCommandBuilder } = require('discord.js');

const replys = ["Wow, that was a wild one to possess!", "That one tastes purple.", "Sheesh, glad this is over.", "Did NOT like this one, woof", "Noo, I wanted more!!", "Annnd I'm out", "Unpossessed!", "I enjoyed this one.", "I quite liked this one.", "Back to being a ghost.", "Finaly! some fresh air.", "Back to normal.", "UGHH, this is the last time I'm possessing someone without streching first.", "I.. I've seen too much..", "That was kind of sick!"];

module.exports = {
    category: 'game',
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('unpossess')
        .setDescription('Go back to being Squire! The Spooky Ghost')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Optionaly give the bot a new name.')
                .setRequired(false)
        ),
    async execute(interaction) {
        if (!interaction.member.permissions.has('MANAGE_NICKNAMES')) {
            await interaction.reply('You can not manage nickNames.');
            return;
        }
        try {
            await interaction.guild.members.client.user.setAvatar('images/squireProfile.jpg');

            const inputName = interaction.options.getString("name")
            if (inputName) {
                console.log('Changing bot nickname to ' + inputName)
                await interaction.guild.members.me.setNickname(inputName);
            } else {
                await interaction.guild.members.me.setNickname('Squire! The Spooky Ghost')
            }
            const randomReply = replys[Math.floor(Math.random() * replys.length)];
            await interaction.reply(randomReply);
        } catch (error) {
            console.error(error);
            await interaction.reply(`I could not unpossess because: \`${error.message}\``);
        }


    }

};