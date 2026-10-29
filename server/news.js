import Parser from 'rss-parser';

const parser = new Parser();

// Словарь тем и соответствующих RSS-лент
const TOPICS = {
  'искусство': [
    'https://www.artnews.com/feed/',
    'https://hyperallergic.com/feed/'
  ],
  'технологии': [
    'https://techcrunch.com/feed/',
    'https://www.theverge.com/rss/index.xml',
    'https://habr.com/ru/rss/articles/?fl=ru'
  ],
  'наука': [
    'https://www.sciencedaily.com/rss/top/science.xml',
    'https://feeds.arstechnica.com/arstechnica/index',
    'https://www.nature.com/nature.rss',
    'https://www.sciencedaily.com/rss/all.xml',
    'https://phys.org/rss-feed/',
    'https://www.quantamagazine.org/feed/'
  ],
  'психология': [
    'https://www.psychologytoday.com/us/front/feed'
  ],
  'космос': [
    'https://www.esa.int/rssfeed/Our_Activities/Space_Science'
  ]
};

export async function getNewsByTopic(topic, limit = 5) {
  const feeds = TOPICS[topic.toLowerCase()];
  if (!feeds) return null;

  try {
    const allItems = [];
    
    // Проходим по всем лентам для темы
    for (const feedUrl of feeds) {
      try {
        const feed = await parser.parseURL(feedUrl);
        // Берем только первые 3 новости из каждой ленты
        const items = feed.items.slice(0, 3).map(item => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          contentSnippet: item.contentSnippet?.substring(0, 150) + '...' // Краткий обзор
        }));
        allItems.push(...items);
      } catch (e) {
        console.error(`Ошибка загрузки ленты ${feedUrl}:`, e.message);
      }
    }

    // Сортируем по дате (новые сверху) и берем нужное количество
    return allItems
      .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
      .slice(0, limit);

  } catch (error) {
    console.error('Ошибка парсинга новостей:', error);
    return [];
  }
}