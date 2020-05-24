require('dotenv').config();
const commands = require('./commands');
const Discord = require('discord.js');
const axios = require('axios');
const bot = new Discord.Client();
const TOKEN = process.env.BOT_TOKEN;
bot.login(TOKEN);

/* Boot up */
bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
})

/* Handle Commands */
bot.on('message', msg => {
    if (msg.content.split(" ").length > 1 && commands.commands.hasOwnProperty(msg.content.split(" ")[0])) {
        var command = msg.content.split(" ")[0]
        var arg = msg.content.split(" ")[1];
        commands.commands[command].run(msg, arg);
    } else if ((msg.content.includes('thanks') || msg.content.includes('thx') || msg.content.includes('thank you'))
        && (msg.content.includes('bobot') || msg.content.includes('bobot fett') || msg.content.includes('fett'))) {
        const phrase = Math.floor(Math.random * 2)
        if (phrase === 0) msg.reply('i have spoken.')
        else msg.reply('this is the way.')
    }
    else {
        var command = msg.content
        if (commands.commands.hasOwnProperty(command)) {
            console.log("Command:", command)
            commands.commands[command].run(msg);
        }
    }
})
