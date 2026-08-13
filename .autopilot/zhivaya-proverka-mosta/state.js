window.STATE =
{
  "slug": "vklyuchit-most",
  "title": "Включить мост, пройти рамку живьём и свести склады",
  "mode": "semi",
  "depth": "deep",
  "tier": "T2",
  "briefFile": "2026-08-13-brief.md",
  "memoryFile": "CLAUDE.md",
  "startedAt": "2026-08-13T01:30:39+03:00",
  "updatedAt": "2026-08-13T12:22:34+03:00",
  "finishedAt": "2026-08-13T12:22:34+03:00",
  "stages": [
    {
      "id": "preflight",
      "status": "done",
      "startedAt": "2026-08-13T01:30:39+03:00",
      "finishedAt": "2026-08-13T01:31:10+03:00",
      "note": "прошлая сборка убрана в архив"
    },
    {
      "id": "manifest",
      "status": "done",
      "startedAt": "2026-08-13T01:31:10+03:00",
      "finishedAt": "2026-08-13T01:32:00+03:00",
      "note": "3 требования"
    },
    {
      "id": "briefing",
      "status": "skipped",
      "note": "вопросов не потребовалось — задача однозначна"
    },
    {
      "id": "spec",
      "status": "done",
      "startedAt": "2026-08-13T01:32:00+03:00",
      "finishedAt": "2026-08-13T01:33:00+03:00",
      "note": "проверка живьём, код не переписываем"
    },
    {
      "id": "plan",
      "status": "done",
      "startedAt": "2026-08-13T01:50:00+03:00",
      "finishedAt": "2026-08-13T01:52:00+03:00",
      "note": "4 таска, 2 волны"
    },
    {
      "id": "build",
      "status": "done",
      "startedAt": "2026-08-13T01:33:00+03:00",
      "note": "5 тасков, все закрыты",
      "finishedAt": "2026-08-13T12:21:23+03:00"
    },
    {
      "id": "review",
      "status": "done",
      "startedAt": "2026-08-13T02:07:00+03:00",
      "note": "рамку подтвердил владелец глазами",
      "finishedAt": "2026-08-13T12:05:00+03:00"
    },
    {
      "id": "final",
      "status": "done",
      "startedAt": "2026-08-13T12:05:00+03:00",
      "finishedAt": "2026-08-13T12:22:34+03:00",
      "note": "5 тасков, все закрыты"
    }
  ],
  "requirements": {
    "total": 4,
    "done": 4,
    "inTicket": 0,
    "inSpec": 0,
    "placeholder": 0,
    "deferred": 0,
    "dropped": 0
  },
  "tickets": [
    {
      "id": "01",
      "title": "Включить мост: общий ключ с обеих сторон",
      "requirements": [
        "H03"
      ],
      "blockedBy": [],
      "wave": 1,
      "zone": [
        ".env обеих систем"
      ],
      "status": "done",
      "startedAt": "2026-08-13T01:38:00+03:00",
      "retries": 0,
      "repairs": 0,
      "concerns": [
        "ключ теперь читается из папки данных, если его нет в окружении — иначе на боевом сервере рамка не заработала бы никогда",
        "отпечатки ключей с обеих сторон сверены — совпадают"
      ],
      "finishedAt": "2026-08-13T01:56:19+03:00",
      "commit": "8ae412a",
      "files": [
        "views/api_v1.py",
        "tests/unit/test_gate_pass_istochnik_klyucha.py",
        ".env.example",
        "docs/07-ops/install-server.md",
        "integrity.json"
      ],
      "tests": {
        "passed": 31,
        "failed": 0
      }
    },
    {
      "id": "02",
      "title": "Свести разошедшиеся копии PRODUCT.md",
      "requirements": [
        "H02"
      ],
      "blockedBy": [],
      "wave": 1,
      "zone": [
        "PRODUCT.md"
      ],
      "status": "done",
      "retries": 0,
      "repairs": 0,
      "concerns": [
        "копии разошлись после приёмки — сведены, обе по 298 строк"
      ],
      "startedAt": "2026-08-13T01:55:00+03:00",
      "finishedAt": "2026-08-13T02:02:00+03:00",
      "files": [
        "PRODUCT.md"
      ]
    },
    {
      "id": "03",
      "title": "Поднять интерфейс CRM и пройти все 24 экрана в рамке",
      "requirements": [
        "H02"
      ],
      "blockedBy": [
        "01"
      ],
      "wave": 2,
      "zone": [
        "проверка живьём"
      ],
      "status": "done",
      "retries": 0,
      "repairs": 0,
      "startedAt": "2026-08-13T02:07:00+03:00",
      "concerns": [
        "интерфейс CRM поднят, но слушает только localhost — на 127.0.0.1 не отвечает",
        "служба отвечает 401 «пропуск не предъявлен» вместо 503 — ключ прочитан",
        "меню отдаётся полностью: 24 экрана, пять разделов",
        "владелец проверил глазами: «все открывается» — рамка подтверждена"
      ],
      "finishedAt": "2026-08-13T12:05:00+03:00"
    },
    {
      "id": "04",
      "title": "Закрыть выход в интернет у фоновых заданий Twenty",
      "requirements": [
        "H02"
      ],
      "blockedBy": [],
      "wave": 2,
      "zone": [
        "twenty-server/queue-worker"
      ],
      "status": "done",
      "retries": 0,
      "repairs": 0,
      "concerns": [
        "найдено крупнее задачи: запрет считался подключённым, но в собранном файле стоял после семи загрузок — гарантия «не может выйти в сеть» не выполнялась",
        "подключено в семи точках входа вместо одной",
        "при переезде в контейнеры имена db и redis запрет отвергнет — сейчас контейнеры не используются"
      ],
      "startedAt": "2026-08-13T01:45:00+03:00",
      "finishedAt": "2026-08-13T02:06:06+03:00",
      "commit": "7af54a24",
      "tests": {
        "passed": 36,
        "failed": 0
      },
      "files": [
        "pozh-netguard-install.ts",
        "queue-worker.ts",
        "main.ts",
        "command.ts",
        "setup-db.ts",
        "truncate-db.ts",
        "run-migrations.ts",
        "run-seeds.ts",
        "OUTBOUND_AUDIT.md"
      ]
    },
    {
      "id": "05",
      "title": "Свести три склада кода в два",
      "requirements": [
        "H04"
      ],
      "blockedBy": [],
      "wave": 3,
      "zone": [
        "устройство складов"
      ],
      "status": "done",
      "startedAt": "2026-08-13T11:55:00+03:00",
      "finishedAt": "2026-08-13T12:21:23+03:00",
      "retries": 0,
      "repairs": 0,
      "commit": "fba7f4a7",
      "files": [
        "twenty/ (25 правок истории)",
        ".gitignore",
        "ЗАПУСК.md",
        "ONBOARDING.md",
        "ROADMAP.md",
        "PRODUCT.md",
        "adr/0005"
      ],
      "concerns": [
        "папка twenty/ пряталась в списке исключений и втайне была отдельным складом — из-за этого 5209 строк не сохранялись никуда",
        "всё в один склад не свели: служба документов публична под MIT, Twenty под AGPL — вопрос к юристу до второго клиента",
        "цена названа: склад вырос с 1 МБ до 144 МБ; поиск истории по путям twenty/... старые правки не покажет"
      ]
    }
  ],
  "singlePass": null,
  "tests": {
    "passed": 126,
    "failed": 0
  },
  "debt": {
    "placeholders": [],
    "assumptions": [
      "значение общего ключа придумано мной по прямому разрешению владельца; лежит только в файлах настроек, в историю правок не попадает"
    ],
    "emptyEnv": []
  },
  "additions": [],
  "coverage": {
    "found": 2,
    "fixed": 2,
    "deferred": 0
  },
  "blind": {
    "verdict": "прошлая сборка принята с доработками",
    "found": 14,
    "fixing": 10,
    "disputed": 4,
    "подробности": "полный разбор — .autopilot/product-direction/state.js"
  },
  "note_o_vremeni": "Метки времени восстановлены по времени сохранённых правок 13.08.2026 в 12:22. Часть меток «начато» приблизительные: в ходе сборки я проставлял их по памяти, вместо того чтобы читать часы. Метки «закончено» у тасков 01, 04 и 05 — настоящие, взяты из истории правок."
}
