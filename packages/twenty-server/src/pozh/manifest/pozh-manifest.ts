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

import { контрагент } from 'src/pozh/manifest/objects/kontragent';
import { ПРИЛОЖЕНИЕ, РОЛЬ_ПО_УМОЛЧАНИЮ } from 'src/pozh/manifest/pozh-ids';

const объекты = [контрагент];

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
  roles: [
    {
      universalIdentifier: РОЛЬ_ПО_УМОЛЧАНИЮ,
      label: 'Сотрудник ПожСервиса',
      description: 'Доступ к учёту. Права по объектам настраиваются отдельно.',
    },
  ],
  permissionFlags: [],
  skills: [],
  agents: [],
  objects: объекты,
  // Поля перечислены внутри объектов, отдельного списка не нужно.
  fields: [],
  logicFunctions: [],
  frontComponents: [],
  publicAssets: [],
  views: [],
  viewFields: [],
  navigationMenuItems: [],
  pageLayouts: [],
  pageLayoutTabs: [],
  commandMenuItems: [],
};
