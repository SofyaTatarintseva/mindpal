// server/health_data.js

export const HEALTH_RECOMMENDATIONS = [
  // --- БАЗОВЫЕ (ОМС / Диспансеризация) ---
  // Общий анализ крови — системный, но визуально можно отнести к груди (кроветворение)
  { id: 'cbc', label: 'Общий анализ крови', category: 'Анализы', frequency: '1 раз в год', gender: 'all', minAge: 18, source: 'oms', zone: 'chest' },
  // Глюкоза — обмен веществ, живот (поджелудочная)
  { id: 'glucose', label: 'Глюкоза', category: 'Анализы', frequency: '1 раз в год', gender: 'all', minAge: 18, source: 'oms', zone: 'abdomen' },
  // Холестерин — сосуды, грудь (сердце)
  { id: 'cholesterol', label: 'Холестерин общий', category: 'Анализы', frequency: '1 раз в год', gender: 'all', minAge: 18, source: 'oms', zone: 'chest' },
  // ЭКГ — сердце
  { id: 'ecg', label: 'ЭКГ', category: 'Общее', frequency: '1 раз в год', gender: 'all', minAge: 35, source: 'oms', zone: 'chest' },
  // Флюорография — легкие
  { id: 'fluorography', label: 'Флюорография', category: 'Общее', frequency: '1 раз в 2 года', gender: 'all', minAge: 18, source: 'oms', zone: 'chest' },
  // Давление — системное, можно отнести к рукам (тонометр) или груди
  { id: 'blood_pressure', label: 'Измерение давления', category: 'Общее', frequency: '1 раз в год', gender: 'all', minAge: 18, source: 'oms', zone: 'arms' },
  // Гинекология — таз
  { id: 'gyn', label: 'Гинеколог + ПАП-тест', category: 'Женское здоровье', frequency: '1 раз в год', gender: 'female', minAge: 18, source: 'oms', zone: 'pelvis' },
  // УЗИ молочных желез — грудь
  { id: 'breast_us', label: 'УЗИ молочных желез', category: 'Женское здоровье', frequency: '1 раз в год', gender: 'female', minAge: 18, maxAge: 39, source: 'oms', zone: 'chest' },
  // Маммография — грудь
  { id: 'mammography', label: 'Маммография', category: 'Женское здоровье', frequency: '1 раз в 2 года', gender: 'female', minAge: 40, source: 'oms', zone: 'chest' },
  
  // --- РАСШИРЕННЫЕ (Платные / Клинические рекомендации) ---
  // Стоматолог — голова
  { id: 'dentist', label: 'Стоматолог', category: 'Общее', frequency: '1 раз в 6 мес', gender: 'all', minAge: 18, source: 'private', zone: 'head' },
  // HbA1c — живот (поджелудочная)
  { id: 'hba1c', label: 'Гликированный гемоглобин (HbA1c)', category: 'Анализы', frequency: '1 раз в год', gender: 'all', minAge: 30, source: 'private', zone: 'abdomen' },
  // Липидный профиль — грудь (сердце/сосуды)
  { id: 'lipids', label: 'Липидный профиль (ЛПНП, ЛПВП, ТГ)', category: 'Анализы', frequency: '1 раз в год', gender: 'all', minAge: 30, source: 'private', zone: 'chest' },
  // Ферритин — системный, но можно отнести к животу (печень/селезенка)
  { id: 'ferritin', label: 'Ферритин (железо)', category: 'Анализы', frequency: '1 раз в год', gender: 'all', minAge: 30, source: 'private', zone: 'abdomen' },
  // ТТГ — шея (щитовидка)
  { id: 'tsh', label: 'ТТГ (щитовидная железа)', category: 'Анализы', frequency: '1 раз в год', gender: 'all', minAge: 30, source: 'private', zone: 'neck' },
  // Витамин D — системный, кожа/ноги (синтез под солнцем)
  { id: 'vitd', label: 'Витамин D', category: 'Анализы', frequency: '1 раз в год', gender: 'all', minAge: 30, source: 'private', zone: 'legs' },
  // УЗИ малого таза — таз
  { id: 'pelvic_us', label: 'УЗИ малого таза', category: 'Женское здоровье', frequency: '1 раз в год', gender: 'female', minAge: 18, source: 'private', zone: 'pelvis' },
  // ПСА — таз (простата)
  { id: 'psa', label: 'ПСА (простата)', category: 'Мужское здоровье', frequency: '1 раз в 2 года', gender: 'male', minAge: 45, source: 'private', zone: 'pelvis' },
];