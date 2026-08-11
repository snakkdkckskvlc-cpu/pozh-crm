/**
 * Ставит фирменные цвета ООО «ПожСервис» в Twenty.
 *
 * КАК ЭТО РАБОТАЕТ. Twenty 0.2.1 читает цвета из переменных CSS во время
 * работы: значения лежат в theme-constants/theme-light.css, компоненты берут их
 * через var(--t-…), а ThemeProvider считывает их с готовой страницы и раздаёт
 * остальным. Значит достаточно подложить свой файл стилей — и покраснеет всё
 * сразу, включая места, где цвет подставляется из кода.
 *
 * ПЕРВАЯ ПОПЫТКА БЫЛА ХУЖЕ, И ЭТО ЗАПИСАНО НАРОЧНО. Сначала правились исходники
 * палитры (packages/twenty-ui/src/theme/constants/*.ts) с последующей
 * пересборкой пакета. Это правка ядра: теряется при каждом обновлении Twenty и
 * требует сборки, которая на машине с 8 ГБ проходит не всегда. Файл стилей не
 * требует ни того, ни другого. Ошибка была в предположении, что тема попадает в
 * программу при сборке — в версии 0.2.1 это уже не так.
 *
 * Запуск:
 *   node branding/apply-branding.mjs             — поставить
 *   node branding/apply-branding.mjs --проверить — показать, что сделает
 *   node branding/apply-branding.mjs --снять     — убрать
 */

import { readFileSync, writeFileSync, existsSync, copyFileSync, unlinkSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const КОРЕНЬ = join(dirname(fileURLToPath(import.meta.url)), '..');
const ФРОНТ = join(КОРЕНЬ, 'twenty', 'packages', 'twenty-front');
const ИСТОЧНИК = join(КОРЕНЬ, 'branding', 'pozh-theme.css');
const ЦЕЛЬ = join(ФРОНТ, 'public', 'pozh-theme.css');
const СТРАНИЦА = join(ФРОНТ, 'index.html');

const МЕТКА = '<!-- пожсервис: фирменный вид -->';
const ССЫЛКА = `    ${МЕТКА}\n    <link rel="stylesheet" href="/pozh-theme.css" />\n`;

const режим = process.argv.includes('--снять')
  ? 'снять'
  : process.argv.includes('--проверить')
    ? 'проверка'
    : 'поставить';

const сделано = [];
const беда = [];

if (!existsSync(ФРОНТ)) {
  беда.push(`Нет каталога ${ФРОНТ}. Twenty не склонирован или переехал.`);
} else if (!existsSync(СТРАНИЦА)) {
  беда.push(`Нет ${СТРАНИЦА}. Twenty изменил устройство — накладку надо переписать.`);
} else {
  const страница = readFileSync(СТРАНИЦА, 'utf8');
  const стоит = страница.includes(МЕТКА);

  if (режим === 'снять') {
    if (стоит) {
      writeFileSync(СТРАНИЦА, страница.replace(ССЫЛКА, ''), 'utf8');
      сделано.push('ссылка убрана из index.html');
    } else сделано.push('ссылки не было');
    if (existsSync(ЦЕЛЬ)) {
      unlinkSync(ЦЕЛЬ);
      сделано.push('файл стилей удалён');
    }
  } else {
    if (!existsSync(ИСТОЧНИК)) {
      беда.push(`Нет ${ИСТОЧНИК} — нечего ставить.`);
    } else if (режим === 'проверка') {
      сделано.push(стоит ? 'ссылка уже стоит, файл обновился бы' : 'ссылка добавилась бы в index.html');
      сделано.push('файл стилей скопировался бы в public/');
    } else {
      mkdirSync(dirname(ЦЕЛЬ), { recursive: true });
      copyFileSync(ИСТОЧНИК, ЦЕЛЬ);
      сделано.push('файл стилей положен в public/');
      if (!стоит) {
        // Ставим ПОСЛЕДНЕЙ строкой перед </head>: при равной силе правил
        // побеждает объявленная позже. Сила поднята ещё и пометкой !important в
        // самом файле — тема Twenty подключается скриптом уже после разметки.
        writeFileSync(СТРАНИЦА, страница.replace('  </head>', ССЫЛКА + '  </head>'), 'utf8');
        сделано.push('ссылка добавлена в index.html');
      } else {
        сделано.push('ссылка уже стояла');
      }
    }
  }
}

// Проверяем, что в файле стилей вообще есть наши цвета. Пустой или чужой файл
// поставился бы молча, и человек был бы уверен, что покрасил.
if (режим !== 'снять' && existsSync(ИСТОЧНИК)) {
  const стили = readFileSync(ИСТОЧНИК, 'utf8');
  const переменных = (стили.match(/--t-[a-z0-9-]+:/g) || []).length;
  if (переменных < 10) беда.push(`В файле стилей всего ${переменных} значений — похоже, он собран неверно.`);
  else сделано.push(`значений цвета в файле: ${переменных}`);
}

const шапка = { поставить: 'ПОСТАВЛЕНО', проверка: 'ПРОВЕРКА (ничего не менялось)', снять: 'СНЯТО' }[режим];
console.log(`\n${шапка}\n${'='.repeat(шапка.length)}`);
for (const с of сделано) console.log(`  ✔ ${с}`);
for (const с of беда) console.log(`  ✖ ${с}`);

if (беда.length) process.exit(1);

if (режим === 'поставить') {
  console.log(
    '\nПересобирать ничего не нужно — цвета читаются во время работы.\n' +
      'Обновите страницу в браузере. Проверить: в консоли браузера\n' +
      "  getComputedStyle(document.documentElement).getPropertyValue('--t-color-blue')\n" +
      '  должно вернуть #e31e24, а не синий.',
  );
}
console.log('');
