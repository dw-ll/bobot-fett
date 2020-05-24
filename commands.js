const Discord = require('discord.js');
const paginationEmbed = require('discord.js-pagination');
const bot = new Discord.Client()
const fetch = require('node-fetch');
const axios = require('axios');
const wordToken = process.env.DICT_KEY;
const TOKEN = process.env.BOT_TOKEN;
bot.login(TOKEN);
const commands = {
    "!commands": {
        run: function (msg) {
            const commandEmbed = new Discord.RichEmbed()
                .setColor('#0099ff')
                .setTitle('Commands')
                .addField('!ping', `I'll pong your ping. :ping_pong:`, false)
                .addField('!playrps', ` I'll give you these hands. :white_circle: :scroll: :scissors:`, false)
                .addField('!weather [city]', `I'll find you a forecast and wish I was there instead of Kamino. :thunder_cloud_rain:`, false)
                .addField('!drinks [alcohol]', `I'll find some cocktails that you can make with your poison of choice. :cocktail:`, false)
                .addField('!define [word]', `I'll look up a word for you. :book:`, false)

            msg.reply(commandEmbed)
        }
    },
    "!ping": {
        run: function (msg) {
            msg.reply('pong');
        }
    },
    "!playrps": {
        run: function (msg) {

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
    },
    "!weather": {
        run: async function (msg, arg) {
            await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${arg}&appid=${process.env.WEATHER_KEY}`)
                .then(res => {
                    return res.json();
                })
                .then(parsedWeather => {
                    console.log(parsedWeather)
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
    },
    "!define": {
        run: async function (msg, word) {
            await axios({
                "method": "GET",
                "url": `https://wordsapiv1.p.rapidapi.com/words/${word}`,
                "headers": {
                    "content-type": "application/octet-stream",
                    "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
                    "x-rapidapi-key": wordToken,
                    "useQueryString": true
                }
            })
                .then((response) => {
                    return response;
                })
                .then(parsedDefinition => {
                    let parsedDefinitionLength = parsedDefinition.data.results.length;
                    const definitionedEmbed = new Discord.RichEmbed()
                        .setColor('#0099ff')
                        .setTitle(word)
                        .addField('Pronunciation', parsedDefinition.data.pronunciation.all, false)
                        .addBlankField(false)
                    for (var i = 0; i < parsedDefinitionLength / 4 - 1; ++i) {
                        definitionedEmbed.addField(parsedDefinition.data.results[i].partOfSpeech, parsedDefinition.data.results[i].definition, false)
                        if (parsedDefinition.data.results[i].synonyms) {
                            definitionedEmbed.addField('Synonyms', parsedDefinition.data.results[i].synonyms.toString(), false)
                        }
                        definitionedEmbed.addBlankField(false)
                    }
                    definitionedEmbed.addField(parsedDefinition.data.results[i + 1].partOfSpeech, parsedDefinition.data.results[i + 1].definition, false)
                    if (parsedDefinition.data.results[i + 1].synonyms) {
                        definitionedEmbed.addField('Synonyms', parsedDefinition.data.results[i + 1].synonyms.toString(), false)
                    }
                    msg.reply(definitionedEmbed)
                })
                .catch((error) => {
                    console.log(error)
                    let errorEmbed = new Discord.RichEmbed()
                        .setColor('#0099ff')
                        .setTitle(`I couldn't find ${word}, sorry about that.`)
                        .setDescription(`:pleading_face:`)
                    msg.reply(errorEmbed)

                })
        }
    }

};
exports.commands = commands;