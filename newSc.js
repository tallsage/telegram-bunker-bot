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



class SceneGenerator {
    TestScene() {
        const test = new Scene('test')

        test.enter(async (ctx) => {
            console.log('reenter');
            const dbName = "test";

            var smallCount = 0
            var pQs = 0
            var cg


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
                    // console.log(err.stack);
                }
            }
            await getQuesBd().catch(console.dir); //* получение вопросов как массив с объектами


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
                    // console.log(err.stack);
                }
            }
            await bdFirstConection().catch(console.dir); //* первый конект к бд+ сощдание бд если ее нет

            var bigCount = cg.askCounter //* номер вопроса
            var counter = cg.dolCounter //* счетчик по дельфину
            var counterPt2 = cg.weightCounter //* счетчик по всем ост.
            var ask = pQs //* массив  с объектами вопросов 

            if (bigCount == 31 || counter == 7){
                bot.telegram.sendMessage(ctx.chat.id, 'завершить тест',{
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                    text: 'да',
                                    callback_data: 'lastAskCallback'
                                },
                            ],
                        ],
                    }
                }) //* выводит вопрос и коавиатуру

                test.action('lastAskCallback', async (ctx) => {
                    rewrite0BD().catch(console.dir); //* перезапись бд после получения нужного хронотипа
                
                    async function rewrite0BD() {
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
                                        
                            } catch (err) {
                                // console.log(err.stack);
                            } finally {
                                await client.close();
                            }
                        }
                    
                    //*этот огромный test.action принимает колбек дату , смотрит не последний ли это вопрос(если это так, то говорит какой ты зверь),  затем стоит контрукция ифов которая
                    //* прибавляет нужным счетчикам значения весов, чтобы определить  какой ты зверь) мб эта конструкция карявая и при желании можно переписать 
                
                })
            }else{
                await bot.telegram.sendMessage(ctx.chat.id, ask[bigCount].ques, inlineKeyboard(bigCount, smallCount)) //* выводит вопрос и коавиатуру
                
                var askCallData = ['0', '1', '2']
                test.action(askCallData, async (ctx) => {
                    async function rewriteReBD() {
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
                                if (ctx.match[ctx.match.length - 1] === '1') {
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
                        
                        } catch (err) {
                            // console.log(err.stack);
                        } finally {
                            await client.close();
                        }
                    }
                    rewriteReBD().catch(console.dir)
                })
            }
                 

            function createButton(big, small, opt) {
                smallCount++
                console.log(smallCount);
                if (opt) {
                    // bigCount++
                    smallCount = 0
                }
                return ({
                    text: ask[big].vars[small],
                    callback_data: `${smallCount}`
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