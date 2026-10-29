import { Bot } from "node-telegram-bot-api";
import dotenv from 'dotenv';
import fs from 'fs';
import cron from 'node-cron';
import { getNewsByTopic } from './news.js';

dotenv.config();
const token = process.env.TELEGRAM_NEWS_BOT_TOKEN;
const bot = new Bot(token);

// Файл для подписок
const SUBS_FILE = './news_subscriptions.json';
let subscriptions = {};
if (fs.existsSync(SUBS_FILE)) {
  subscriptions = JSON.parse(fs.readFileSync(SUBS_FILE, 'utf8'));
}

function saveSubs() {
  fs.writeFileSync(SUBS_FILE, JSON.stringify(subscriptions, null, 2));
}

// Команда /start
bot.command("start", async (ctx) => {
  await ctx.reply('Привет! Я бот-дайджест. 📰\n\nЯ буду присылать тебе свежие новости по выбранной теме каждое утро в 09:00.\n\nЧтобы подписаться, напиши /subscribe');
});

// Команда /subscribe
bot.command("subscribe", async (ctx) => {
  const chatId = ctx.chat.id;
  subscriptions[chatId] = { step: 'awaiting_topic', topic: null };
  saveSubs();
  await ctx.reply('На какую тему ты хочешь получать новости?\n\nДоступные темы: *искусство, технологии, наука, психология, космос*.\n\nНапиши тему одним словом:', { parse_mode: 'Markdown' });
});

// Обработка выбора темы
bot.on("message", async (ctx) => {
  const chatId = ctx.chat.id;
  const text = ctx.message?.text || '';
  
  // Пропускаем команды
  if (text.startsWith('/')) return;

  if (subscriptions[chatId] && subscriptions[chatId].step === 'awaiting_topic') {
    const topic = text.trim().toLowerCase();
    if (['искусство', 'технологии', 'наука', 'психология', 'космос'].includes(topic)) {
      subscriptions[chatId] = { step: 'active', topic: topic };
      saveSubs();
      await ctx.reply(`✅ Ты подписан на тему «${topic}». Каждое утро в 09:00 я буду присылать дайджест.`);
    } else {
      await ctx.reply('Такой темы нет. Доступно: искусство, технологии, наука, психология.');
    }
  }
});

// Отправка утреннего дайджеста (каждый день в 09:00)
const task = cron.schedule('0 9 * * *', async () => {
  console.log('📰 Запуск утреннего дайджеста...');
  
  for (const [chatId, sub] of Object.entries(subscriptions)) {
    if (sub.step === 'active' && sub.topic) {
      try {
        const news = await getNewsByTopic(sub.topic, 3);
        if (news && news.length > 0) {
          let message = `☀️ Доброе утро! Свежие новости по теме «${sub.topic}»:\n\n`;
          news.forEach((item, index) => {
            message += `${index + 1}. *${item.title}*\n${item.contentSnippet}\n[Читать полностью](${item.link})\n\n`;
          });
          
          await bot.api.sendMessage({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown',
            disable_web_page_preview: true
          });
        } else {
          await bot.api.sendMessage({ chat_id: chatId, text: 'Сегодня новостей по твоей теме нет. Хорошего дня!' });
        }
      } catch (e) {
        console.error(`Ошибка отправки новостей для ${chatId}:`, e);
      }
    }
  }
}, { noOverlap: true });
task.on('execution:missed', () => {
  console.log('⚠️ Дайджест был пропущен, запускаю сейчас...');
  task.execute(); // <-- Принудительный запуск
});
await bot.startPolling();
console.log('📰 Новостной бот запущен...');