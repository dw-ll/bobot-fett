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
    if (msg.content.split(" ")[0] === '!weather') {
        var command = msg.content.split(" ")[0]
        var weatherArg = msg.content.split(" ")[1];
        commands.commands[command].run(msg, weatherArg);

    } else if (msg.content.split(" ")[0] === '!drinks') {
        var command = msg.content.split(" ")[0]
        var drinkArg = msg.content.split(" ")[1];
        commands.commands[command].run(msg, drinkArg);
    }
    else {
        var command = msg.content
        if (commands.commands.hasOwnProperty(command)) {
            console.log("Command:", command)
            commands.commands[command].run(msg);
        }
    }
})
