// пожсервис: подборки задач по сроку — вместо напоминаний.
//
// ЗАЧЕМ ВООБЩЕ. Весь бизнес компании держится на сроках: огнетушитель
// проверяется раз в год, перезаряжается раз в пять лет, договор
// перезаключается. Срок у задачи есть, но он молчит.
//
// ПОЧЕМУ ПОДБОРКА, А НЕ УВЕДОМЛЕНИЕ. В YouGile срок напоминает о себе сам —
// письмом и на телефон. У нас так не выйдет, и это не лень:
//
//   1. Приложение не имеет права выходить в интернет — это записано в договорах
//      с заказчиком. Ни почты, ни сообщений на телефон не будет.
//   2. Своего окна уведомлений в Twenty нет вовсе.
//
// Значит, напоминание должно быть там, куда человек и так смотрит: в меню, где
// он открывает свои задачи. Подборка «Горит на этой неделе» решает ту же
// задачу — не забыть срок — и работает без единой внешней связи.
//
// ЧТО ЭТО НЕ РЕШАЕТ, И ЭТО НАДО СКАЗАТЬ ВСЛУХ. Человек, который не открыл
// программу, ничего не узнает. Настоящее напоминание в такой конторе — это
// повторяющееся дело у ответственного, а не всплывающее окно.

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

import { ПРИЛОЖЕНИЕ } from 'src/pozh/manifest/pozh-ids';

/**
 * Встроенные задача и её поля. Опознаватели постоянные, взяты из работающей
 * системы: у встроенных объектов Twenty они не меняются между установками.
 */
const ЗАДАЧА = '20202020-1ba1-48ba-bc83-ef7e5990ed10';
const СРОК = '20202020-fd99-40da-951b-4cb9a352fce3';
const СОСТОЯНИЕ = '20202020-70bc-48f9-89c5-6aa730b151e0';

const опознаватель = (что: string, имя: string): string =>
  computeDeterministicUuid({
    entityNamespace: что as never,
    value: имя,
    applicationUniversalIdentifier: ПРИЛОЖЕНИЕ,
  });

// «Сделана» отсеивается у обеих подборок: в списке горящего не место тому, что
// уже закрыто, иначе через месяц там будет двести строк и никто не посмотрит.
const кромеСделанных = {
  universalIdentifier: опознаватель('viewFilter', 'срок:кроме-сделанных'),
  fieldMetadataUniversalIdentifier: СОСТОЯНИЕ,
  operand: ViewFilterOperand.IS_NOT,
  value: ['DONE'],
};

export const видыЗадач: ViewManifest[] = [
  {
    universalIdentifier: опознаватель('view', 'срок:горит'),
    name: 'Горит на этой неделе',
    objectUniversalIdentifier: ЗАДАЧА,
    type: ViewType.TABLE,
    icon: 'IconAlarm',
    position: 1,
    filters: [
      {
        universalIdentifier: опознаватель('viewFilter', 'срок:горит'),
        fieldMetadataUniversalIdentifier: СРОК,
        operand: ViewFilterOperand.IS_RELATIVE,
        // Семь дней, а не три: обслуживание огнетушителя требует поездки на
        // объект, а её надо успеть поставить в план недели.
        //
        // Записывается строкой «NEXT_7_DAY», а не разложенным на части
        // значением: так это принимает Twenty. Ошибка при выкладке подсказала
        // формат сама — редкий случай, когда сообщение об отказе полезно.
        value: 'NEXT_7_DAY',
      },
      кромеСделанных,
    ],
  },
  {
    universalIdentifier: опознаватель('view', 'срок:просрочено'),
    name: 'Просрочено',
    objectUniversalIdentifier: ЗАДАЧА,
    type: ViewType.TABLE,
    icon: 'IconAlertTriangle',
    position: 2,
    filters: [
      {
        universalIdentifier: опознаватель('viewFilter', 'срок:просрочено'),
        fieldMetadataUniversalIdentifier: СРОК,
        operand: ViewFilterOperand.IS_IN_PAST,
        value: '',
      },
      { ...кромеСделанных, universalIdentifier: опознаватель('viewFilter', 'срок:кроме-сделанных-2') },
    ],
  },
];

export const пунктыМенюЗадач: NavigationMenuItemManifest[] = видыЗадач.map(
  (вид, номер) => ({
    universalIdentifier: опознаватель('navigationMenuItem', `срок:${вид.name}`),
    type: NavigationMenuItemType.VIEW,
    viewUniversalIdentifier: вид.universalIdentifier,
    icon: вид.icon,
    // После наших разделов, но до служебных: человек заходит сюда каждое утро.
    position: 100 + номер,
  }),
);
