import { Injectable } from '@nestjs/common';

import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import {
  assertWaybillNumberHasOrganizationAndSeries,
  type WaybillNumberFields,
} from 'src/pozh/query-hooks/waybill-number-validation.util';

const POZH_WAYBILL_OBJECT_NAME = 'pozhWaybill';

@Injectable()
export class PutevojListNumberValidationService {
  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  validateCreate(data: WaybillNumberFields): void {
    assertWaybillNumberHasOrganizationAndSeries(data);
  }

  async validateUpdateOne(
    authContext: WorkspaceAuthContext,
    recordId: string,
    data: WaybillNumberFields,
  ): Promise<void> {
    // Правка обычно трогает одно-два поля. Если ни номер, ни организация, ни
    // серия не изменяются, запись уже проходила эту проверку раньше — читать
    // базу незачем.
    if (
      !('number' in data) &&
      !('organizationId' in data) &&
      !('series' in data)
    ) {
      return;
    }

    const existingRecord =
      await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
        async () => {
          const repository = await this.globalWorkspaceOrmManager.getRepository<
            WaybillNumberFields & { id: string }
          >(authContext.workspace.id, POZH_WAYBILL_OBJECT_NAME);

          return repository.findOneBy({ id: recordId });
        },
        authContext,
      );

    if (!existingRecord) {
      return;
    }

    assertWaybillNumberHasOrganizationAndSeries({
      ...existingRecord,
      ...data,
    });
  }
}
