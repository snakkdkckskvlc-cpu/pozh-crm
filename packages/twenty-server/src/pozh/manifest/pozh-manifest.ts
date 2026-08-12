// пожсервис: описание наших объектов для Twenty.
//
// Собирается здесь, выкладывается через `pozh-sync.ts`.
//
// ОПАСНОСТЬ, КОТОРУЮ НАДО ЗНАТЬ ДО ПЕРВОЙ ПРАВКИ. При выкладке включён режим
// «чего нет в описании, того нет и в базе». Убрали объект отсюда и выложили —
// **таблица удаляется вместе с данными**. Поэтому порядок работ обязательный, а
// не желательный: снимок базы → предварительный просмотр (`--просмотр`) →
// выкладка.

import { type Manifest } from 'twenty-shared/application';

import { данныеВодителя, указателиДанныхВодителя } from 'src/pozh/manifest/objects/dannye-voditelya';
import { договор } from 'src/pozh/manifest/objects/dogovor';
import { движениеДокумента } from 'src/pozh/manifest/objects/dvizhenie-dokumenta';
import { контрагент } from 'src/pozh/manifest/objects/kontragent';
import { машина } from 'src/pozh/manifest/objects/mashina';
import { огнетушитель } from 'src/pozh/manifest/objects/ognetushitel';
import { правилоСрока } from 'src/pozh/manifest/objects/pravilo-sroka';
import { прицеп } from 'src/pozh/manifest/objects/pricep';
import { прицепВЛисте } from 'src/pozh/manifest/objects/pricep-v-liste';
import { путевойЛист } from 'src/pozh/manifest/objects/putevoj-list';
import { рейс } from 'src/pozh/manifest/objects/rejs';
import { счётчикНомеров } from 'src/pozh/manifest/objects/schetchik-nomerov';
import { связиМеждуГруппами } from 'src/pozh/manifest/objects/svyazi-mezhdu-gruppami';
import { половиныДляЧужихОбъектов } from 'src/pozh/manifest/objects/svyazi-transporta';
import { точка } from 'src/pozh/manifest/objects/tochka';
import { водитель } from 'src/pozh/manifest/objects/voditel';
import { ПРИЛОЖЕНИЕ, РОЛЬ_ПО_УМОЛЧАНИЮ } from 'src/pozh/manifest/pozh-ids';
import { пунктыМеню } from 'src/pozh/manifest/pozh-menyu';
import { роли } from 'src/pozh/manifest/pozh-roli';
import { указателиИсточника } from 'src/pozh/manifest/pozh-ukazateli';

const объекты = [
  контрагент,
  машина,
  водитель,
  данныеВодителя,
  прицеп,
  точка,
  рейс,
  путевойЛист,
  прицепВЛисте,
  счётчикНомеров,
  договор,
  огнетушитель,
  правилоСрока,
  движениеДокумента,
];

export const манифестПожСервиса: Manifest = {
  application: {
    universalIdentifier: ПРИЛОЖЕНИЕ,
    defaultRoleUniversalIdentifier: РОЛЬ_ПО_УМОЛЧАНИЮ,
    displayName: 'ПожСервис',
    description: 'Учёт ООО «ПожСервис» и ООО «ПожМастер»: контрагенты, договоры, транспорт, сроки.',
    applicationVariables: {},
    packageJsonChecksum: null,
    yarnLockChecksum: null,
  },
  roles: роли,
  permissionFlags: [],
  skills: [],
  agents: [],
  objects: объекты,
  // Здесь — только те половины связей, что идут МЕЖДУ группами объектов.
  // Остальные поля описаны внутри своих объектов. Каждое поле знает, кому оно
  // принадлежит, поэтому список плоский.
  fields: [...связиМеждуГруппами, ...половиныДляЧужихОбъектов],
  logicFunctions: [],
  frontComponents: [],
  publicAssets: [],
  views: [],
  viewFields: [],
  // Без этих пунктов объекты есть в базе, но их никто не видит.
  navigationMenuItems: пунктыМеню,
  pageLayouts: [],
  pageLayoutTabs: [],
  commandMenuItems: [],
  // Составной признак уникальности — единственный способ сделать связь
  // «один-к-одному»: он же держит персональные данные водителя привязанными
  // ровно к одному водителю.
  indexes: [...указателиДанныхВодителя, ...указателиИсточника],
};
