import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { createTopic, getTopics, getUserByApi } from './helpers.js';
import dotenv from 'dotenv';
dotenv.config();

export const bot = new Telegraf(process.env.BOT_TOKEN);

bot.on(message('new_chat_members'), async (ctx) => {
    const newUserId = ctx.update.message.new_chat_member.id;
    try {
        const user = await getUserByApi(newUserId, ctx);
        let replyText;
        if (user.user.country === 'Кипр') {
            replyText = `Кажется, это [${user.user.full_name}](https://vas3k.club/user/${user.user.slug}/)
Живет в замечательном городе под названием ${user.user.city}
Добро пожаловать\\! Давно на Кипре? Как тебе?`;
        } else {
            replyText = `Кажется, это [${responseJson.user.full_name}](https://vas3k.club/user/${user.user.slug}/)
Живет: ${user.user.city}, ${user.user.country}
Добро пожаловать\\! Собираешься в гости или переезжать?`;
        }

        ctx.replyWithPhoto(
            user.user.avatar,
            { caption: replyText, parse_mode: 'MarkdownV2' }
        )
    } catch (err) {
        ctx.replyWithPhoto(
            'https://cs8.pikabu.ru/post_img/2017/02/23/9/1487865441149431901.jpg',
            { caption: 'Пользователь не найден\n Привяжи бота @vas3k_club_bot' }
        );
    }
});

bot.command('newTopic', async ctx => {
    let args = ctx.payload.split('\n');

    if (ctx.message.reply_to_message?.text) {
        args = args.concat(ctx.message.reply_to_message.text.split('\n'));
    }

    await createTopic(args.shift(), args);
});

bot.command('getTopics', async ctx => {
    let topics = await getTopics();
    topics = topics.map(x => `[${x.child_page.title}](http://${x.id}.com)`).join('\n');
    ctx.replyWithMarkdownV2(topics);
});

bot.launch().then();
