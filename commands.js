const Discord = require('discord.js');
const paginationEmbed = require('discord.js-pagination');
const bot = new Discord.Client()
const fetch = require('node-fetch');
const TOKEN = process.env.BOT_TOKEN;
bot.login(TOKEN);
const commands = {
    "!commands": {
        run: function (msg) {
            console.log('listing commands')
            msg.channel.send(`
        Here's what I know how to do:
        !ping: I'll pong your ping. :ping_pong:
        !play rock paper scissors: I'll give you these hands. :scissors:
        !weather [city]: I'll find you a forecast and wish I was there instead of Kamino. :thunder_cloud_rain:
        `)

        }
    },
    "!ping": {
        run: function (msg) {
            msg.reply('pong');
        }
    },
    "!playrps": {
        run: function (msg) {
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
        }
    },
    "!weather": {
        run: async function (msg, arg) {
            await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${arg}&appid=${process.env.WEATHER_KEY}`)
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

    },
    "!drinks": {
        run: async function (msg, arg) {
            console.log('finding drinks.')
            await fetch(` https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${arg}`)
                .then(res => {
                    return res.json();
                })
                .then(parsedDrinks => {
                    msg.reply(`!!
                    Here's some drinks I found that can be made with ${arg}.
                    `)
                    const drinkPages = [];
                    let drinkList = parsedDrinks.drinks;
                    drinkList.forEach(drink => {
                        const drinkEmbed = new Discord.RichEmbed()
                            .setColor('#0099ff')
                            .setTitle(drink.strDrink)
                            .setThumbnail(drink.strDrinkThumb)
                        drinkPages.push(drinkEmbed)
                    })
                    paginationEmbed(msg, drinkPages)
                })
        }
    }

};
exports.commands = commands;