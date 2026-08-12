// пожсервис: составные указатели уникальности.
//
// ЗАЧЕМ. У каждого объекта есть пара «Система-источник» и «Идентификатор в
// источнике» — откуда приехала запись при переносе из старой базы. Уникальна
// должна быть ПАРА: один и тот же номер записи в разных источниках — это разные
// записи, а один и тот же номер в одном источнике — это повтор.
//
// Без этого указателя повторный запуск переноса заводит всё заново: тридцать
// сотрудников получают удвоенный справочник контрагентов и не понимают, какой
// из двух настоящий. Проверка «а нет ли уже такого» на стороне переноса тут не
// помогает: два переноса, запущенные одновременно, оба ответят «нет» и оба
// запишут.
//
// СОСТАВНОЙ УКАЗАТЕЛЬ ЗАВОДИТСЯ ТОЛЬКО ОПИСАНИЕМ В КОДЕ. Мышкой и через
// программный интерфейс признак уникальности жёстко выставлен в «нет» — это одна
// из двух причин, по которым объекты здесь описываются кодом.

import { getIndexUniversalIdentifier, type IndexManifest } from 'twenty-shared/application';

import { ОБЪЕКТЫ, ПРИЛОЖЕНИЕ } from 'src/pozh/manifest/pozh-ids';
import { опознаватель } from 'src/pozh/manifest/pozh-pole';

// Объекты, которых в старой базе нет, а значит и переносить нечего: связка
// прицепов с листом и счётчик номеров заводятся уже здесь.
const БЕЗ_ПЕРЕНОСА = new Set<string>([
  ОБЪЕКТЫ.прицепВЛисте,
  ОБЪЕКТЫ.счётчикНомеров,
  ОБЪЕКТЫ.правилоСрока,
  ОБЪЕКТЫ.данныеВодителя,
]);

const указательИсточника = (объект: string): IndexManifest => ({
  universalIdentifier: getIndexUniversalIdentifier({
    applicationUniversalIdentifier: ПРИЛОЖЕНИЕ,
    objectUniversalIdentifier: объект,
    name: 'sourceUnique',
  }),
  objectUniversalIdentifier: объект,
  isUnique: true,
  fields: ['sourceSystem', 'sourceId'].map((поле) => ({
    universalIdentifier: getIndexUniversalIdentifier({
      applicationUniversalIdentifier: ПРИЛОЖЕНИЕ,
      objectUniversalIdentifier: объект,
      name: `sourceUnique:${поле}`,
    }),
    fieldUniversalIdentifier: опознаватель(объект, поле),
  })),
});

export const указателиИсточника: IndexManifest[] = Object.values(ОБЪЕКТЫ)
  .filter((объект) => !БЕЗ_ПЕРЕНОСА.has(объект))
  .map(указательИсточника);
