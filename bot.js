require('dotenv').config();
const { Telegraf } = require('telegraf');
const Markup = require('telegraf/markup');

const bot = new Telegraf(process.env.token);

bot.start((ctx) =>
  ctx.reply(
    'Известный сомнолог Майкл Бреус выделяет четыре основных хронотипа: Дельфин, Лев, Медведь и Волк. С помощью несложного теста вы сможете быстро определить, кто вы, и узнать рекомендации по необходимому лично вам распорядку дня: когда лучше вставать, когда ложиться спать, когда завтракать-обедать-ужинать, когда заниматься спортом, а когда умственным трудом, и т.д. Майкл Бреус уверяет, что если вы будете жить в соответствии со своим хронотипом, у вас будет хорошее самочувствие и прекрасное настроение.',
    Markup.keyboard([['Начать!']]).extra()
  )
);

// bot.on('text', async (ctx) => ctx.reply(ctx.message.text));
// bot.on('text', async (ctx) => ctx.reply('👍'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('Начать!', async (ctx) => {
  q1 = await ctx.reply(
    'Если вы согласны со следующими утверждениями, выберите «да», если не согласны, выберите «нет»',
    // 'Я не могу заснуть или просыпаюсь от малейшего звука или света',
    Markup.keyboard([['да'], ['нет']]).extra()
  );
  q2 = await ctx.reply(
    'Еда — не самая большая моя страсть',
    Markup.keyboard([['да'], ['нет']]).extra()
  );
  q3 = await ctx.reply('Еда ', Markup.keyboard([['да'], ['нет']]).extra());
});

// function* gen() {
//   let ask1 = yield bot.sendMessage('Вопрос 1?');
//   bot.on('message', (msg) => {
//     fname = msg.text;
//     generator.next();
//   });
//   let ask2 = yield bot.sendMessage('Вопрос 2?');
//   bot.on('message', (msg) => {
//     sname = msg.text;
//   });
// }
// let generator = gen();
// bot.sendMessage('Пройди опрос');
// generator.next();

bot.launch();
