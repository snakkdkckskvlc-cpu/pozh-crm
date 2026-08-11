// пожсервис: модуль связи со службой документов.
import { Module } from '@nestjs/common';

import { PozhEmbedController } from 'src/pozh/pozh-embed.controller';

@Module({
  controllers: [PozhEmbedController],
})
export class PozhModule {}
