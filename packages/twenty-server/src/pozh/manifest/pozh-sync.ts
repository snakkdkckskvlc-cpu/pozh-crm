// пожсервис: выкладка описания объектов на работающий сервер.
//
// Запуск (из packages/twenty-server):
//   npx tsx src/pozh/manifest/pozh-sync.ts --просмотр    # ничего не меняет
//   npx tsx src/pozh/manifest/pozh-sync.ts               # выкладывает
//
// Предварительный просмотр обязателен: при выкладке включён режим «чего нет в
// описании, того нет и в базе», и убранный по недосмотру объект уносит таблицу
// вместе с данными.

import { манифестПожСервиса } from './pozh-manifest';

const АДРЕС = process.env.POZH_TWENTY_URL ?? 'http://localhost:3000';
const ПОЧТА = process.env.POZH_ADMIN_EMAIL ?? 'tim@apple.dev';
const ПАРОЛЬ = process.env.POZH_ADMIN_PASSWORD ?? 'tim@apple.dev';
const ИСТОЧНИК = process.env.POZH_FRONT_URL ?? 'http://localhost:3001';

const просмотр = process.argv.includes('--просмотр');

const запрос = async (query: string, variables: unknown, token?: string) => {
  const ответ = await fetch(`${АДРЕС}/metadata`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: ИСТОЧНИК,
      ...(token === undefined ? {} : { authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ query, variables }),
  });

  const тело = await ответ.json();

  if (тело.errors) {
    // Подробности лежат в дополнении к ошибке, а не в её тексте: без них
    // сообщение звучит как «что-то не так с описанием» и не помогает.
    console.error(JSON.stringify(тело.errors, null, 1).slice(0, 4000));
    throw new Error(тело.errors[0].message);
  }

  return тело.data;
};

const войти = async (): Promise<string> => {
  const a = await запрос(
    `mutation($e:String!,$p:String!){ signIn(email:$e,password:$p){ availableWorkspaces { availableWorkspacesForSignIn { loginToken } } } }`,
    { e: ПОЧТА, p: ПАРОЛЬ },
  );
  const пропуск = a.signIn.availableWorkspaces.availableWorkspacesForSignIn[0].loginToken;

  const b = await запрос(
    `mutation($l:String!,$o:String!){ getAuthTokensFromLoginToken(loginToken:$l,origin:$o){ tokens { accessOrWorkspaceAgnosticToken { token } } } }`,
    { l: пропуск, o: ИСТОЧНИК },
  );

  return b.getAuthTokensFromLoginToken.tokens.accessOrWorkspaceAgnosticToken.token;
};

const главное = async () => {
  const токен = await войти();

  const данные = await запрос(
    `mutation($manifest:JSON!,$dryRun:Boolean){ syncApplication(manifest:$manifest,dryRun:$dryRun){ applicationUniversalIdentifier actions } }`,
    { manifest: манифестПожСервиса, dryRun: просмотр },
    токен,
  );

  const действия = данные.syncApplication.actions ?? [];

  console.log(просмотр ? 'ПРЕДВАРИТЕЛЬНЫЙ ПРОСМОТР — база не тронута' : 'ВЫЛОЖЕНО');
  console.log(`объектов в описании: ${манифестПожСервиса.objects.length}`);
  console.log(`действий над базой: ${действия.length}`);

  const сводка = new Map<string, number>();

  for (const д of действия as { type?: string }[]) {
    const вид = д.type ?? 'без вида';

    сводка.set(вид, (сводка.get(вид) ?? 0) + 1);
  }

  for (const [вид, сколько] of [...сводка].sort()) {
    console.log(`  ${вид}: ${сколько}`);
  }

  // Удаление показывается отдельно и всегда: именно оно уносит данные.
  const опасные = (действия as { type?: string }[]).filter((д) =>
    (д.type ?? '').toLowerCase().includes('delete'),
  );

  if (опасные.length > 0) {
    console.log(`\n!!! УДАЛЕНИЙ: ${опасные.length} — проверьте, что это ожидаемо`);
    console.log(JSON.stringify(опасные, null, 1).slice(0, 2000));
  }
};

главное().catch((e) => {
  console.error('не вышло:', e.message);
  process.exit(1);
});
