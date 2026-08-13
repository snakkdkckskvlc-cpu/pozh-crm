window.STATE =
{
  "slug": "kadry-razvitie",
  "title": "Функция для отдела кадров — какая именно, решаем в брифинге",
  "mode": "interview",
  "depth": "deep",
  "tier": null,
  "briefFile": "2026-08-13-brief.md",
  "memoryFile": "CLAUDE.md",
  "startedAt": "2026-08-13T12:17:40+03:00",
  "updatedAt": "2026-08-13T03:20:00+03:00",
  "finishedAt": "2026-08-13T03:20:00+03:00",
  "stages": [
    {
      "id": "preflight",
      "status": "done",
      "startedAt": "2026-08-13T12:17:40+03:00",
      "finishedAt": "2026-08-13T12:19:00+03:00",
      "note": "прошлая сборка убрана в архив"
    },
    {
      "id": "manifest",
      "status": "done",
      "startedAt": "2026-08-13T12:19:00+03:00",
      "finishedAt": "2026-08-13T12:26:00+03:00",
      "note": "6 требований + разбор задачи на прочность, 7 находок"
    },
    {
      "id": "briefing",
      "status": "active",
      "startedAt": "2026-08-13T12:26:00+03:00",
      "note": "режим интервью — разбираю задачу вопросами"
    },
    {
      "id": "spec",
      "status": "pending"
    },
    {
      "id": "plan",
      "status": "pending"
    },
    {
      "id": "build",
      "status": "pending"
    },
    {
      "id": "review",
      "status": "done",
      "finishedAt": "2026-08-13T03:00:00+03:00",
      "note": "рамку подтвердил владелец глазами"
    },
    {
      "id": "final",
      "status": "done",
      "startedAt": "2026-08-13T03:00:00+03:00",
      "finishedAt": "2026-08-13T03:20:00+03:00",
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
      "startedAt": "2026-08-13T02:55:00+03:00",
      "finishedAt": "2026-08-13T03:18:00+03:00",
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
    "passed": 0,
    "failed": 0
  },
  "debt": {
    "placeholders": [],
    "assumptions": [],
    "emptyEnv": []
  },
  "additions": [],
  "coverage": null,
  "blind": null
}
