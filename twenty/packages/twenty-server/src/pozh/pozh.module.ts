// пожсервис: модуль связи со службой документов.
//
// AuthModule и WorkspaceCacheStorageModule здесь не «на всякий случай»: из них
// берётся служба разбора токена, без которой страж входа не собирается и сервер
// падает при запуске. Тот же набор у остальных ручек Twenty со входом.
import { Module } from '@nestjs/common';

import { AuthModule } from 'src/engine/core-modules/auth/auth.module';
import { WorkspaceCacheStorageModule } from 'src/engine/workspace-cache-storage/workspace-cache-storage.module';
import { PozhEmbedController } from 'src/pozh/pozh-embed.controller';

@Module({
  imports: [AuthModule, WorkspaceCacheStorageModule],
  controllers: [PozhEmbedController],
})
export class PozhModule {}
