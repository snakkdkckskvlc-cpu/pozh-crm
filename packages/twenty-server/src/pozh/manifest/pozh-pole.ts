// пожсервис: короткие помощники для описания полей.
//
// Без них каждое поле — двенадцать строк однообразной обвязки, и в этой обвязке
// теряется единственное, что важно: как поле называется по-русски и обязательно
// ли оно. Полей около полутора сотен.

import { v5 } from 'uuid';

import {
  getFieldUniversalIdentifier,
  type ObjectFieldManifest,
} from 'twenty-shared/application';
import {
  FieldMetadataType,
  RelationOnDeleteAction,
  RelationType,
} from 'twenty-shared/types';

import { ПРИЛОЖЕНИЕ } from 'src/pozh/manifest/pozh-ids';

export const опознаватель = (объект: string, имя: string): string =>
  getFieldUniversalIdentifier({
    applicationUniversalIdentifier: ПРИЛОЖЕНИЕ,
    objectUniversalIdentifier: объект,
    name: имя,
  });

type ОбщееПоля = {
  объект: string;
  имя: string;
  подпись: string;
  пояснение?: string;
  уникально?: boolean;
  обязательно?: boolean;
  правитЧеловек?: boolean;
};

// Текст — основной тип в этом проекте, и это осознанно: проверок формата при
// вводе в Twenty нет вовсе, а ИНН с ведущим нулём числом хранить нельзя.
// Контрольные суммы считает служба документов.
export const текст = ({
  объект,
  имя,
  подпись,
  пояснение,
  уникально,
  обязательно,
  правитЧеловек,
}: ОбщееПоля): ObjectFieldManifest => ({
  universalIdentifier: опознаватель(объект, имя),
  objectUniversalIdentifier: объект,
  type: FieldMetadataType.TEXT,
  name: имя,
  label: подпись,
  ...(пояснение === undefined ? {} : { description: пояснение }),
  ...(уникально === true ? { isUnique: true } : {}),
  ...(правитЧеловек === false ? { isUIEditable: false } : {}),
  // «Обязательное» в Twenty означает не «нельзя оставить пустым», а «есть
  // значение по умолчанию» — см. правило 3 плана схемы. Поэтому у обязательных
  // текстовых полей пустая строка по умолчанию, а настоящую обязательность
  // держит служба документов при записи.
  //
  // И вместе с уникальностью это НЕ СОЧЕТАЕТСЯ: база отказывается ставить
  // признак уникальности на поле со значением по умолчанию — иначе все пустые
  // строки считались бы повторами друг друга. Проверено отказом при выкладке:
  // «Unique index cannot be created for field name of type TEXT».
  //
  // Поэтому уникальность здесь побеждает: её держит база, а обязательность —
  // служба документов, которая и так проверяет содержимое.
  ...(обязательно === true && уникально !== true
    ? { defaultValue: "''", isNullable: false }
    : { isNullable: true }),
});

export const флажок = ({
  объект,
  имя,
  подпись,
  пояснение,
  поумолчанию = false,
}: Omit<ОбщееПоля, 'уникально' | 'обязательно'> & {
  поумолчанию?: boolean;
}): ObjectFieldManifest => ({
  universalIdentifier: опознаватель(объект, имя),
  objectUniversalIdentifier: объект,
  type: FieldMetadataType.BOOLEAN,
  name: имя,
  label: подпись,
  ...(пояснение === undefined ? {} : { description: пояснение }),
  defaultValue: поумолчанию,
  isNullable: false,
});

export const число = ({
  объект,
  имя,
  подпись,
  пояснение,
  обязательно,
}: ОбщееПоля): ObjectFieldManifest => ({
  universalIdentifier: опознаватель(объект, имя),
  objectUniversalIdentifier: объект,
  type: FieldMetadataType.NUMBER,
  name: имя,
  label: подпись,
  ...(пояснение === undefined ? {} : { description: пояснение }),
  ...(обязательно === true ? { defaultValue: 0, isNullable: false } : { isNullable: true }),
});

export const датаВремя = ({
  объект,
  имя,
  подпись,
  пояснение,
}: ОбщееПоля): ObjectFieldManifest => ({
  universalIdentifier: опознаватель(объект, имя),
  objectUniversalIdentifier: объект,
  type: FieldMetadataType.DATE_TIME,
  name: имя,
  label: подпись,
  ...(пояснение === undefined ? {} : { description: пояснение }),
  isNullable: true,
});

export const дата = ({
  объект,
  имя,
  подпись,
  пояснение,
}: ОбщееПоля): ObjectFieldManifest => ({
  universalIdentifier: опознаватель(объект, имя),
  objectUniversalIdentifier: объект,
  type: FieldMetadataType.DATE,
  name: имя,
  label: подпись,
  ...(пояснение === undefined ? {} : { description: пояснение }),
  isNullable: true,
});

export const телефоны = ({
  объект,
  имя,
  подпись,
  пояснение,
}: ОбщееПоля): ObjectFieldManifest => ({
  universalIdentifier: опознаватель(объект, имя),
  objectUniversalIdentifier: объект,
  type: FieldMetadataType.PHONES,
  name: имя,
  label: подпись,
  ...(пояснение === undefined ? {} : { description: пояснение }),
  isNullable: true,
});

// Деньги — только этим типом и только целым числом копеек на входе службы.
// Дробное число для денег в проекте запрещено: на нём уже терялись копейки.
export const деньги = ({
  объект,
  имя,
  подпись,
  пояснение,
}: ОбщееПоля): ObjectFieldManifest => ({
  universalIdentifier: опознаватель(объект, имя),
  objectUniversalIdentifier: объект,
  type: FieldMetadataType.CURRENCY,
  name: имя,
  label: подпись,
  ...(пояснение === undefined ? {} : { description: пояснение }),
  isNullable: true,
});

// Код варианта Twenty принимает только прописными и через подчёркивание.
// Приводится здесь, а не в каждом объекте: код человеку не виден, а ошибку в нём
// видно только при выкладке.
const кодВарианта = (значение: string): string =>
  значение
    .replace(/([a-zа-я])([A-ZА-Я])/g, '$1_$2')
    .replace(/[^0-9A-Za-zА-Яа-я]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase();

export const выбор = ({
  объект,
  имя,
  подпись,
  пояснение,
  варианты,
  поумолчанию,
}: Omit<ОбщееПоля, 'уникально' | 'обязательно'> & {
  варианты: { value: string; label: string; color: string }[];
  поумолчанию?: string;
}): ObjectFieldManifest => ({
  universalIdentifier: опознаватель(объект, имя),
  objectUniversalIdentifier: объект,
  type: FieldMetadataType.SELECT,
  name: имя,
  label: подпись,
  ...(пояснение === undefined ? {} : { description: пояснение }),
  // У каждого варианта должен быть свой опознаватель, иначе выкладка падает с
  // «повторяющийся опознаватель варианта»: без него все варианты для Twenty
  // выглядят одним и тем же. Считается от имени поля и значения — значит не
  // меняется между выкладками, и уже расставленные значения не слетают.
  options: варианты.map((в, i) => {
    // Код варианта Twenty принимает только прописными и через подчёркивание.
    // Правится здесь, а не в каждом объекте: код человеку не виден, а ошибку в
    // нём видно только при выкладке.
    const код = кодВарианта(в.value);

    // А подпись НЕ правится молча: её читает человек, и подобранная за него
    // замена запятой может оказаться бессмыслицей. Запятые Twenty не принимает —
    // значит подпись надо переписать там, где она задана.
    if (в.label.includes(',')) {
      throw new Error(
        `Подпись варианта «${в.label}» (поле «${имя}») содержит запятую — Twenty её не принимает. `
          + 'Перепишите подпись без запятой в описании объекта.',
      );
    }

    return {
      ...в,
      value: код,
      id: v5(`${объект}:${имя}:${код}`, ПРИЛОЖЕНИЕ),
      position: i,
    };
  }),
  // Значение по умолчанию приводится ТЕМ ЖЕ правилом: иначе оно перестаёт
  // совпадать со списком вариантов, и выкладка падает с «значение по умолчанию
  // должно быть одним из вариантов». Так и вышло с первого раза.
  ...(поумолчанию === undefined
    ? { isNullable: true }
    : { defaultValue: `'${кодВарианта(поумолчанию)}'`, isNullable: false }),
});

/**
 * Пара полей «откуда приехала запись». Есть у всех объектов и нужна ровно для
 * одного: при повторном переносе из старой базы запись не должна задвоиться.
 * Уникальна ПАРА, а не каждое поле по отдельности, — такой признак заводится
 * только описанием в коде.
 */
export const источник = (объект: string): ObjectFieldManifest[] => [
  // ОБА ПОЛЯ НЕОБЯЗАТЕЛЬНЫ, И ЭТО ГЛАВНОЕ ЗДЕСЬ.
  //
  // Сначала у них стояло значение по умолчанию — пустая строка. Выглядело
  // безобидно, а сломало заведение записей руками НАСМЕРТЬ: пара уникальна,
  // у всех записей без переноса она одна и та же («пусто», «пусто»), и вторая
  // такая запись сталкивалась с первой.
  //
  // Найдено обходом в браузере: первый контрагент завёлся, второй молча не
  // завёлся — ни строки об ошибке, счётчик остался «1». Отказ, которого человек
  // не видит, в этом проекте считается худшим видом отказа.
  //
  // Пусто вместо пустой строки решает всё: база считает «пусто» несравнимым
  // даже с другим «пусто», поэтому руками можно завести сколько угодно записей,
  // а у приехавших из старой базы пара по-прежнему одна на всех.
  текст({
    объект,
    имя: 'sourceSystem',
    подпись: 'Система-источник',
    пояснение:
      'Откуда приехала запись. Заполняет перенос; у заведённых руками пусто, и так и надо.',
    правитЧеловек: false,
  }),
  текст({
    объект,
    имя: 'sourceId',
    подпись: 'Идентификатор в источнике',
    пояснение: 'Номер записи в старой базе. Держит перенос от задвоения.',
    правитЧеловек: false,
  }),
];

/**
 * Связь между объектами. Возвращает СРАЗУ ОБЕ половины: ссылку на владельца и
 * обратный список у него. Половинки нельзя описывать порознь — каждая ссылается
 * на опознаватель другой, и забытая вторая роняет всю выкладку.
 *
 * `приУдалении` обязателен по правилу 5 плана схемы, и у него нет значения по
 * умолчанию намеренно: «что станет с рейсами, если удалить машину» — это
 * решение про данные компании, а не мелочь оформления.
 *
 * SET_NULL — ссылка обнуляется, запись живёт (рейс без машины виден, и это
 * лучше, чем исчезнувший рейс). CASCADE — запись удаляется следом (строка
 * путевого листа без листа смысла не имеет). RESTRICT — удалить не дадут.
 */
export const связь = ({
  откуда,
  куда,
  имяСсылки,
  подписьСсылки,
  имяСписка,
  подписьСписка,
  приУдалении,
  пояснение,
}: {
  откуда: string;
  куда: string;
  имяСсылки: string;
  подписьСсылки: string;
  имяСписка: string;
  подписьСписка: string;
  приУдалении: RelationOnDeleteAction;
  пояснение?: string;
}): { ссылка: ObjectFieldManifest; список: ObjectFieldManifest } => {
  const идСсылки = опознаватель(откуда, имяСсылки);
  const идСписка = опознаватель(куда, имяСписка);

  return {
    ссылка: {
      universalIdentifier: идСсылки,
      objectUniversalIdentifier: откуда,
      type: FieldMetadataType.RELATION,
      name: имяСсылки,
      label: подписьСсылки,
      ...(пояснение === undefined ? {} : { description: пояснение }),
      relationTargetFieldMetadataUniversalIdentifier: идСписка,
      relationTargetObjectMetadataUniversalIdentifier: куда,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        joinColumnName: `${имяСсылки}Id`,
        onDelete: приУдалении,
      },
    },
    список: {
      universalIdentifier: идСписка,
      objectUniversalIdentifier: куда,
      type: FieldMetadataType.RELATION,
      name: имяСписка,
      label: подписьСписка,
      relationTargetFieldMetadataUniversalIdentifier: идСсылки,
      relationTargetObjectMetadataUniversalIdentifier: откуда,
      universalSettings: {
        relationType: RelationType.ONE_TO_MANY,
      },
    },
  };
};
