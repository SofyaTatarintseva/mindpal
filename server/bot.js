import { Bot, InlineKeyboardBuilder } from "node-telegram-bot-api";
import dotenv from 'dotenv';
import fs from 'fs';
import cron from 'node-cron';

dotenv.config();
const token = process.env.TELEGRAM_BOT_TOKEN;

// В v2 создаем бота так (polling запускается отдельно)
const bot = new Bot(token);

// Файл для хранения настроек пользователей
const DB_FILE = './bot_users.json';

let users = {};
if (fs.existsSync(DB_FILE)) {
  users = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function saveDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
}

// В v2 регистрация команд выглядит так
bot.command("start", async (ctx) => {
  const chatId = String(ctx.chat?.id || ctx.from?.id);
  users[chatId] = { step: 'awaiting_contact', contact: null, message: null, time: null, pendingPing: null };
  saveDB();
  
  await ctx.reply('Привет! Я твой сторожевой бот. 🐕\n\nЕсли с тобой что-то случится, я передам сообщение твоему контакту.\n\nСначала напиши, **кому** передать сообщение (имя и @username или телефон):', { parse_mode: 'Markdown' });
});

// Обработка обычных сообщений (диалог)
bot.on("message", async (ctx) => {
  // Получаем chatId безопасно
 const chatId = String(ctx.chat?.id || ctx.from?.id);
  // Получаем текст безопасно
  const text = ctx.message?.text || ctx.msg?.text || '';
  
  if (!chatId) return; // Если не можем определить, кто пишет — выходим
  
  // Если это команда /start, пропускаем (ее обрабатывает bot.command)
  if (text.startsWith('/start')) return;

  // Если пользователя нет в базе, создаем для него запись (на случай перезапуска)
  if (!users[chatId]) {
    users[chatId] = { step: 'awaiting_contact', contact: null, message: null, time: null, pendingPing: null };
  }

  const state = users[chatId].step;

  if (state === 'awaiting_contact') {
    users[chatId].contact = text;
    users[chatId].step = 'awaiting_message';
    saveDB();
    await ctx.reply('Отлично. Теперь напиши **сообщение**, которое я отправлю этому человеку, если ты не ответишь:', { parse_mode: 'Markdown' });
  } 
  else if (state === 'awaiting_message') {
    users[chatId].message = text;
    users[chatId].step = 'awaiting_time';
    saveDB();
    await ctx.reply('Понял. Теперь укажи **время** ежедневного пинга в формате ЧЧ:ММ (например, 20:00):', { parse_mode: 'Markdown' });
  }
  else if (state === 'awaiting_time') {
    // Очищаем ввод от пробелов и невидимых символов
    const cleanText = text.trim();
    
    // Более гибкая проверка: принимает 9:00 и 09:00
    if (/^([01]?\d|2[0-3]):[0-5]\d$/.test(cleanText)) {
        // Приводим к формату ЧЧ:ММ (добавляем 0, если нужно)
        const [hours, minutes] = cleanText.split(':');
        const formattedTime = `${hours.padStart(2, '0')}:${minutes}`;
        users[chatId].time = formattedTime;
        users[chatId].step = 'active';
        saveDB();
        
        startCronForUser(chatId, formattedTime);
        
        await ctx.reply(`✅ Готово! Я буду пинговать тебя каждый день в ${formattedTime}.\n\nЕсли ты не ответишь в течение 30 минут, я отправлю сообщение: «${users[chatId].message}» для ${users[chatId].contact}.`);
    } else {
        await ctx.reply('Неверный формат. Пожалуйста, напиши время как ЧЧ:ММ (например, 14:00 или 09:30)');
    }
  }
  else if (state === 'active') {
    await ctx.reply('Ты уже настроен. Если хочешь изменить настройки, напиши /start');
  }
});

// Обработка нажатия на кнопку "Я в порядке"
bot.on("callback_query", async (ctx) => {
  const chatId = String(ctx.chat?.id || ctx.from?.id);
  const data = ctx.callbackQuery.data;

  if (data === 'im_ok') {
    if (users[chatId]) {
      users[chatId].pendingPing = null;
      saveDB();
      await ctx.answerCallbackQuery({ text: 'Отлично! Таймер сброшен.' });
      // В v2 редактирование сообщения выглядит так
      await bot.api.editMessageText({
        chat_id: chatId,
        message_id: ctx.callbackQuery.message.message_id,
        text: '✅ Ты отметился. Увидимся завтра!'
      });
    }
  }
});

// Функция для запуска пинга (cron остается)
function startCronForUser(chatId, time) {
  const [hours, minutes] = time.split(':');
  cron.schedule('* * * * *', () => {
    const now = new Date();
    if (now.getHours() === parseInt(hours) && now.getMinutes() === parseInt(minutes)) {
      sendPing(chatId);
    }
  });
}

// Отправка пинга (v2 стиль)
async function sendPing(chatId) {
  if (!users[chatId] || users[chatId].step !== 'active') return;

  users[chatId].pendingPing = Date.now();
  saveDB();

  await bot.api.sendMessage({
  chat_id: chatId,
  text: '🔔 **Проверка связи!**\n\nТы в порядке? Нажми кнопку ниже, чтобы подтвердить.',
  parse_mode: 'Markdown',
  reply_markup: {
    inline_keyboard: [[{ text: '✅ Я в порядке', callback_data: 'im_ok' }]]
  }
});

  setTimeout(async () => {
    if (users[chatId] && users[chatId].pendingPing) {
      const contact = users[chatId].contact;
      const message = users[chatId].message;
      
      // В v2 тоже через api.sendMessage
      await bot.api.sendMessage({
        chat_id: chatId,
        text: `⚠️ Ты не ответил. Я отправляю сообщение для ${contact}.`
      });
      
      console.log(`[ALERT] Отправка сообщения для ${contact}: ${message}`);
      
      users[chatId].pendingPing = null;
      saveDB();
    }
  }, 30 * 60 * 1000);
}

// В v2 нужно явно запустить polling
await bot.startPolling();
console.log('🤖 Бот запущен...');