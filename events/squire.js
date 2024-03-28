const { Events } = require('discord.js');

const nickNames = ["Master", "Sire", "Lord", "Liege", "Guide", "Leader", "Protector"];
const honoraryNames = ["Noble", "Esteemed", "Honored", "Respected", "Revered", "Gallant", "Illustrious", "Distinguished", "Valiant", "Exemplary"];

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        
        if (message.content.toLowerCase() === `squire!`) {
            // Send a message to the same channel
            const randomNick = nickNames[Math.floor(Math.random() * nickNames.length)];
            const randomHonorary = honoraryNames[Math.floor(Math.random() * honoraryNames.length)];

            await message.channel.send('Did you call me, ' + message.member.displayName + ', my ' + randomHonorary + ' ' + randomNick + '?'); // You can customize the message here

        }
    },
};