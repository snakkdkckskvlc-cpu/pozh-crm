// пожсервис: подборки снабжения — то, ради чего человек открывает программу.
//
// ЗАЧЕМ. Без подборок «Заявки» — это список всех заявок за всё время. Снабженец,
// открыв его утром, увидит четыреста строк и не поймёт, что из них сегодня его.
// На показе 26.08.2026 весь разговор про исполнительскую дисциплину крутился
// ровно вокруг этого: «поступила заявка», «не разобрана заявка», «по какой-то
// заявке по просроченной дате». Три вопроса — три подборки.
//
// ПОЧЕМУ ПОДБОРКА, А НЕ УВЕДОМЛЕНИЕ. Та же причина, что и у подборок задач:
// своего окна уведомлений в Twenty нет, а наружу программа не ходит. В той
// системе, что показывали, уведомления шлёт бот МАКС — он и останется тем, кто
// стучится к человеку. Подборка отвечает на другой вопрос: человек уже открыл
// программу, и ему надо сразу увидеть своё.
//
// ЧЕГО ЭТО НЕ ДАЁТ. Подборка не знает, кто её открыл: «Мои заявки» из бота здесь
// не воспроизвести — своей записи о сотруднике в CRM пока нет, а до
// разграничения доступа её заводить нельзя. Поэтому подборки сделаны по
// состоянию работы, а не по человеку.

import {
  computeDeterministicUuid,
  type NavigationMenuItemManifest,
  type ViewManifest,
} from 'twenty-shared/application';
import {
  NavigationMenuItemType,
  ViewFilterOperand,
  ViewType,
} from 'twenty-shared/types';

import { ОБЪЕКТЫ, ПРИЛОЖЕНИЕ } from 'src/pozh/manifest/pozh-ids';
import { опознаватель } from 'src/pozh/manifest/pozh-pole';

const свой = (что: string, имя: string): string =>
  computeDeterministicUuid({
    entityNamespace: что as never,
    value: имя,
    applicationUniversalIdentifier: ПРИЛОЖЕНИЕ,
  });

// Коды вариантов выбора — ЛАТИНИЦЕЙ, и это не вкусовщина. Twenty отказался
// выкладывать опись со словами «Value must be in UPPER_CASE and follow
// snake_case»: кириллица в коде не проходит. По-русски остаётся только подпись,
// которую видит человек. Та же грабля в проекте ловилась уже четырежды —
// кириллица допустима в тексте, но не в именах.
//
// Здесь коды вписаны руками, потому что фильтру нужен готовый код, а не подпись.
// Чтобы эти два места не разъехались молча, на них стоит проверка в
// `pozh-snabzhenie.spec.ts`: она берёт варианты прямо из описи полей и сверяет.
const СОСТОЯНИЕ_ЗАЯВКИ = опознаватель(ОБЪЕКТЫ.заявка, 'status');
const СРОК_ЗАЯВКИ = опознаватель(ОБЪЕКТЫ.заявка, 'dueOn');
const СОСТОЯНИЕ_СПРАВКИ = опознаватель(ОБЪЕКТЫ.справка, 'status');

export const КОДЫ_ЗАЯВКИ = {
  согласована: 'APPROVED',
  закрыта: 'CLOSED',
  отклонена: 'REJECTED',
} as const;

export const КОДЫ_СПРАВКИ = {
  разбирается: 'IN_REVIEW',
  уБухгалтерии: 'AT_ACCOUNTING',
} as const;

// Закрытые и отклонённые отсеиваются у всех подборок заявок. Иначе через месяц
// работы там будут сотни строк, и никто в них не посмотрит — ровно так умирают
// списки, заведённые «чтобы было видно всё».
const кромеЗавершённых = (имя: string) => ({
  universalIdentifier: свой('viewFilter', `снабжение:кроме-завершённых:${имя}`),
  fieldMetadataUniversalIdentifier: СОСТОЯНИЕ_ЗАЯВКИ,
  operand: ViewFilterOperand.IS_NOT,
  value: [КОДЫ_ЗАЯВКИ.закрыта, КОДЫ_ЗАЯВКИ.отклонена],
});

export const видыСнабжения: ViewManifest[] = [
  {
    // Норматив снабжению — один день на разбор. Это не «привезти», а именно
    // разобрать: расшифровать, что просил прораб, и подобрать номенклатуру.
    // Подборка отвечает на вопрос «что лежит на мне прямо сейчас».
    universalIdentifier: свой('view', 'снабжение:на-разбор'),
    name: 'Заявки на разбор',
    objectUniversalIdentifier: ОБЪЕКТЫ.заявка,
    type: ViewType.TABLE,
    icon: 'IconInbox',
    position: 1,
    filters: [
      {
        universalIdentifier: свой('viewFilter', 'снабжение:на-разбор'),
        fieldMetadataUniversalIdentifier: СОСТОЯНИЕ_ЗАЯВКИ,
        operand: ViewFilterOperand.IS,
        value: [КОДЫ_ЗАЯВКИ.согласована],
      },
    ],
  },
  {
    // Просрочка. На показе она звучала так: «по ней было указано, что её
    // привезут 24 августа... мне 25 утром придёт вот такое уведомление».
    // Здесь то же самое, но списком: обещали и не привезли.
    universalIdentifier: свой('view', 'снабжение:просрочено'),
    name: 'Просрочена поставка',
    objectUniversalIdentifier: ОБЪЕКТЫ.заявка,
    type: ViewType.TABLE,
    icon: 'IconAlertTriangle',
    position: 2,
    filters: [
      {
        universalIdentifier: свой('viewFilter', 'снабжение:просрочено'),
        fieldMetadataUniversalIdentifier: СРОК_ЗАЯВКИ,
        operand: ViewFilterOperand.IS_IN_PAST,
        value: '',
      },
      кромеЗавершённых('просрочено'),
    ],
  },
  {
    // Всё, что в работе. Нужна не снабженцу, а руководителю: один взгляд на то,
    // сколько всего висит и на каком этапе.
    universalIdentifier: свой('view', 'снабжение:в-работе'),
    name: 'Заявки в работе',
    objectUniversalIdentifier: ОБЪЕКТЫ.заявка,
    type: ViewType.TABLE,
    icon: 'IconProgress',
    position: 3,
    filters: [кромеЗавершённых('в-работе')],
  },
  {
    // Очередь на утверждение владельцем. Пока справка не утверждена, ни одна её
    // строка не стала списанием — то есть месяц не закрыт. Это единственная
    // подборка, которая напрямую держит деньги.
    universalIdentifier: свой('view', 'снабжение:справки-ждут'),
    name: 'Справки ждут утверждения',
    objectUniversalIdentifier: ОБЪЕКТЫ.справка,
    type: ViewType.TABLE,
    icon: 'IconFileCheck',
    position: 4,
    filters: [
      {
        universalIdentifier: свой('viewFilter', 'снабжение:справки-ждут'),
        fieldMetadataUniversalIdentifier: СОСТОЯНИЕ_СПРАВКИ,
        operand: ViewFilterOperand.IS,
        value: [КОДЫ_СПРАВКИ.разбирается, КОДЫ_СПРАВКИ.уБухгалтерии],
      },
    ],
  },
];

export const пунктыМенюСнабжения: NavigationMenuItemManifest[] = видыСнабжения.map(
  (вид, номер) => ({
    universalIdentifier: свой('navigationMenuItem', `снабжение:${вид.name}`),
    type: NavigationMenuItemType.VIEW,
    viewUniversalIdentifier: вид.universalIdentifier,
    icon: вид.icon,
    // Сразу за подборками задач по сроку: и то и другое — «что горит сегодня»,
    // и человек ищет их в одном месте.
    position: 110 + номер,
  }),
);
