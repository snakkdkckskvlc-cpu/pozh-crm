// пожсервис: модуль связи со службой документов.
//
// AuthModule и WorkspaceCacheStorageModule здесь не «на всякий случай»: из них
// берётся служба разбора токена, без которой страж входа не собирается и сервер
// падает при запуске. Тот же набор у остальных ручек Twenty со входом.
import { Module } from '@nestjs/common';

import { AuthModule } from 'src/engine/core-modules/auth/auth.module';
import { RoleModule } from 'src/engine/metadata-modules/role/role.module';
import { UserRoleModule } from 'src/engine/metadata-modules/user-role/user-role.module';
import { WorkspaceCacheStorageModule } from 'src/engine/workspace-cache-storage/workspace-cache-storage.module';
import { PozhEmbedController } from 'src/pozh/pozh-embed.controller';

@Module({
  // UserRoleModule и RoleModule добавлены 03.09.2026: по ним ручка узнаёт, какая
  // должность у вошедшего, и кладёт её код в пропуск. Без них разделение по
  // должностям есть в CRM, но не доезжает до экранов службы документов — она
  // отдаёт всем один и тот же общий набор.
  imports: [AuthModule, WorkspaceCacheStorageModule, UserRoleModule, RoleModule],
  controllers: [PozhEmbedController],
})
export class PozhModule {}
