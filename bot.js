require('dotenv').config();
const Discord = require('discord.js');
const axios = require('axios');
const fetch = require('node-fetch');
const bot = new Discord.Client();
const TOKEN = process.env.BOT_TOKEN;
bot.login(TOKEN);

/* Boot up */
bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
})

/* Commands */
bot.on('message', msg => {
    if (msg.content === '!commands') {
        msg.channel.send(`
        Here's what I know how to do:
        !ping: I'll pong your ping. :ping_pong:
        !play rock paper scissors: I'll give you these hands. :scissors:
        !weather [city]: I'll find you a forecast and wish I was there instead of Kamino. :thunder_cloud_rain:
        `)
    }
})

/* Ping Pong */
bot.on('message', (msg) => {
    if (msg.content === '!ping') {
        msg.reply('pong');
    }
});

/* Rock Paper Scissors */
bot.on('message', msg => {
    if (msg.content === '!play rock paper scissors') {
        msg.reply(`I'm ready to go on..`)
        setTimeout(() => {
            msg.reply('3')
        }, 1000)
        setTimeout(() => {
            msg.reply('2')
        }, 2000)
        setTimeout(() => {
            msg.reply('1')
        }, 3000)
        setTimeout(() => {
            let botMove = Math.floor(Math.random() * 3);
            if (botMove === 0) msg.reply('I chose rock. :black_circle:')
            else if (botMove === 1) msg.reply('I chose paper. :scroll:')
            else msg.reply('I chose scissors. :scissors:')
        }, 4000)

    }
})

/* Get Weather */
bot.on('message', async msg => {
    if (msg.content.split(" ")[0].includes('!weather')) {
        const userCity = msg.content.split(" ")[1];
        await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${userCity}&appid=${process.env.WEATHER_KEY}`)
            .then(res => {
                return res.json();
            })
            .then(parsedWeather => {
                msg.reply(`
                Here's what I could find,
                Location: ${parsedWeather.name}, ${parsedWeather.sys.country}
                Forecast: ${parsedWeather.weather[0].main}
                Current Temp: ${(Math.round(((parsedWeather.main.temp - 273.15) * 9 / 5 + 32)))}° F
                Today's High: ${(Math.round(((parsedWeather.main.temp_max - 273.15) * 9 / 5 + 32)))}° F
                Today's Low: ${(Math.round(((parsedWeather.main.temp_min - 273.15) * 9 / 5 + 32)))}° F
                `
                )
            })
    }
});

/* Thank you */
bot.on('message', msg => {
    if (msg.content.split(" ")[0] === 'thx' || msg.content.split(" ")[0] === 'thanks' || msg.content.split(" ")[0] === 'thank you') {
        const response = Math.floor(Math.random() * 2);
        if (response == 0) msg.reply('I have spoken.')
        else msg.reply('This is the way.')

    }
})


