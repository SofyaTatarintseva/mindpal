// Типы для эмоций (совпадают с тем, что возвращает ИИ)
export interface Emotions {
  joy: number;
  sadness: number;
  anxiety: number;
  anger: number;
  calm: number;
}

// Тип для полного ответа от сервера
export interface AnalysisResult {
  emotions: Emotions;   // Объект с 5 эмоциями (joy, sadness, anxiety, anger, calm)
  summary: string;      // Короткая фраза от ИИ (например, "Ты устала, но держишься")
  recommendation: string; // Совет от ИИ (например, "Выпей чай и отдохни")
}
// Базовый URL твоего бэкенда (Node.js)
// Если ты запускаешь проект локально, это будет localhost:3001
const API_URL = 'http://localhost:3001/api/analyze';

/**
 * Функция для отправки текста на анализ к ИИ.
 * @param text - Текст, который пользователь ввел в форму.
 * @returns Promise<AnalysisResult> - Объект с эмоциями, резюме и советом.
 */
export const analyzeEmotions = async (text: string): Promise<AnalysisResult> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    // Если сервер вернул ошибку (4xx или 5xx), выбрасываем исключение
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Ошибка сервера при анализе текста');
    }

    // Парсим успешный ответ
    const data: AnalysisResult = await response.json();
    return data;

  } catch (error) {
    console.error('API Error:', error);
    
    // Если это ошибка сети (сервер не запущен), выдаем понятное сообщение
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Не удалось подключиться к серверу. Убедитесь, что бэкенд запущен (npm start в папке server).', { cause: error });
    }
    
    // Пробрасываем ошибку дальше, чтобы компонент мог ее показать
    throw error;
  }
};