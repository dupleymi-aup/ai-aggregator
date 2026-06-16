export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  variables?: string[];
}

export function fillTemplate(template: string, variables: Record<string, string>): string {
  let result = template;
  
  // Find all {{variable}} patterns
  const variablePattern = /\{\{(\w+)\}\}/g;
  const matches = template.match(variablePattern) || [];
  
  // Check for missing variables
  const missing = matches
    .map(match => match.slice(2, -2))
    .filter(varName => !variables[varName] && variables[varName] !== '');
  
  if (missing.length > 0) {
    console.warn('Missing template variables:', missing);
  }
  
  // Replace variables
  Object.entries(variables).forEach(([key, value]) => {
    const pattern = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(pattern, value);
  });
  
  return result;
}

export function extractTemplateVariables(content: string): string[] {
  const matches = content.match(/\{\{(\w+)\}\}/g) || [];
  return [...new Set(matches.map(m => m.slice(2, -2)))];
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'code-review',
    title: 'Ревью кода',
    description: 'Анализ кода с поиском проблем и улучшений',
    category: 'development',
    content: 'Пожалуйста, проведи детальный ревью следующего кода. Найди потенциальные баги, уязвимости, проблемы с производительностью и предложи улучшения:\n\n```\n{{code}}\n```',
    variables: ['code'],
  },
  {
    id: 'code-generate',
    title: 'Генерация кода',
    description: 'Создание кода по описанию задачи',
    category: 'development',
    content: 'Напиши код на {{language}} для следующей задачи:\n\n{{description}}\n\nТребования:\n- Чистый и читаемый код\n- Комментарии к ключевым частям\n- Обработка ошибок',
    variables: ['language', 'description'],
  },
  {
    id: 'translate',
    title: 'Переводчик',
    description: 'Профессиональный перевод с сохранением контекста',
    category: 'general',
    content: 'Переведи следующий текст на {{target_language}}. Сохрани стиль, тон и техническую терминологию:\n\n{{text}}',
    variables: ['target_language', 'text'],
  },
  {
    id: 'explain-concept',
    title: 'Объяснение концепции',
    description: 'Простое объяснение сложных тем',
    category: 'learning',
    content: 'Объясни концепцию "{{concept}}" простым языком, используя аналогии и примеры. Структура ответа:\n1. Суть концепции в одном предложении\n2. Аналогия из повседневной жизни\n3. Практический пример\n4. Где это применяется',
    variables: ['concept'],
  },
  {
    id: 'bug-fix',
    title: 'Исправление бага',
    description: 'Поиск и исправление ошибок в коде',
    category: 'development',
    content: 'В следующем коде есть баг. Найди его, объясни причину и предложи исправление:\n\n```\n{{code}}\n```\n\nОжидаемое поведение: {{expected}}\nФактическое поведение: {{actual}}',
    variables: ['code', 'expected', 'actual'],
  },
  {
    id: 'email-write',
    title: 'Написание письма',
    description: 'Профессиональное деловое письмо',
    category: 'writing',
    content: 'Напиши профессиональное письмо на тему: {{topic}}\n\nКому: {{recipient}}\nТон: {{tone}}\nКлючевые моменты: {{key_points}}',
    variables: ['topic', 'recipient', 'tone', 'key_points'],
  },
  {
    id: 'summarize',
    title: 'Суммаризация текста',
    description: 'Краткое изложение длинного текста',
    category: 'general',
    content: 'Сделай краткое изложение следующего текста, выделив:\n- Главную мысль (1 предложение)\n- Ключевые тезисы (3-5 пунктов)\n- Выводы\n\nТекст:\n{{text}}',
    variables: ['text'],
  },
  {
    id: 'sql-query',
    title: 'SQL-запрос',
    description: 'Создание SQL-запросов по описанию',
    category: 'development',
    content: 'Напиши SQL-запрос для следующей задачи:\n\n{{description}}\n\nСУБД: {{db_type}}\n\nСтруктура таблиц:\n{{schema}}',
    variables: ['description', 'db_type', 'schema'],
  },
  {
    id: 'api-design',
    title: 'Дизайн API',
    description: 'Проектирование REST API',
    category: 'development',
    content: 'Спроектируй REST API для {{service}}. Включи:\n1. Список эндпоинтов с HTTP-методами\n2. Формат запросов и ответов\n3. Коды ошибок\n4. Примеры использования',
    variables: ['service'],
  },
  {
    id: 'brainstorm',
    title: 'Брейншторм',
    description: 'Генерация креативных идей',
    category: 'creative',
    content: 'Проведи брейншторм по теме "{{topic}}". Для каждой идеи укажи:\n- Описание\n- Плюсы\n- Минусы\n- Оценка реализуемости (1-10)\n\nКоличество идей: {{count}}',
    variables: ['topic', 'count'],
  },
];

export const TEMPLATE_CATEGORIES = [
  { id: 'all', label: 'Все', icon: '📂' },
  { id: 'development', label: 'Разработка', icon: '💻' },
  { id: 'general', label: 'Общие', icon: '📋' },
  { id: 'learning', label: 'Обучение', icon: '📚' },
  { id: 'writing', label: 'Тексты', icon: '✍️' },
  { id: 'creative', label: 'Креатив', icon: '🎨' },
];
