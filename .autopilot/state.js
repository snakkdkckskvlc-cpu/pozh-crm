window.STATE =
{
  "slug": "zhivaya-proverka-mosta",
  "title": "Живая проверка моста между CRM и службой документов",
  "mode": "semi",
  "depth": "deep",
  "tier": "T0",
  "briefFile": "2026-08-13-brief.md",
  "memoryFile": "CLAUDE.md",
  "startedAt": "2026-08-13T01:30:39+03:00",
  "updatedAt": "2026-08-13T01:38:00+03:00",
  "finishedAt": null,
  "stages": [
    { "id": "preflight", "status": "done", "startedAt": "2026-08-13T01:30:39+03:00", "finishedAt": "2026-08-13T01:31:10+03:00", "note": "прошлая сборка убрана в архив" },
    { "id": "manifest",  "status": "done", "startedAt": "2026-08-13T01:31:10+03:00", "finishedAt": "2026-08-13T01:32:00+03:00", "note": "3 требования" },
    { "id": "briefing",  "status": "skipped", "note": "вопросов не потребовалось — задача однозначна" },
    { "id": "spec",      "status": "done", "startedAt": "2026-08-13T01:32:00+03:00", "finishedAt": "2026-08-13T01:33:00+03:00", "note": "проверка живьём, без переписывания кода" },
    { "id": "plan",      "status": "skipped", "note": "ярус T0 — без разбивки на таски" },
    { "id": "build",     "status": "active", "startedAt": "2026-08-13T01:33:00+03:00", "note": "мост не включён — чиню то, что можно без ключа" },
    { "id": "review",    "status": "pending" },
    { "id": "final",     "status": "pending" }
  ],
  "requirements": {
    "total": 3, "done": 2, "inTicket": 1, "inSpec": 0,
    "placeholder": 0, "deferred": 0, "dropped": 0
  },
  "tickets": [],
  "singlePass": {
    "title": "Проверить живьём, работает ли рамка",
    "status": "in-progress",
    "startedAt": "2026-08-13T01:33:00+03:00",
    "проверено": [
      "служба документов отвечает: 24 экрана, разбивка по разделам совпала с подсчётом по коду",
      "ручки службы для CRM: здоровье 200, возможности 200",
      "ручки Twenty для выдачи пропуска существуют и закрыты входом (403, а не 404)",
      "59 проверок моста прогнаны точечно — все зелёные: сам механизм рабочий, не хватает только настройки"
    ],
    "найдено": [
      "мост НЕ работает: общий ключ задан только на стороне Twenty, служба документов его не видит — ручка «кто-я» отвечает 503",
      "имя настройки ASSISTENT_PB_GATE_KEY не записано нигде: ни в образце настроек, ни в документации, ни в установщике — на боевом сервере забудут молча"
    ]
  },
  "tests": { "passed": 59, "failed": 0 },
  "debt": {
    "placeholders": [],
    "assumptions": [],
    "emptyEnv": ["ASSISTENT_PB_GATE_KEY (служба документов)", "POZH_GATE_KEY (CRM) — значения должны совпадать"]
  },
  "additions": [],
  "coverage": null,
  "blind": null
}
