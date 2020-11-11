const Telegraf = require('telegraf')
const telegram = require('telegraf');
const markup = require('telegraf/markup');
const {
    Stage,
    session
} = Telegraf
require('dotenv').config()
const bot = new Telegraf(process.env.bot_token)
const SceneGenerator = require('./Scenes')
const curScene = new SceneGenerator()
const testScene = curScene.TestScene()

const stage = new Stage([testScene])

bot.use(session())
bot.use(stage.middleware())

var bigCount = 1
var smallCount = 0
var count = 0


function createButton(big, small, opt) {
    smallCount++
    if (opt) {
        bigCount++
        smallCount = 0
    }
    if (small == 0) {
        count += ask[big].weight
    }
    return ({
        text: ask[big].vars[small],
        callback_data: ask[big].action_data + small
    })
}

function inlineKeyboard(count1, count2) {
    return {
        reply_markup: {
            inline_keyboard: [
                [createButton(count1, count2),
                    createButton(count1, count2 + 1, 'brah')
                ]
            ]
        }
    }

}


bot.start((ctx) => {
    bot.telegram.sendMessage(ctx.chat.id, `Известный сомнолог Майкл Бреус выделяет четыре основных хронотипа: Дельфин, Лев, Медведь и Волк. С помощью несложного теста вы сможете быстро определить, кто вы, и узнать рекомендации по необходимому лично вам распорядку дня: когда лучше вставать, когда ложиться спать, когда завтракать-обедать-ужинать, когда заниматься спортом, а когда умственным трудом, и т.д. Майкл Бреус уверяет, что если вы будете жить в соответствии со своим хронотипом, у вас будет хорошее самочувствие и прекрасное настроение. \n Хочешь начть тест?`, {
        reply_markup: {
            inline_keyboard: [
                [{
                        text: 'да',
                        callback_data: 'answerStr'
                    },
                ],
            ],
        }
    }, )
})


bot.action('answerStr', async (ctx) => {
    bot.telegram.sendMessage(ctx.chat.id, await 'поехали!!!', ctx.scene.enter('test'))
})


bot.launch();