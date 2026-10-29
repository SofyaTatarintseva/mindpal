import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { HEALTH_RECOMMENDATIONS } from './health_data.js'
import { SYSTEM_PROMPT, DECOMPOSE_PROMPT } from './prompt.js'; 

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.302.ai/v1'
});

app.post('/api/analyze', async (req, res) => {
  const { text } = req.body;

  if (!text || text.length < 3) {
    return res.status(400).json({ error: 'Текст слишком короткий' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'deepseek-v4-flash',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: text }
      ],
      temperature: 0.4,
      // Добавляем response_format, чтобы модель строго возвращала JSON
      response_format: { type: 'json_object' } 
    });

    const responseText = completion.choices[0].message.content;
    let result;

    try {
      // 1. Убираем markdown-теги
      let cleanJson = responseText.replace(/```json|```/g, '').trim();
      
      // 2. Ищем первую { и последнюю }
      const startIndex = cleanJson.indexOf('{');
      const endIndex = cleanJson.lastIndexOf('}');
      
      if (startIndex !== -1 && endIndex !== -1) {
        cleanJson = cleanJson.substring(startIndex, endIndex + 1);
      }
      
      result = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('❌ Ошибка парсинга JSON. Сырой ответ от ИИ:', responseText);
      return res.status(500).json({ error: 'ИИ вернул некорректный формат данных' });
    }

    res.json(result);
  } catch (error) {
    console.error('FULL ERROR:', error);
    res.status(500).json({ error: 'Ошибка при обращении к ИИ' });
  }
});
app.post('/api/decompose', async (req, res) => {
  const { task } = req.body;

  if (!task || task.length < 3) {
    return res.status(400).json({ error: 'Задача слишком короткая' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'deepseek-v4-flash',
      messages: [
        { role: 'system', content: DECOMPOSE_PROMPT },
        { role: 'user', content: task }
      ],
      temperature: 0.5,
      response_format: { type: 'json_object' }
    });

    const responseText = completion.choices[0].message.content;
    let result;

    try {
      let cleanJson = responseText.replace(/```json|```/g, '').trim();
      const startIndex = cleanJson.indexOf('{');
      const endIndex = cleanJson.lastIndexOf('}');
      if (startIndex !== -1 && endIndex !== -1) {
        cleanJson = cleanJson.substring(startIndex, endIndex + 1);
      }
      result = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('❌ Ошибка парсинга JSON (decompose):', responseText);
      return res.status(500).json({ error: 'ИИ вернул некорректный формат' });
    }

    res.json(result);
  } catch (error) {
    console.error('FULL ERROR (decompose):', error);
    res.status(500).json({ error: 'Ошибка при обращении к ИИ' });
  }
});
app.get('/api/health/checklist', (req, res) => {
  const { gender, age } = req.query;

  // Валидация
  if (!gender || !age) {
    return res.status(400).json({ error: 'Необходимо указать пол и возраст' });
  }

  const userAge = parseInt(age);
  if (isNaN(userAge) || userAge < 0 || userAge > 120) {
    return res.status(400).json({ error: 'Некорректный возраст' });
  }

  // Фильтрация справочника
  const filteredItems = HEALTH_RECOMMENDATIONS.filter(item => {
    const genderMatch = item.gender === 'all' || item.gender === gender;
    const ageMatch = (!item.minAge || userAge >= item.minAge) && (!item.maxAge || userAge <= item.maxAge);
    return genderMatch && ageMatch;
  });

  res.json(filteredItems);
});
app.listen(port, () => console.log(`Сервер запущен на порту ${port}`));