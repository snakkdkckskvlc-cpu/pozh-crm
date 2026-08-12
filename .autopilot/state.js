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
    { "id": "01", "title": "Копия работы в два закрытых склада", "requirements": ["G01", "G01.1", "G01.2"], "blockedBy": [], "wave": 1, "zone": ["git"], "status": "done", "startedAt": "2026-08-13T00:05:29+03:00", "finishedAt": "2026-08-13T00:13:20+03:00", "retries": 0, "repairs": 1, "commit": "b6c6666f", "concerns": ["twenty/ был неполной копией — историю пересобрали на свою основу по решению владельца; содержимое совпало до байта"] },
    { "id": "02", "title": "Одна страница правды: PRODUCT.md", "requirements": ["R05", "R12i.1", "R12i.2", "R01", "R02", "R03", "R04"], "blockedBy": ["01"], "wave": 2, "zone": ["PRODUCT.md"], "status": "done", "startedAt": "2026-08-13T00:08:37+03:00", "finishedAt": "2026-08-13T00:45:56+03:00", "retries": 0, "repairs": 0, "commit": "eab80e0", "files": ["PRODUCT.md", "CLAUDE.md", "fire-safety-assistant/PRODUCT.md", "fire-safety-assistant/README.md"], "concerns": ["экранов оказалось 24, а не 21 — записано как D01", "правки в fire-safety-assistant не сохранены в историю: там правило «коммитить только когда попросили»"] },
    { "id": "03", "title": "Карта идей и порядок работ: ROADMAP.md", "requirements": ["R07", "R10", "R11", "R13i", "R15i", "R15i.1", "G11", "G14", "G15", "G16"], "blockedBy": ["01"], "wave": 2, "zone": ["ROADMAP.md"], "status": "done", "startedAt": "2026-08-13T00:08:37+03:00", "finishedAt": "2026-08-13T00:47:30+03:00", "retries": 0, "repairs": 1, "commit": "854323d", "files": ["ROADMAP.md"], "concerns": ["на доске владельца было 17 пунктов «требует внимания», а не 13 — записано как D05"] },
    { "id": "04", "title": "Документы перестают спорить: «рамка навсегда»", "requirements": ["G08", "G09", "G07", "G10", "G12", "G13", "R14i", "A01"], "blockedBy": ["01"], "wave": 2, "zone": ["pozh-crm/docs/"], "status": "done", "startedAt": "2026-08-13T00:08:37+03:00", "finishedAt": "2026-08-13T00:45:56+03:00", "retries": 1, "repairs": 0, "commit": "432599a", "files": ["docs/migration/MIGRATION_STRATEGY.md", "docs/architecture/adr/0003-ramka-navsegda.md"], "concerns": ["исполнитель оборвался на пределе сессии, но работу успел закончить — проверено по критериям приёмки"] },
    { "id": "05", "title": "Ввод в курс дела: ONBOARDING.md", "requirements": ["G04", "G05", "G06", "G15", "G15.1", "G15.2", "R08", "R09", "R16i"], "blockedBy": ["02", "03", "04"], "wave": 3, "zone": ["ONBOARDING.md", "CLAUDE.md"], "status": "in-progress", "startedAt": "2026-08-13T00:47:30+03:00", "retries": 0, "repairs": 0 }
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
