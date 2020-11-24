const Scene = require('telegraf/scenes/base')
const Telegraf = require('telegraf')
const bot = new Telegraf(process.env.bot_token)
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const uri = process.env.uri
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
require('events').EventEmitter.defaultMaxListeners = Infinity;


var askCallData = [
    'ans10', 'ans11', 'ans20', 'ans21', 'ans30', 'ans31', 'ans40', 'ans41', 'ans50', 'ans51', 'ans60', 'ans61', 'ans70', 'ans71', 'ans80', 'ans81', 'ans90', 'ans91',
    'ans100', 'ans101', 'ans110', 'ans111', 'ans120', 'ans121', 'ans130', 'ans131', 'ans140', 'ans141', 'ans150', 'ans151', 'ans160', 'ans161', 'ans170', 'ans171', 'ans180', 'ans181',
    'ans190', 'ans191', 'ans200', 'ans201', 'ans210', 'ans211', 'ans220', 'ans221', 'ans230', 'ans231', 'ans240', 'ans241', 'ans250', 'ans251', 'ans260', 'ans261',
    'ans270', 'ans271', 'ans280', 'ans281', 'ans290', 'ans291', 'ans300', 'ans301', 'ans102', 'ans112', 'ans122', 'ans132', 'ans142', 'ans152', 'ans162', 'ans172', 'ans182', 'ans192',
    'ans202', 'ans212', 'ans212', 'ans222', 'ans232', 'ans242', 'ans252', 'ans262', 'ans272', 'ans282', 'ans292', 'ans302',
] //*масив данных на колбек


class SceneGenerator {
    TestScene() {
        const test = new Scene('test')

        test.enter(async (ctx) => {

            const dbName = "test";

            var smallCount = 0
            var pQs = 0
            var ask = 0
            var cg


            async function bdFirstConection() {
                try {
                    await client.connect();
                    const db = client.db(dbName, {
                        returnNonCachedInstance: true
                    });
                    var col = db.collection("users");

                    var myDoc

                    myDoc = await col.findOne({
                        _id: `${ctx.update.callback_query.from.id}`
                    });

                    if (myDoc != null) {
                        var existingId = myDoc._id
                    } else {
                        var existingId = 0
                    }

                    if (ctx.update.callback_query.from.id != existingId) {
                        let personDocument = {
                            "_id": `${ctx.update.callback_query.from.id}`,
                            "hronoType": `0`,
                            "lastHronoT": 0,
                            "askCounter": 1,
                            "weightCounter": 0,
                            "dolCounter": 0
                        }
                        const p = await col.insertOne(personDocument);
                    }
                    cg = await col.findOne({
                        _id: `${ctx.update.callback_query.from.id}`
                    })
                } catch (err) {
                    console.log(err.stack);
                }
            }
            await bdFirstConection().catch(console.dir); //* первый конект к бд+ сощдание бд если ее нет

            var bigCount = cg.askCounter //* номер вопроса
            var counter = cg.dolCounter //* счетчик по дельфину
            var counterPt2 = cg.weightCounter //* счетчик по всем ост.

            async function getQuesBd() {
                try {
                    if (pQs == 0) {

                        var bdCount = 1
                        var myQues = 0

                        await client.connect();
                        const db = client.db(dbName, {
                            returnNonCachedInstance: true
                        });
                        var col = db.collection("questions");

                        pQs = [1]

                        while (myQues != null) {
                            myQues = await col.findOne({
                                _id: `${bdCount}`
                            });
                            pQs.push(myQues)
                            bdCount++
                        }
                        pQs.pop() //* костыль
                    }
                } catch (err) {
                    console.log(err.stack);
                }
            }
            await getQuesBd().catch(console.dir); //* получение вопросов как массив с объектами

            ask = pQs //* массив  с объектами вопросов

            bot.telegram.sendMessage(ctx.chat.id, ask[bigCount].ques, inlineKeyboard(bigCount, smallCount)) //* выводит вопрос и коавиатуру

            test.action(askCallData, async (ctx) => {
                if ((ctx.match == ('ans300' || 'ans301' || 'ans302')) || bigCount == 31 || counter == 7) {
                    //* если последний вопрос или счетчик дельфина равен 7

                    async function rewrite0BD() {
                        try {
                            await client.connect();
                            const db = client.db(dbName);
                            var col = db.collection("users");

                            var last = await col.findOne({
                                _id: `${ctx.update.callback_query.from.id}`
                            });


                            //* хронотип
                            let trAns =
                                (counterPt2 >= 19 && counterPt2 <= 32) ? (bot.telegram.sendMessage(ctx.chat.id, 'Вы лев. РРРРРРРРР'), 'lion') :
                                (counterPt2 > 32 && counterPt2 < 48) ? (bot.telegram.sendMessage(ctx.chat.id, 'Вы Медведь. Сосите лапу'), 'bear') :
                                (counterPt2 > 47 && counterPt2 < 62) ? (bot.telegram.sendMessage(ctx.chat.id, 'Вы волк. АУууууууф'), 'volf') :
                                (counter == 7) ? (bot.telegram.sendMessage(ctx.chat.id, 'Вы дельфин. Тем самым дельфины доказали, что они самые умные существа на планете'), 'dolfine') : null;

                            //* обнуление счетчиков ~ костыль, но нет
                            counter = 0
                            counterPt2 = 0

                            if (last.hronoType === '0') {
                                var lastHronoT = []
                            } else {
                                var lastHronoT = last.lastHronoT
                                lastHronoT.push(last.hronoType)
                            }

                            col.updateOne({
                                _id: `${ctx.update.callback_query.from.id}`
                            }, {
                                $set: {
                                    "hronoType": `${trAns}`,
                                    "lastHronoT": lastHronoT,
                                    "askCounter": 1,
                                    "weightCounter": 0,
                                    "dolCounter": 0
                                },
                            }, {
                                multi: true
                            })
                        } catch (err) {
                            console.log(err.stack);
                        } finally {
                            await client.close();
                        }
                    }
                    rewrite0BD().catch(console.dir); //* перезапись бд после получения нужного хронотипа

                    ctx.scene.leave()
                } else {
                    async function newBdParams() {
                        try {
                            await client.connect();
                            const db = client.db(dbName);
                            var col = db.collection("users");

                            var last = await col.findOne({
                                _id: `${ctx.update.callback_query.from.id}`
                            });

                            bigCount = last.askCounter
                            counter = last.dolCounter
                            counterPt2 = last.weightCounter
                            if (bigCount <= 10) {
                                if (ctx.match[ctx.match.length - 1] === '0') {
                                    counter += ask[bigCount].weight
                                }
                            }
                            if (bigCount > 10) {
                                counterPt2 += ask[bigCount].weight[ctx.match[ctx.match.length - 1]]
                            }

                            var askCounter = last.askCounter + 1

                            col.updateOne({
                                _id: `${ctx.update.callback_query.from.id}`
                            }, {
                                $set: {
                                    "askCounter": askCounter,
                                    "dolCounter": counter,
                                    "weightCounter": counterPt2
                                },
                            }, {
                                upsert: true,
                                multi: true
                            })
                        } catch (err) {
                            console.log(err.stack);
                        }
                    }
                    await newBdParams().catch(console.dir); //* апдейт всех каунтеров и весов

                    ctx.scene.reenter();
                }

                //*этот огромный test.action принимает колбек дату , смотрит не последний ли это вопрос(если это так, то говорит какой ты зверь),  затем стоит контрукция ифов которая
                //* прибавляет нужным счетчикам значения весов, чтобы определить  какой ты зверь) мб эта конструкция карявая и при желании можно переписать 

            })

            function createButton(big, small, opt) {
                smallCount++
                if (opt) {
                    // bigCount++
                    smallCount = 0
                }
                return ({
                    text: ask[big].vars[small],
                    callback_data: ask[big].action_data + small
                })
            }

            function inlineKeyboard(count1, count2) {
                switch (ask[count1].vars.length) {
                    case 2:
                        return {
                            reply_markup: {
                                inline_keyboard: [
                                    [createButton(count1, count2),
                                        createButton(count1, count2 + 1, 'Привет кодер')
                                    ],
                                ]
                            }

                        }
                        break
                    case 3:
                        return {
                            reply_markup: {
                                inline_keyboard: [
                                    [createButton(count1, count2)],
                                    [createButton(count1, count2 + 1)],
                                    [createButton(count1, count2 + 2, 'тебя попросили оценить демку?)')]
                                ]
                            }


                        }
                        break
                    case 4:
                        return {
                            reply_markup: {
                                inline_keyboard: [
                                    [createButton(count1, count2),
                                        createButton(count1, count2 + 1, )
                                    ],
                                    [createButton(count1, count2 + 2),
                                        createButton(count1, count2 + 3, '<Matheu042@outlook.com> Матвей:) Знаю же что не грамотная совсем!!!')
                                    ]
                                ]
                            }
                        }
                        break

                }
            }
        })

        return test
    }
}

module.exports = SceneGenerator








const Scene = require('telegraf/scenes/base')
const Telegraf = require('telegraf')
const bot = new Telegraf(process.env.bot_token)
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const uri = process.env.uri
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
require('events').EventEmitter.defaultMaxListeners = Infinity;


var askCallData = [
    'ans10', 'ans11', 'ans20', 'ans21', 'ans30', 'ans31', 'ans40', 'ans41', 'ans50', 'ans51', 'ans60', 'ans61', 'ans70', 'ans71', 'ans80', 'ans81', 'ans90', 'ans91',
    'ans100', 'ans101', 'ans110', 'ans111', 'ans120', 'ans121', 'ans130', 'ans131', 'ans140', 'ans141', 'ans150', 'ans151', 'ans160', 'ans161', 'ans170', 'ans171', 'ans180', 'ans181',
    'ans190', 'ans191', 'ans200', 'ans201', 'ans210', 'ans211', 'ans220', 'ans221', 'ans230', 'ans231', 'ans240', 'ans241', 'ans250', 'ans251', 'ans260', 'ans261',
    'ans270', 'ans271', 'ans280', 'ans281', 'ans290', 'ans291', 'ans300', 'ans301', 'ans102', 'ans112', 'ans122', 'ans132', 'ans142', 'ans152', 'ans162', 'ans172', 'ans182', 'ans192',
    'ans202', 'ans212', 'ans212', 'ans222', 'ans232', 'ans242', 'ans252', 'ans262', 'ans272', 'ans282', 'ans292', 'ans302',
] //*масив данных на колбек


class SceneGenerator {
    TestScene() {
        const test = new Scene('test')

        test.enter(async (ctx) => {

            const dbName = "test";

            var smallCount = 0
            var pQs = 0
            var ask = 0
            var cg


            async function bdFirstConection() {
                try {
                    await client.connect();
                    const db = client.db(dbName, {
                        returnNonCachedInstance: true
                    });
                    var col = db.collection("users");

                    var myDoc

                    myDoc = await col.findOne({
                        _id: `${ctx.update.callback_query.from.id}`
                    });

                    if (myDoc != null) {
                        var existingId = myDoc._id
                    } else {
                        var existingId = 0
                    }

                    if (ctx.update.callback_query.from.id != existingId) {
                        let personDocument = {
                            "_id": `${ctx.update.callback_query.from.id}`,
                            "hronoType": `0`,
                            "lastHronoT": 0,
                            "askCounter": 1,
                            "weightCounter": 0,
                            "dolCounter": 0
                        }
                        const p = await col.insertOne(personDocument);
                    }
                    cg = await col.findOne({
                        _id: `${ctx.update.callback_query.from.id}`
                    })
                } catch (err) {
                    console.log(err.stack);
                }
            }
            await bdFirstConection().catch(console.dir); //* первый конект к бд+ сощдание бд если ее нет

            var bigCount = cg.askCounter //* номер вопроса
            var counter = cg.dolCounter //* счетчик по дельфину
            var counterPt2 = cg.weightCounter //* счетчик по всем ост.

            async function getQuesBd() {
                try {
                    if (pQs == 0) {

                        var bdCount = 1
                        var myQues = 0

                        await client.connect();
                        const db = client.db(dbName, {
                            returnNonCachedInstance: true
                        });
                        var col = db.collection("questions");

                        pQs = [1]

                        while (myQues != null) {
                            myQues = await col.findOne({
                                _id: `${bdCount}`
                            });
                            pQs.push(myQues)
                            bdCount++
                        }
                        pQs.pop() //* костыль
                    }
                } catch (err) {
                    console.log(err.stack);
                }
            }
            await getQuesBd().catch(console.dir); //* получение вопросов как массив с объектами

            ask = pQs //* массив  с объектами вопросов 

            bot.telegram.sendMessage(ctx.chat.id, ask[bigCount].ques, inlineKeyboard(bigCount, smallCount)) //* выводит вопрос и коавиатуру

           
test.action(askCallData, async (ctx) => {
    rewrite0BD().catch(console.dir); //* перезапись бд после получения нужного хронотипа

        async function rewrite0BD() {
            try {
                await client.connect();
                const db = client.db(dbName);
                var col = db.collection("users");

                var last = await col.findOne({
                    _id: `${ctx.update.callback_query.from.id}`
                });

                if ((ctx.match == ('ans300' || 'ans301' || 'ans302')) || last.askCounter == 31 || last.dolCounter == 7) {
                    //* если последний вопрос или счетчик дельфина равен 7


                //* хронотип
                let trAns =
                    (counterPt2 >= 19 && counterPt2 <= 32) ? (bot.telegram.sendMessage(ctx.chat.id, 'Вы лев. РРРРРРРРР'), 'lion') :
                    (counterPt2 > 32 && counterPt2 < 48) ? (bot.telegram.sendMessage(ctx.chat.id, 'Вы Медведь. Сосите лапу'), 'bear') :
                    (counterPt2 > 47 && counterPt2 < 62) ? (bot.telegram.sendMessage(ctx.chat.id, 'Вы волк. АУууууууф'), 'volf') :
                    (counter == 7) ? (bot.telegram.sendMessage(ctx.chat.id, 'Вы дельфин. Тем самым дельфины доказали, что они самые умные существа на планете'), 'dolfine') : null;

                //* обнуление счетчиков ~ костыль, но нет
                counter = 0
                counterPt2 = 0

                if (last.hronoType === '0') {
                    var lastHronoT = []
                } else {
                    var lastHronoT = last.lastHronoT
                    lastHronoT.push(last.hronoType)
                }

                col.updateOne({
                    _id: `${ctx.update.callback_query.from.id}`
                }, {
                    $set: {
                        "hronoType": `${trAns}`,
                        "lastHronoT": lastHronoT,
                        "askCounter": 1,
                        "weightCounter": 0,
                        "dolCounter": 0
                    },
                }, {
                    multi: true
                })
                ctx.scene.leave()
            }else{

                bigCount = last.askCounter
                counter = last.dolCounter
                counterPt2 = last.weightCounter
                if (bigCount <= 10) {
                    if (ctx.match[ctx.match.length - 1] === '0') {
                        counter += ask[bigCount].weight
                    }
                }
                if (bigCount > 10) {
                    counterPt2 += ask[bigCount].weight[ctx.match[ctx.match.length - 1]]
                }

                var askCounter = last.askCounter + 1

                col.updateOne({
                    _id: `${ctx.update.callback_query.from.id}`
                }, {
                    $set: {
                        "askCounter": askCounter,
                        "dolCounter": counter,
                        "weightCounter": counterPt2
                    },
                }, {
                    upsert: true,
                    multi: true
                })
                ctx.scene.reenter();
            }
            } catch (err) {
                console.log(err.stack);
            } finally {
                await client.close();
            }
        }
        

       
    

    //*этот огромный test.action принимает колбек дату , смотрит не последний ли это вопрос(если это так, то говорит какой ты зверь),  затем стоит контрукция ифов которая
    //* прибавляет нужным счетчикам значения весов, чтобы определить  какой ты зверь) мб эта конструкция карявая и при желании можно переписать 

})

            function createButton(big, small, opt) {
                smallCount++
                if (opt) {
                    // bigCount++
                    smallCount = 0
                }
                return ({
                    text: ask[big].vars[small],
                    callback_data: ask[big].action_data + small
                })
            }

            function inlineKeyboard(count1, count2) {
                switch (ask[count1].vars.length) {
                    case 2:
                        return {
                            reply_markup: {
                                inline_keyboard: [
                                    [createButton(count1, count2),
                                        createButton(count1, count2 + 1, 'Привет кодер')
                                    ],
                                ]
                            }

                        }
                        break
                    case 3:
                        return {
                            reply_markup: {
                                inline_keyboard: [
                                    [createButton(count1, count2)],
                                    [createButton(count1, count2 + 1)],
                                    [createButton(count1, count2 + 2, 'тебя попросили оценить демку?)')]
                                ]
                            }


                        }
                        break
                    case 4:
                        return {
                            reply_markup: {
                                inline_keyboard: [
                                    [createButton(count1, count2),
                                        createButton(count1, count2 + 1, )
                                    ],
                                    [createButton(count1, count2 + 2),
                                        createButton(count1, count2 + 3, '<Matheu042@outlook.com> Матвей:) Знаю же что не грамотная совсем!!!')
                                    ]
                                ]
                            }
                        }
                        break

                }
            }
        })

        return test
    }
}

module.exports = SceneGenerator
