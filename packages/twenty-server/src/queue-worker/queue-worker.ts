// пожсервис: запрет выхода в интернет — ПЕРВОЙ строкой, до 'src/instrument'.
// Рабочий процесс — вторая точка входа приложения, и именно здесь крутятся
// ВСЕ почасовые и суточные задания: синхронизация магазина приложений (раз в
// час в реестр пакетов), проверка обновлений, проверка платного ключа,
// синхронизация почты и календарей. Запрет, поставленный только в main.ts,
// половину обращений наружу не закрывал вовсе.
import { установитьЗапретСети } from 'src/pozh-netguard';

установитьЗапретСети();

import { NestFactory } from '@nestjs/core';

import { ExceptionHandlerService } from 'src/engine/core-modules/exception-handler/exception-handler.service';
import { LoggerService } from 'src/engine/core-modules/logger/logger.service';
import { shouldCaptureException } from 'src/engine/utils/global-exception-handler.util';
import 'src/instrument';
import { QueueWorkerModule } from 'src/queue-worker/queue-worker.module';

async function bootstrap() {
  let exceptionHandlerService: ExceptionHandlerService | undefined;
  let loggerService: LoggerService | undefined;

  try {
    const app = await NestFactory.createApplicationContext(QueueWorkerModule, {
      bufferLogs: process.env.LOGGER_IS_BUFFER_ENABLED === 'true',
    });

    loggerService = app.get(LoggerService);
    exceptionHandlerService = app.get(ExceptionHandlerService);

    // Inject our logger
    app.useLogger(loggerService ?? false);

    app.enableShutdownHooks();
  } catch (err) {
    loggerService?.error(err?.message, err?.name);

    if (shouldCaptureException(err)) {
      exceptionHandlerService?.captureExceptions([err]);
    }

    throw err;
  }
}
void bootstrap();
