window.STATE =
{
  "slug": "vklyuchit-most",
  "title": "Включить мост и пройти рамку живьём",
  "mode": "semi",
  "depth": "deep",
  "tier": "T2",
  "briefFile": "2026-08-13-brief.md",
  "memoryFile": "CLAUDE.md",
  "startedAt": "2026-08-13T01:30:39+03:00",
  "updatedAt": "2026-08-13T01:52:00+03:00",
  "finishedAt": null,
  "stages": [
    { "id": "preflight", "status": "done", "startedAt": "2026-08-13T01:30:39+03:00", "finishedAt": "2026-08-13T01:31:10+03:00", "note": "прошлая сборка убрана в архив" },
    { "id": "manifest",  "status": "done", "startedAt": "2026-08-13T01:31:10+03:00", "finishedAt": "2026-08-13T01:32:00+03:00", "note": "3 требования" },
    { "id": "briefing",  "status": "skipped", "note": "вопросов не потребовалось — задача однозначна" },
    { "id": "spec",      "status": "done", "startedAt": "2026-08-13T01:32:00+03:00", "finishedAt": "2026-08-13T01:33:00+03:00", "note": "проверка живьём, код не переписываем" },
    { "id": "plan",      "status": "done", "startedAt": "2026-08-13T01:50:00+03:00", "finishedAt": "2026-08-13T01:52:00+03:00", "note": "4 таска, 2 волны" },
    { "id": "build",     "status": "active", "startedAt": "2026-08-13T01:33:00+03:00", "note": "мост найден выключенным — включаю" },
    { "id": "review",    "status": "pending" },
    { "id": "final",     "status": "pending" }
  ],
  "requirements": {
    "total": 3, "done": 0, "inTicket": 3, "inSpec": 0,
    "placeholder": 0, "deferred": 0, "dropped": 0
  },
  "tickets": [
    {
      "id": "01",
      "title": "Включить мост: общий ключ с обеих сторон",
      "requirements": ["H03"],
      "blockedBy": [],
      "wave": 1,
      "zone": [".env обеих систем"],
      "status": "in-progress",
      "startedAt": "2026-08-13T01:52:00+03:00",
      "retries": 0,
      "repairs": 0,
      "concerns": ["владелец разрешил придумать значение; в историю правок оно не попадает"]
    },
    {
      "id": "02",
      "title": "Свести разошедшиеся копии PRODUCT.md",
      "requirements": ["H02"],
      "blockedBy": [],
      "wave": 1,
      "zone": ["PRODUCT.md"],
      "status": "pending",
      "retries": 0,
      "repairs": 0,
      "concerns": ["в CRM 298 строк, в службе документов 250 — правки после приёмки уехали только в главный экземпляр"]
    },
    {
      "id": "03",
      "title": "Поднять интерфейс CRM и пройти все 24 экрана в рамке",
      "requirements": ["H02"],
      "blockedBy": ["01"],
      "wave": 2,
      "zone": ["проверка живьём"],
      "status": "pending",
      "retries": 0,
      "repairs": 0
    },
    {
      "id": "04",
      "title": "Закрыть выход в интернет у фоновых заданий Twenty",
      "requirements": ["H02"],
      "blockedBy": [],
      "wave": 2,
      "zone": ["twenty-server/queue-worker"],
      "status": "pending",
      "retries": 0,
      "repairs": 0,
      "concerns": ["запрет в коде подключён к серверу, но не к фоновым заданиям — раз в час идёт обращение в чужой каталог программ"]
    }
  ],
  "singlePass": null,
  "tests": { "passed": 59, "failed": 0 },
  "debt": {
    "placeholders": [],
    "assumptions": ["значение общего ключа придумано мной по прямому разрешению владельца; лежит только в файлах настроек, в историю правок не попадает"],
    "emptyEnv": []
  },
  "additions": [],
  "coverage": { "found": 2, "fixed": 2, "deferred": 0 },
  "blind": {
    "verdict": "прошлая сборка принята с доработками",
    "found": 14,
    "fixing": 10,
    "disputed": 4,
    "подробности": "полный разбор — .autopilot/product-direction/state.js"
  }
}
