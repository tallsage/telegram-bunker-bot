const Scene = require('telegraf/scenes/base')
const Telegraf = require('telegraf')
const bot = new Telegraf(process.env.bot_token)

var ask = {
    1: {
        ques: 'Я не могу заснуть или просыпаюсь от малейшего звука или света',
        weight: 1,
        vars: ['да', 'нет'],
        action_data: 'ans1'
    },
    2: {
        ques: 'Еда — не самая большая моя страсть',
        weight: 1,
        vars: ['да', 'нет'],
        action_data: 'ans2'
    },
    3: {
        ques: 'Обычно я просыпаюсь до будильника',
        weight: 1,
        vars: ['да', 'нет'],
        action_data: 'ans3'
    },
    4: {
        ques: `Я не могу спать в самолете, даже в берушах и маске для сна`,
        weight: 1,
        vars: ['да', 'нет'],
        action_data: 'ans4'
    },
    5: {
        ques: 'В состоянии усталости я больше раздражаюсь',
        weight: 1,
        vars: ['да', 'нет'],
        action_data: 'ans5'
    },
    6: {
        ques: 'Я слишком беспокоюсь по мелочам',
        weight: 1,
        vars: ['да', 'нет'],
        action_data: 'ans6'
    },
    7: {
        ques: 'У меня бессонница',
        weight: 1,
        vars: ['да', 'нет'],
        action_data: 'ans7'
    },
    8: {
        ques: 'В школе я переживал из-за оценок',
        weight: 1,
        vars: ['да', 'нет'],
        action_data: 'ans8'
    },
    9: {
        ques: 'Перед сном я перебираю случившееся в прошлом и возможные события будущего',
        weight: 1,
        vars: ['да', 'нет'],
        action_data: 'ans9'
    },
    10: {
        ques: 'Я перфекционист',
        weight: 1,
        vars: ['да', 'нет'],
        action_data: 'ans10'
    },
    11: {
        ques: 'На следующий день у вас нет запланированных занятий и вы можете позволить себе спать столько, сколько захочется. Когда вы проснетесь?',
        weight: [1, 2, 3],
        vars: ['До 6.30', 'Между 6.30 и 8.45', 'После 8.45'],
        action_data: 'ans11'
    },
    12: {
        ques: 'Требуется ли вам будильник, чтобы встать в определенное время?',
        weight: [1, 2, 3],
        vars: [`В этом нет необходимости. Вы сами проснетесь в нужное время`, 'Да, используете,  с одним повтором или без', 'Да, используете и ставите\n еще один запасной и много повторов'],
        action_data: 'ans12'
    },
    13: {
        ques: 'Во сколько вы просыпаетесь в выходной день?',
        weight: [1, 2, 3],
        vars: ['В то же время, что и в рабочий', 'На 45–90 минут позже, чем в рабочий день', 'На 90 или более минут позже, чем в рабочий день'],
        action_data: 'ans13'
    },
    14: {
        ques: 'Как вы переносите смену часовых поясов?',
        weight: [1, 2, 3],
        vars: ['Тяжело, независимо от обстоятельств', 'Адаптируетесь в течение 48 часов', 'Адаптируетесь очень быстро, особенно перемещаясь на запад'],
        action_data: 'ans14'
    },
    15: {
        ques: 'Ваш любимый прием пищи? (Имеет значение время, а не меню)',
        weight: [1, 2, 3],
        vars: ['Завтрак', 'Обед', 'Ужин'],
        action_data: 'ans15'
    },
    16: {
        ques: 'Если бы вам снова предстояло сдавать экзамен, каким было бы предпочтительное время начала, чтобы сдать его с максимальными вниманием и концентрацией (а не просто как-нибудь)?',
        weight: [1, 2, 3],
        vars: ['Рано утром', 'Вскоре после полудня', 'В середине дня'],
        action_data: 'ans16'
    },
    17: {
        ques: 'Какое вы выбрали бы время для интенсивной физической нагрузки?',
        weight: [1, 2, 3],
        vars: ['До 8.00', 'Между 8.00 и 16.00', 'После 16.00'],
        action_data: 'ans17'
    },
    18: {
        ques: 'Когда вы наиболее активны?',
        weight: [1, 2, 3],
        vars: ['Через час-два после пробуждения', 'Через два-четыре часа после пробуждения', 'Через четыре-шесть часов после пробуждения'],
        action_data: 'ans18'
    },
    19: {
        ques: 'Если бы вы сами могли выбирать режим пятичасового рабочего дня, какой период времени вы бы предпочли?',
        weight: [1, 2, 3],
        vars: ['С 4.00 до 9.00', 'С 9.00 до 14.00', 'С 16.00 до 21.00'],
        action_data: 'ans19'
    },
    20: {
        ques: 'Вы считаете свой тип мышления…',
        weight: [1, 2, 3],
        vars: ['Левополушарным — у вас аналитическое и стратегическое мышление', 'У вас сбалансированное мышление', 'Правополушарным — творческой личностью, склонной к озарениям'],
        action_data: 'ans20'
    },
    21: {
        ques: 'Вы спите днем?',
        weight: [1, 2, 3],
        vars: ['Никогда', 'Иногда в выходные', 'Если вы вздремнете, то потом не уснете всю ночь'],
        action_data: 'ans21'
    },
    22: {
        ques: 'Если бы вам предстояло два часа заниматься тяжелым физическим трудом, например, переставлять мебель или рубить дрова, в какой период времени вы были бы максимально эффективны, а занятие — безопасно (а не просто чтобы побыстрее покончить с ним)?',
        weight: [1, 2, 3],
        vars: ['С 8.00 до 10.00', 'С 11.00 до 13.00', 'С 18.00 до 20.00'],
        action_data: 'ans22'
    },
    23: {
        ques: 'С каким утверждением вы согласитесь?',
        weight: [1, 2, 3],
        vars: ['«Я придерживаюсь здорового образа жизни всегда» ', '«Я принимаю подобные решения иногда»', '«Здоровый образ жизни дается мне с трудом»'],
        action_data: 'ans23'
    },
    24: {
        ques: 'Какой уровень риска для вас приемлем?',
        weight: [1, 2, 3],
        vars: ['Низкий', 'Средний', 'Высокий'],
        action_data: 'ans24'
    },
    25: {
        ques: 'Вы считаете, что…',
        weight: [1, 2, 3],
        vars: ['Настроены на будущее, у вас большие планы и четкие цели', 'Вы набрались опыта, с надеждой смотрите в будущее, но предпочитаете жить здесь и сейчас', 'Вы ориентированы на настоящее. Имеет значение только то, что хорошо сейчас'],
        action_data: 'ans25'
    },
    26: {
        ques: 'Как бы вы охарактеризовали себя как студента?',
        weight: [1, 2, 3],
        vars: ['Блестящий', 'Усидчивый', 'Нерадивый'],
        action_data: 'ans26'
    },
    27: {
        ques: 'Утром вы просыпаетесь…',
        weight: [1, 2, 3],
        vars: ['Трезвомыслящим', 'В тумане, но соображаете', 'Усталым, веки будто свинцовые'],
        action_data: 'ans27'
    },
    28: {
        ques: 'Какой у вас аппетит в течение получаса после пробуждения?',
        weight: [1, 2, 3],
        vars: ['Сильный голод', 'Голод', 'Полное отсутствие голода'],
        action_data: 'ans28'
    },
    29: {
        ques: 'Как часто вы испытываете симптомы бессонницы?',
        weight: [1, 2, 3],
        vars: ['Редко, только при адаптации в другом часовом пояс', 'Во время жизненных трудностей или стресса', 'Хронически. Бывает периодами'],
        action_data: 'ans29'
    },
    30: {
        ques: 'Насколько вы удовлетворены жизнью?',
        weight: [0, 2, 4],
        vars: ['Совершенно удовлетворен ', 'Вполне удовлетворен', 'Не удовлетворен'],
        action_data: 'ans30'
    },
}  //?масив вопросов
var askCallData = [
    'ans10', 'ans11', 'ans20', 'ans21', 'ans30', 'ans31', 'ans40', 'ans41', 'ans50', 'ans51', 'ans60', 'ans61', 'ans70', 'ans71', 'ans80', 'ans81', 'ans90', 'ans91',
    'ans100', 'ans101', 'ans110', 'ans111', 'ans120', 'ans121', 'ans130', 'ans131', 'ans140', 'ans141', 'ans150', 'ans151', 'ans160', 'ans161', 'ans170', 'ans171', 'ans180', 'ans181',
    'ans190', 'ans191', 'ans200', 'ans201', 'ans210', 'ans211', 'ans220', 'ans221', 'ans230', 'ans231', 'ans240', 'ans241', 'ans250', 'ans251', 'ans260', 'ans261',
    'ans270', 'ans271', 'ans280', 'ans281', 'ans290', 'ans291', 'ans300', 'ans301', 'ans102', 'ans112', 'ans122', 'ans132', 'ans142', 'ans152', 'ans162', 'ans172', 'ans182', 'ans192',
    'ans202', 'ans212', 'ans212', 'ans222', 'ans232', 'ans242', 'ans252', 'ans262', 'ans272', 'ans282', 'ans292', 'ans302',
] //?масив данных на колбек

var bigCount = 1
var smallCount = 0
var counter = 0
var counterPt2 = 0

class SceneGenerator {
    TestScene() {
        const test = new Scene('test')
        test.enter((ctx) => {
            bot.telegram.sendMessage(ctx.chat.id, ask[bigCount].ques, inlineKeyboard(bigCount, smallCount)) //? выводит вопрос и коавиатуру
            test.action(askCallData, (ctx) => {
                if ((ctx.match == ('ans300' || 'ans301' || 'ans302'))|| bigCount == 31|| counter == 7) {
                    
                    let trAns = 
                        (counterPt2 >= 19 && counterPt2 <= 32)? bot.telegram.sendMessage(ctx.chat.id, 'Вы лев. РРРРРРРРР'):
                        (counterPt2 >32 && counterPt2 < 48)? bot.telegram.sendMessage(ctx.chat.id, 'Вы Медведь. Сосите лапу'):
                        (counterPt2 > 47 && counterPt2 < 62)? bot.telegram.sendMessage(ctx.chat.id, 'Вы волк. АУууууууф'):
                        (counter ==7)? bot.telegram.sendMessage(ctx.chat.id, 'Вы дельфин. Тем самым дельфины доказали, что они самые умные существа на планете'): null;

                    ctx.scene.leave()
                } else {
                    if (ctx.match[ctx.match.length - 1] === '0') {
                        if (bigCount <= 10) {
                            counter += ask[bigCount].weight
                            // console.log('counter ' + counter + ' counterPt' + counterPt2)
                        }
                    }   
                    if(bigCount > 10){
                        // console.log(bigCount)
                        // console.log(ask[bigCount].weight[ctx.match[ctx.match.length - 1]])
                        counterPt2 += ask[bigCount].weight[ctx.match[ctx.match.length - 1]]
                        // console.log('counter ' + counter + ' counterPt' + counterPt2)
                    }else{console.log('counter ' + counter + ' counterPt' + counterPt2)}
                    ctx.scene.reenter()
                }

            //*этот огромный test.action принимает колбек дату , смотрит не последний ли это вопрос(если это так, то говорит какой ты зверь),  затем стоит контрукция ифов которая
            //* прибавляет нужным счетчикам значения весов, чтобы определить  какой ты зверь) мб эта конструкция карявая и при желании можно переписать 
                
            })
        })
        return test
    }
}

function createButton(big, small, opt) {
    smallCount++
    if (opt) {
        bigCount++
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
                        [createButton(count1, count2),
                            createButton(count1, count2 + 1)
                        ],
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

function objLen(obj) {
    var size = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}

module.exports = SceneGenerator