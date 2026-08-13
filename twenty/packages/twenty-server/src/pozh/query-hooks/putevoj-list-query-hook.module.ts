import { Module } from '@nestjs/common';

import { PutevojListCreateManyPreQueryHook } from 'src/pozh/query-hooks/putevoj-list-create-many.pre-query.hook';
import { PutevojListCreateOnePreQueryHook } from 'src/pozh/query-hooks/putevoj-list-create-one.pre-query.hook';
import { PutevojListNumberValidationService } from 'src/pozh/query-hooks/putevoj-list-number-validation.service';
import { PutevojListUpdateOnePreQueryHook } from 'src/pozh/query-hooks/putevoj-list-update-one.pre-query.hook';

@Module({
  providers: [
    PutevojListNumberValidationService,
    PutevojListCreateOnePreQueryHook,
    PutevojListCreateManyPreQueryHook,
    PutevojListUpdateOnePreQueryHook,
  ],
})
export class PutevojListQueryHookModule {}
