window.STATE =
{
  "slug": "product-direction",
  "title": "Вектор развития продукта ПожСервис",
  "mode": "semi",
  "depth": "deep",
  "tier": null,
  "briefFile": "2026-08-12-brief.md",
  "memoryFile": "CLAUDE.md",
  "startedAt": "2026-08-12T22:37:48+03:00",
  "updatedAt": "2026-08-12T22:39:44+03:00",
  "finishedAt": null,
  "stages": [
    { "id": "preflight", "status": "done", "startedAt": "2026-08-12T22:37:48+03:00", "finishedAt": "2026-08-12T22:38:57+03:00" },
    { "id": "manifest",  "status": "done", "startedAt": "2026-08-12T22:38:57+03:00", "finishedAt": "2026-08-12T22:39:44+03:00", "note": "16 требований" },
    { "id": "briefing",  "status": "done", "startedAt": "2026-08-12T22:39:44+03:00", "finishedAt": "2026-08-12T23:30:45+03:00", "note": "13 вопросов" },
    { "id": "spec",      "status": "done", "startedAt": "2026-08-12T23:30:45+03:00", "finishedAt": "2026-08-13T00:05:29+03:00", "note": "проверка покрытия: 2 находки, обе закрыты" },
    { "id": "plan",      "status": "done", "startedAt": "2026-08-13T00:05:29+03:00", "finishedAt": "2026-08-13T00:05:29+03:00", "note": "5 тасков, 3 волны, ярус T2" },
    { "id": "build",     "status": "active", "startedAt": "2026-08-13T00:05:29+03:00" },
    { "id": "review",    "status": "pending" },
    { "id": "final",     "status": "pending" }
  ],
  "requirements": {
    "total": 31, "done": 0, "inTicket": 0, "inSpec": 0,
    "placeholder": 0, "deferred": 1, "dropped": 0
  },
  "tickets": [
    { "id": "01", "title": "Копия работы в два закрытых склада", "requirements": ["G01", "G01.1", "G01.2"], "blockedBy": [], "wave": 1, "zone": ["git"], "status": "pending", "retries": 0, "repairs": 0 },
    { "id": "02", "title": "Одна страница правды: PRODUCT.md", "requirements": ["R05", "R12i.1", "R12i.2", "R01", "R02", "R03", "R04"], "blockedBy": ["01"], "wave": 2, "zone": ["PRODUCT.md"], "status": "pending", "retries": 0, "repairs": 0 },
    { "id": "03", "title": "Карта идей и порядок работ: ROADMAP.md", "requirements": ["R07", "R10", "R11", "R13i", "R15i", "R15i.1", "G11", "G14", "G15", "G16"], "blockedBy": ["01"], "wave": 2, "zone": ["ROADMAP.md"], "status": "pending", "retries": 0, "repairs": 0 },
    { "id": "04", "title": "Документы перестают спорить: «рамка навсегда»", "requirements": ["G08", "G09", "G07", "G10", "G12", "G13", "R14i", "A01"], "blockedBy": ["01"], "wave": 2, "zone": ["pozh-crm/docs/"], "status": "pending", "retries": 0, "repairs": 0 },
    { "id": "05", "title": "Ввод в курс дела: ONBOARDING.md", "requirements": ["G04", "G05", "G06", "G15", "G15.1", "G15.2", "R08", "R09", "R16i"], "blockedBy": ["02", "03", "04"], "wave": 3, "zone": ["ONBOARDING.md", "CLAUDE.md"], "status": "pending", "retries": 0, "repairs": 0 }
  ],
  "singlePass": null,
  "tests": { "passed": 0, "failed": 0 },
  "debt": {
    "placeholders": [],
    "assumptions": [],
    "emptyEnv": []
  },
  "additions": [],
  "coverage": { "found": 2, "fixed": 2, "deferred": 0 },
  "blind": null
}
