window.STATE =
{
  "slug": "kadry-razvitie",
  "title": "Кадры: выгрузка отсутствий, перевод между бригадами, починка аналитики",
  "mode": "interview",
  "depth": "deep",
  "tier": "T2",
  "briefFile": "2026-08-13-brief.md",
  "memoryFile": "CLAUDE.md",
  "startedAt": "2026-08-13T12:17:40+03:00",
  "updatedAt": "2026-08-13T20:25:00+03:00",
  "finishedAt": null,
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
      "status": "done",
      "startedAt": "2026-08-13T12:26:00+03:00",
      "finishedAt": "2026-08-13T13:05:00+03:00",
      "note": "12 вопросов, все отвечены; мост оказался уже включён"
    },
    {
      "id": "spec",
      "status": "done",
      "startedAt": "2026-08-13T13:05:00+03:00",
      "finishedAt": "2026-08-13T13:42:00+03:00",
      "note": "G2: проверка прогнана дважды, 6 находок, все закрыты"
    },
    {
      "id": "plan",
      "status": "done",
      "startedAt": "2026-08-13T13:42:00+03:00",
      "finishedAt": "2026-08-13T13:58:00+03:00",
      "note": "5 тасков, 3 волны; G3 нашёл потерянное требование G16"
    },
    {
      "id": "build",
      "status": "active",
      "startedAt": "2026-08-13T14:02:00+03:00",
      "note": "все пять тасков собраны и проверены, ждут сохранения"
    },
    { "id": "review", "status": "pending" },
    { "id": "final", "status": "pending" }
  ],
  "requirements": {
    "total": 32, "done": 4, "inTicket": 26, "inSpec": 1,
    "placeholder": 0, "deferred": 1, "dropped": 0
  },
  "tickets": [
    {
      "id": "01",
      "title": "Состав бригад: с «месяца» на «с даты по дату»",
      "requirements": ["G08", "G12", "G17", "G22", "R06i"],
      "blockedBy": [],
      "wave": 1,
      "zone": ["infrastructure/db.py", "services/kadry_sostav.py", "main.py"],
      "status": "review",
      "startedAt": "2026-08-13T14:12:00+03:00",
      "tests": { "passed": 118, "failed": 0 },
      "concerns": ["три доработки, состязательная проверка в 4 взгляда; всё закрыто, ждёт общего сохранения"],
      "retries": 0,
      "repairs": 3
    },
    {
      "id": "02",
      "title": "Доска «Бригады»: перевод перетаскиванием",
      "requirements": ["G07", "G09", "G19", "G22", "A01", "A03", "A04"],
      "blockedBy": ["01"],
      "wave": 2,
      "zone": ["views/kadry_brigady.py", "frontend/kadry-brigady.html"],
      "status": "review",
      "startedAt": "2026-08-13T18:56:00+03:00",
      "tests": { "passed": 19, "failed": 0 },
      "concerns": ["проверен живьём на выброшенной базе; экрану нужен пункт меню — чинится отдельно"],
      "retries": 0,
      "repairs": 0
    },
    {
      "id": "03",
      "title": "Аналитика: два экрана вместо одного",
      "requirements": ["G09", "G10", "G11", "G12", "G20", "G21"],
      "blockedBy": ["01"],
      "wave": 2,
      "zone": ["services/kadry_analitika.py", "views/kadry_analitika.py", "frontend/kadry-kak-dela.html", "frontend/kadry-chto-proverit.html"],
      "status": "review",
      "tests": { "passed": 24, "failed": 0 },
      "concerns": ["сумма часов сходится: 2995 = 2995; «Разберусь» живёт в браузере, не в базе"],
      "startedAt": "2026-08-13T19:22:00+03:00",
      "retries": 0,
      "repairs": 0
    },
    {
      "id": "04",
      "title": "Отсутствия: срок, отчёт и выгрузка в Excel",
      "requirements": ["G01", "G02", "G03", "G04", "G05", "G06", "G09", "G16", "G17", "A02"],
      "blockedBy": ["01"],
      "wave": 2,
      "zone": ["services/kadry_otsutstviya.py", "services/kadry.py", "views/kadry_otsutstviya.py", "frontend/kadry-otsutstviya.html", "frontend/kadry-calendar.html", "generators/kadry_xlsx.py"],
      "status": "review",
      "tests": { "passed": 46, "failed": 0 },
      "concerns": ["панель расхождений закрыла молчаливый пропуск при подписи бригады"],
      "startedAt": "2026-08-13T19:23:00+03:00",
      "retries": 0,
      "repairs": 0
    },
    {
      "id": "06",
      "title": "Кадровичка открывает систему по офисной сети",
      "requirements": ["G23"],
      "blockedBy": ["05"],
      "wave": 3,
      "zone": ["twenty/.env", "ЗАПУСК.md", "параметры запуска"],
      "status": "pending",
      "retries": 0,
      "repairs": 0
    },
    {
      "id": "05",
      "title": "Три новых экрана попадают в меню CRM",
      "requirements": ["G13", "G15", "R04i", "R05i"],
      "blockedBy": ["02", "03", "04"],
      "wave": 3,
      "zone": ["views/embedded.py", "PRODUCT.md"],
      "status": "review",
      "tests": { "passed": 69, "failed": 0 },
      "concerns": ["в CRM меню сортируется по алфавиту — порядок «сверху ежедневное» не удержится"],
      "startedAt": "2026-08-13T20:05:00+03:00",
      "retries": 0,
      "repairs": 0
    }
  ],
  "singlePass": null,
  "tests": { "passed": 281, "failed": 0 },
  "debt": { "placeholders": [], "assumptions": [], "emptyEnv": [] },
  "additions": [
    "A01 → G07: отмена перевода полоской на 10 секунд",
    "A02 → G01: предпросмотр выгрузки на экране до Excel",
    "A03 → G07: часы за месяц прямо на карточке человека",
    "A04 → G07: поиск по фамилии на доске бригад"
  ],
  "coverage": { "found": 6, "fixed": 6, "deferred": 0 },
  "blind": null
}
