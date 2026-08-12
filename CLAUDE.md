<!-- autopilot:start -->
# ПожСервис CRM (форк Twenty)

Фирменная CRM для ООО «ПожСервис» / «ПожМастер» (Липецк) на базе открытой
Twenty; сюда постепенно переезжают функции из офлайн-ассистента
`~/fire-safety-assistant`.

## Команды

| Команда | Что делает |
|---------|------------|
| `export PATH="/opt/homebrew/opt/node@24/bin:$PATH"` | Обязательно: Twenty работает только на node 24 |
| `npx nx start twenty-server` | Поднять сервер (порт 3000), из папки `twenty/` |
| `npx nx start twenty-front` | Поднять интерфейс (порт 3001), из папки `twenty/` |
| `node branding/apply-branding.mjs` | Наложить фирменные цвета |
| `TWENTY_API_TOKEN=... node branding/provision-ru-locale.mjs` | Дописать русские названия в базу |

Подробнее — [ЗАПУСК.md](ЗАПУСК.md).

## Как здесь работает Autopilot

Сборка ведётся навыком `/autopilot`. Требования, спецификация и таски — в `.autopilot/`.
Прогресс — `.autopilot/dashboard.html`. Правило: требование из `manifest.md`
может снять только пользователь.

Если работа продолжается — скажи «продолжи автопилот»: состояние поднимется
из `.autopilot/state.js`, переспрашивать ничего не нужно.
<!-- autopilot:end -->
