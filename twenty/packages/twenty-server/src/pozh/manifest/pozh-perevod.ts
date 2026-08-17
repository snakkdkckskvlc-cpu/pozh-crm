// пожсервис: русские названия встроенных объектов, полей и списков Twenty.
//
// Запуск (из packages/twenty-server), СРАЗУ ПОСЛЕ выкладки описи:
//   npx tsx src/pozh/manifest/pozh-perevod.ts --просмотр   # ничего не меняет
//   npx tsx src/pozh/manifest/pozh-perevod.ts              # переводит
//
// ЗАЧЕМ ЭТОТ ФАЙЛ ВООБЩЕ СУЩЕСТВУЕТ.
//
// Названия объектов и полей Twenty лежат в базе ТЕКСТОМ, а не берутся из
// перевода интерфейса. Переключение языка на русский их не трогает: кнопки и
// подписи становятся русскими, а в меню по-прежнему «Companies», «People»,
// «Tasks» рядом с «Контрагенты» и «Огнетушители».
//
// Владелец потребовал приложение целиком на русском, и требование по делу:
// человек, который видит половину меню на чужом языке, считает, что половина
// программы чужая и трогать её нельзя.
//
// ПОЧЕМУ КОДОМ, А НЕ РУКАМИ В БАЗЕ. Сначала это и было сделано руками — 833
// названия. Работает ровно до первого переразвёртывания базы: `database:reset`
// заводит встроенные объекты заново, по-английски, и весь труд пропадает молча.
// Причём заметит это не тот, кто разворачивал, а секретарь, открывшая меню.
//
// ПОРЯДОК ПЕРЕВОДА. Сначала берём словарь самой Twenty (ru-RU.po) — она уже
// переведена, и брать оттуда правильнее, чем сочинять: сочинённое разойдётся с
// остальным интерфейсом, где то же слово переведено иначе. Что в словаре не
// нашлось — берём из списка ниже.

import * as fs from 'fs';
import * as path from 'path';

import { Client } from 'pg';

const просмотр = process.argv.includes('--просмотр');

const АДРЕС_БАЗЫ =
  process.env.PG_DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/default';

const СЛОВАРЬ_TWENTY = path.resolve(
  __dirname,
  '../../../../twenty-front/src/locales/ru-RU.po',
);

/**
 * Названия, которых в словаре Twenty нет. Это либо служебное («Record Page
 * Fields»), либо из её показательного набора про питомцев и ракеты, либо наши
 * же объекты, подписанные в списках латинским именем.
 */
const НАШ_СЛОВАРЬ: Record<string, string> = {
  // Объекты
  Company: 'Компания', Companies: 'Компании',
  Person: 'Контакт', People: 'Контакты',
  Opportunity: 'Сделка', Opportunities: 'Сделки',
  Task: 'Задача', Tasks: 'Задачи',
  Note: 'Заметка', Notes: 'Заметки',
  Dashboard: 'Сводка', Dashboards: 'Сводки',
  Attachment: 'Вложение', Attachments: 'Вложения',
  Blocklist: 'Чёрный список', Blocklists: 'Чёрные списки',
  Workflow: 'Процесс', Workflows: 'Процессы',
  'Workflow Run': 'Запуск процесса', 'Workflow Runs': 'Запуски процессов',
  'Workflow Version': 'Версия процесса', 'Workflow Versions': 'Версии процессов',
  'Workflow Automated Trigger': 'Пуск процесса по событию',
  'Workflow Automated Triggers': 'Пуски процессов по событию',
  'Workspace Member': 'Сотрудник', 'Workspace Members': 'Сотрудники',
  WorkspaceMember: 'Сотрудник', WorkflowRun: 'Запуск процесса',
  WorkflowVersion: 'Версия процесса', MessageCampaign: 'Рассылка', MessageList: 'Список',
  SurveyResult: 'Итог опроса',
  'Calendar event': 'Событие календаря', 'Calendar events': 'События календаря',
  'Calendar Event': 'Событие календаря', 'Calendar Events': 'События календаря',
  'Calendar event participant': 'Участник события',
  'Calendar event participants': 'Участники события',
  'Calendar Channel Event Association': 'Связь события календаря',
  'Calendar Channel Event Associations': 'Связи событий календаря',
  'Call Recording': 'Запись разговора', 'Call Recordings': 'Записи разговоров',
  Message: 'Письмо', Messages: 'Письма',
  Campaign: 'Рассылка', Campaigns: 'Рассылки',
  'Message Channel Message Association': 'Связь письма',
  'Message Channel Message Associations': 'Связи писем',
  'Message Channel Message Association Message Folder': 'Папка связи письма',
  'Message Channel Message Association Message Folders': 'Папки связей писем',
  List: 'Список', Lists: 'Списки',
  'List Member': 'Участник списка', 'List Members': 'Участники списка',
  'Message Participant': 'Участник переписки', 'Message Participants': 'Участники переписки',
  'Message Thread': 'Переписка', 'Message Threads': 'Переписки',
  'Note Target': 'Привязка заметки', 'Note Targets': 'Привязки заметок',
  'Task Target': 'Привязка задачи', 'Task Targets': 'Привязки задач',
  'Timeline Activity': 'Событие в ленте', 'Timeline Activities': 'События в ленте',
  Rocket: 'Ракета', Rockets: 'Ракеты', Pet: 'Питомец', Pets: 'Питомцы',
  'Survey result': 'Итог опроса', 'Survey results': 'Итоги опросов',

  // Поля: компании и люди
  'Account Owner': 'Ответственный',
  'Account Owner For Companies': 'Ответственный за компании',
  Address: 'Адрес', Age: 'Возраст', Amount: 'Сумма',
  'Annual Revenue': 'Годовая выручка', Avatar: 'Значок',
  'Avatar File': 'Файл значка', 'Avatar Url': 'Ссылка на значок',
  Bio: 'О себе', Birthday: 'День рождения', 'Domain Name': 'Сайт',
  Linkedin: 'Профиль LinkedIn', Phones: 'Телефоны', Pictures: 'Изображения',
  Position: 'Порядок', 'Point of Contact': 'Контактное лицо',
  'User Email': 'Почта', 'User Id': 'Номер пользователя', Id: 'Номер',

  // Поля: сделки, задачи, заметки
  Stage: 'Этап', 'Close date': 'Дата закрытия',
  'By Stage': 'По этапам', 'By Status': 'По состоянию',
  'Owned opportunities': 'Свои сделки', Assignee: 'Исполнитель',
  'Assigned tasks': 'Назначенные задачи', 'Assigned to Me': 'Мои задачи',
  'Due Date': 'Срок', Comments: 'Комментарии', Statuses: 'Состояния',

  // Поля: время и служебное
  'Creation date': 'Создано', 'Creation DateTime': 'Создано',
  'Update DateTime': 'Изменено', 'Last update': 'Изменено',
  'Deleted at': 'Удалено', 'Updated by': 'Кто изменил',
  'Start Date': 'Начало', 'End Date': 'Окончание',
  'Started At': 'Начато', 'Ended At': 'Закончено',
  'Received At': 'Получено', 'Sent at': 'Отправлено',
  'Search vector': 'Строка поиска', 'Extra data': 'Дополнительные данные',
  Summary: 'Сводка', File: 'Файл', 'File category': 'Вид файла',
  'Full path': 'Полный путь', 'Color Scheme': 'Цвета',
  'Start of the week': 'Начало недели', 'Open Records In': 'Открывать записи в',
  'Page Layout ID': 'Номер разметки страницы', 'Application ID': 'Номер приложения',
  'Linked Object Metadata Id': 'Номер связанного объекта',
  'Linked Record cached name': 'Название связанной записи',
  'Linked Record id': 'Номер связанной записи',
  'All {objectLabelPlural}': 'Все: {objectLabelPlural}',

  // Поля: почта и календарь
  'Event Participants': 'Участники события', Events: 'События',
  'Event details': 'Подробности события', 'Event name': 'Название события',
  'Event ID': 'Номер события', 'Event external ID': 'Внешний номер события',
  'Recurring Event ID': 'Номер повторяющегося события', 'iCal UID': 'Опознаватель iCal',
  'Is Full Day': 'Весь день', 'Is Organizer': 'Организатор',
  'Is canceled': 'Отменено', 'Is draft': 'Черновик',
  'Conference Solution': 'Способ связи', 'Meet Link': 'Ссылка на встречу',
  'Response Status': 'Ответ', 'Request Status': 'Состояние запроса',
  'Message Folder': 'Папка писем', 'Message Folders': 'Папки писем',
  'Message Id': 'Номер письма', 'Message External Id': 'Внешний номер письма',
  'Message Thread Id': 'Номер переписки', 'Message Channel Id': 'Номер канала',
  'Message Channel Association': 'Связь канала',
  'Thread External Id': 'Внешний номер переписки',
  'Header message Id': 'Номер письма в заголовке', 'From address': 'Отправитель',
  'To address': 'Получатель', 'Channel ID': 'Номер канала',
  'Delivery status': 'Состояние доставки', 'Sent count': 'Отправлено',
  'Bounced count': 'Не доставлено', 'Failed count': 'Отказов',
  'Complained count': 'Жалоб', 'Unsubscribe topic id': 'Номер темы отписки',
  'External Bot ID': 'Внешний номер помощника',
  'External Recording ID': 'Внешний номер записи', Transcript: 'Расшифровка',

  // Поля: процессы
  'Workflow version': 'Версия процесса', Versions: 'Версии', Runs: 'Запуски',
  'Version status': 'Состояние версии', 'Version steps': 'Шаги версии',
  'Version trigger': 'Пуск версии',
  'Last published Version Id': 'Номер последней выпущенной версии',
  'Automated Trigger Type': 'Вид самопуска', 'Automated Triggers': 'Самопуски',
  'Core workflow id': 'Номер процесса', 'Core workflow version id': 'Номер версии процесса',
  'Workflow run status': 'Состояние запуска',
  'Workflow run started at': 'Запуск начат', 'Workflow run ended at': 'Запуск закончен',
  'Workflow run enqueued at': 'Запуск поставлен в очередь',
  'Step logs': 'Записи шагов', 'Executed by': 'Кем выполнено',

  // Показательный набор Twenty
  Species: 'Вид', Traits: 'Черты', 'Vet email': 'Почта ветеринара',
  'Vet phone': 'Телефон ветеринара', 'Is good with kids': 'Ладит с детьми',
  'Interesting facts': 'Любопытные факты',
  'Average cost of kibble per month': 'Расход на корм в месяц',
  'Makes its owner think of': 'Напоминает хозяину о',
  'Sound swag (bark style, meow style, etc.)': 'Манера голоса',

  // Наши объекты: в списках они подписаны латинским именем
  PozhChecklistItem: 'Пункт списка дел', PozhCounterparty: 'Контрагент',
  PozhDeadlineRule: 'Правило срока', PozhDocumentMovement: 'Движение документа',
  PozhDriver: 'Водитель', PozhDriverPersonalData: 'Персональные данные водителя',
  PozhFireExtinguisher: 'Огнетушитель', PozhNumberCounter: 'Счётчик номеров',
  PozhPoint: 'Точка', PozhServiceContract: 'Договор обслуживания',
  PozhTrailer: 'Прицеп', PozhTrip: 'Рейс', PozhVehicle: 'Машина',
  PozhWaybill: 'Путевой лист', PozhWaybillTrailer: 'Прицеп в путевом листе',
};

/** Разобрать словарь Twenty. Пустые переводы пропускаем — они хуже английского. */
const словарьTwenty = (): Record<string, string> => {
  if (!fs.existsSync(СЛОВАРЬ_TWENTY)) {
    console.log('словарь Twenty не найден, беру только свой');

    return {};
  }
  const текст = fs.readFileSync(СЛОВАРЬ_TWENTY, 'utf-8');
  const итог: Record<string, string> = {};
  const выражение = /msgid\s+((?:"[^"]*"\s*)+)msgstr\s+((?:"[^"]*"\s*)+)/g;
  let кусок: RegExpExecArray | null;

  while ((кусок = выражение.exec(текст)) !== null) {
    const собрать = (ч: string) =>
      [...ч.matchAll(/"([^"]*)"/g)].map((м) => м[1]).join('');
    const ключ = собрать(кусок[1]);
    const значение = собрать(кусок[2]);

    if (ключ && значение && ключ !== значение) {
      итог[ключ] = значение;
    }
  }

  return итог;
};

const главное = async () => {
  const словарь = { ...словарьTwenty(), ...НАШ_СЛОВАРЬ };

  console.log(`переводов в словаре: ${Object.keys(словарь).length}`);

  const база = new Client({ connectionString: АДРЕС_БАЗЫ });

  await база.connect();

  // Что переводим: название объекта в единственном и множественном числе,
  // подпись поля, название списка. Английским считаем то, что начинается с
  // латинской буквы, — наши названия все с кириллицы.
  const МЕСТА: [string, string][] = [
    ['core."objectMetadata"', '"labelSingular"'],
    ['core."objectMetadata"', '"labelPlural"'],
    ['core."fieldMetadata"', 'label'],
    ['core.view', 'name'],
  ];

  let переведено = 0;
  const непонятные = new Set<string>();

  for (const [таблица, графа] of МЕСТА) {
    const { rows } = await база.query<{ id: string; знач: string }>(
      `select id::text as id, ${графа} as знач from ${таблица} where ${графа} ~ '^[A-Za-z]'`,
    );

    for (const строка of rows) {
      const перевод = словарь[строка.знач];

      if (перевод === undefined) {
        непонятные.add(строка.знач);
        continue;
      }
      if (!просмотр) {
        await база.query(`update ${таблица} set ${графа} = $1 where id = $2`, [
          перевод,
          строка.id,
        ]);
      }
      переведено += 1;
    }
  }

  // «... Record Page Fields» — служебные разметки страниц, их видно только в
  // настройках. Общим правилом, чтобы не перечислять два десятка штук.
  if (!просмотр) {
    await база.query(
      `update core.view set name = 'Поля страницы: ' || replace(name, ' Record Page Fields', '')
       where name like '%Record Page Fields'`,
    );
  }

  // Язык лежит в ТРЁХ местах, и экран берёт его у сотрудника рабочего
  // пространства. Поставленный только пользователю он не даёт ничего — интерфейс
  // остаётся английским, и выглядит это как «переключение языка не работает».
  if (!просмотр) {
    await база.query(`update core."user" set locale = 'ru-RU'`);
    await база.query(`update core."userWorkspace" set locale = 'ru-RU'`);
    const { rows } = await база.query<{ схема: string }>(
      `select table_schema as схема from information_schema.columns
        where column_name = 'locale' and table_name = 'workspaceMember'`,
    );

    for (const { схема } of rows) {
      await база.query(`update "${схема}"."workspaceMember" set locale = 'ru-RU'`);
    }
  }

  await база.end();

  console.log(просмотр ? 'ПРЕДВАРИТЕЛЬНЫЙ ПРОСМОТР — база не тронута' : 'ПЕРЕВЕДЕНО');
  console.log(`названий переведено: ${переведено}`);
  console.log(`не нашлось в словаре: ${непонятные.size}`);

  if (непонятные.size > 0) {
    console.log('  ' + [...непонятные].slice(0, 30).join(' | '));
    console.log('  Допишите их в НАШ_СЛОВАРЬ этого файла.');
  }
};

главное().catch((e: Error) => {
  console.error('не вышло:', e.message);
  process.exit(1);
});
