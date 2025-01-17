!! ПЕРЕД ТЕМ КАК ПУШИТЬ В РЕПОЗИТОРИЙ ОБЯЗАТЕЛЬНО ЕЩЁ РАЗ ПРОЧИТАЙ КАК ЕГО СДЕЛАТЬ ПРАВИЛЬНО В ГРУППЕ ТГ (ЗАКРЕПЛЕННЫЕ) !!

1. Скопируй этот репозиторий по этой ссылке https://github.com/rouse-dev/respect.git
2. Открой папку frontend и перекинь свои файлы все сюда (!! абсолютно все !!)
3. Если у тебя есть .env файл в корневой папке, все его данные перекинь в корневой .env файл



-- КАК ИЗМЕНИТЬ ДИРЕКТОРИЮ .ENV В VITE_REACT --

1. Открой файл vite.config.ts
2. Посмотри чтобы у тебя было так
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Загружаем переменные окружения из корневой папки
  const env = loadEnv(mode, path.resolve(__dirname, '../'), '');

  return {
    plugins: [react()],
    define: {
      'process.env': env, // Передаем переменные окружения в приложение
    },
  };
});
3. Сохрани изменения перед тем, как делать запрос на слияние (ОБЯЗАТЕЛЬНО СНАЧАЛА НАСТРОЙ .ENV!)