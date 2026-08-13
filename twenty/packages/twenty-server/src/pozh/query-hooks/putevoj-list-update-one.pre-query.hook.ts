import { type WorkspacePreQueryHookInstance } from 'src/engine/api/graphql/workspace-query-runner/workspace-query-hook/interfaces/workspace-query-hook.interface';
import { type UpdateOneResolverArgs } from 'src/engine/api/graphql/workspace-resolver-builder/interfaces/workspace-resolvers-builder.interface';

import { WorkspaceQueryHook } from 'src/engine/api/graphql/workspace-query-runner/workspace-query-hook/decorators/workspace-query-hook.decorator';
import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';
import { PutevojListNumberValidationService } from 'src/pozh/query-hooks/putevoj-list-number-validation.service';
import { type WaybillNumberFields } from 'src/pozh/query-hooks/waybill-number-validation.util';

@WorkspaceQueryHook(`pozhWaybill.updateOne`)
export class PutevojListUpdateOnePreQueryHook implements WorkspacePreQueryHookInstance {
  constructor(
    private readonly putevojListNumberValidationService: PutevojListNumberValidationService,
  ) {}

  async execute(
    authContext: WorkspaceAuthContext,
    _objectName: string,
    payload: UpdateOneResolverArgs<WaybillNumberFields>,
  ): Promise<UpdateOneResolverArgs<WaybillNumberFields>> {
    await this.putevojListNumberValidationService.validateUpdateOne(
      authContext,
      payload.id,
      payload.data,
    );

    return payload;
  }
}
