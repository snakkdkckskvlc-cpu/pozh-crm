// пожсервис: замок на пропуск базы, если у путевого листа с номером пусты
// организация или серия.
//
// ПОЧЕМУ ПРОВЕРКА ЗДЕСЬ, А НЕ В СХЕМЕ. Составной указатель уникальности
// organization+series+number (см. `pozh-ukazateli.ts`, указательНомераЛиста)
// не срабатывает, если организация или серия пусты: PostgreSQL считает NULL
// несравнимым даже с другим NULL. Два листа с одним номером и без организации
// база пропустит молча — проверено живым обходом. Сделать организацию
// обязательной в схеме нельзя: черновик заводится без неё осознанно (план
// схемы, §8, решение по обязательности — «правило», а не «база»). Значит
// защита — на уровне записи.

import { msg } from '@lingui/core/macro';
import { isNonEmptyString } from '@sniptt/guards';

import {
  CommonQueryRunnerException,
  CommonQueryRunnerExceptionCode,
} from 'src/engine/api/common/common-query-runners/errors/common-query-runner.exception';

export type WaybillNumberFields = {
  number?: string | null;
  series?: string | null;
  organizationId?: string | null;
};

export const assertWaybillNumberHasOrganizationAndSeries = (
  fields: WaybillNumberFields,
): void => {
  if (!isNonEmptyString(fields.number)) {
    return;
  }

  if (
    isNonEmptyString(fields.organizationId) &&
    isNonEmptyString(fields.series)
  ) {
    return;
  }

  throw new CommonQueryRunnerException(
    'Waybill number is filled in but organization or series is empty',
    CommonQueryRunnerExceptionCode.BAD_REQUEST,
    {
      userFriendlyMessage: msg`У путевого листа с заполненным номером должны быть указаны организация и серия бланка — без них номер не защищён от повтора.`,
    },
  );
};
