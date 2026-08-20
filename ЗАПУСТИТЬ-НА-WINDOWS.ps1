# Поднять CRM на машине владельца одной командой.
#
# Запуск: правой кнопкой по файлу → «Выполнить с помощью PowerShell».
# Либо в окне PowerShell:  .\ЗАПУСТИТЬ-НА-WINDOWS.ps1
#
# ЗАЧЕМ ЭТОТ ФАЙЛ. Штатный способ запуска (`npx nx start twenty-server`) на
# Windows не работает: любая цель nx тянет за собой шаг `generateBarrels`, а он
# виснет НАВСЕГДА — форматировщик кода в синхронной обёртке не отвечает.
# Процессы при этом живут, процессор не загружен, вывода нет, и выглядит это как
# «всё зависло без причины». Разбор — в ЗАПУСК.md, раздел про Windows.
#
# Здесь всё запускается напрямую, минуя nx.

$ErrorActionPreference = "Stop"

$БАЗА_ПАПКА = "C:\Users\Windows\pozh-crm-db"
$БАЗА_ПОРТ = 5440
$PG = "C:\Program Files\PostgreSQL\17\bin"
$REDIS = "C:\Users\Windows\redis-portable\Memurai\memurai.exe"
$СЕРВЕР = "C:\Users\Windows\pozh-crm\twenty\packages\twenty-server"

function Слушает($порт) {
  return [bool](Get-NetTCPConnection -LocalPort $порт -State Listen -ErrorAction SilentlyContinue)
}

Write-Host "=== 1. База данных ===" -ForegroundColor Cyan
if (Слушает $БАЗА_ПОРТ) {
  Write-Host "уже работает на порту $БАЗА_ПОРТ"
} else {
  # Отдельный экземпляр, четвёртый на машине. Три существующих (порты 5432,
  # 5433, 5434) принадлежат другой работе и не трогаются.
  # ВЫВОД ГЛУШИТСЯ ПЕРЕНАПРАВЛЕНИЕМ, А НЕ КОНВЕЙЕРОМ «| Out-Null».
  #
  # С конвейером эта строка НЕ ЗАВЕРШАЕТСЯ НИКОГДА, если запустить скрипт не
  # из окна человека, а из программы: конвейер ждёт закрытия вывода, а его
  # держит открытым сама база, которую pg_ctl только что запустил и оставил
  # работать. Скрипт при этом висит на первом шаге, база поднята, а Redis и
  # сервер не запускаются вовсе.
  #
  # Найдено 20.08.2026, когда кнопка «Включить CRM» в службе документов стала
  # поднимать CRM наполовину. Из окна человека тот же скрипт работал — потому
  # и не замечали: разница видна только при запуске из другой программы.
  & "$PG\pg_ctl.exe" -D $БАЗА_ПАПКА -o "-p $БАЗА_ПОРТ" -l "$БАЗА_ПАПКА\log.txt" start *> $null
  Start-Sleep -Seconds 4
  Write-Host $(if (Слушает $БАЗА_ПОРТ) { "поднята" } else { "НЕ ПОДНЯЛАСЬ — смотрите $БАЗА_ПАПКА\log.txt" })
}

Write-Host "=== 2. Redis ===" -ForegroundColor Cyan
if (Слушает 6379) {
  Write-Host "уже работает"
} else {
  # Не служба, а обычная программа: установщик Memurai падает на создании
  # временной папки (Error code 5), поэтому распакован msiexec /a и работает так.
  Start-Process -FilePath $REDIS -ArgumentList "--port 6379" -WindowStyle Hidden
  Start-Sleep -Seconds 3
  Write-Host $(if (Слушает 6379) { "поднят" } else { "НЕ ПОДНЯЛСЯ" })
}

Write-Host "=== 3. Сервер CRM (порт 3000) ===" -ForegroundColor Cyan
$env:Path = "C:\Users\Windows\.corepack-bin;" + [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
$env:NX_DAEMON = "false"

if (Слушает 3000) {
  Write-Host "уже работает"
} else {
  if (-not (Test-Path "$СЕРВЕР\dist\main.js")) {
    Write-Host "сервер не собран — собираю (несколько минут)..."
    Push-Location $СЕРВЕР
    & npx nest build --path ./tsconfig.build.json
    Pop-Location
  }
  # ВЫВОД СЕРВЕРА УХОДИТ В ФАЙЛ, А НЕ В СВЁРНУТОЕ ОКНО. Это не про удобство:
  # при старте сервер пишет 131 тысячу знаков (весь разбор метаданных), а
  # свёрнутое окно никто не читает — буфер консоли переполняется, запись
  # блокируется, и сервер ВСТАЁТ НАМЕРТВО, не дойдя до открытия порта.
  #
  # Выглядит это как «CRM поднимается и не поднимается никогда»: процесс node
  # живой, порт 3000 молчит, в окне ничего. Замерено 20.08.2026: с
  # перенаправлением в файл сервер стартует за 30 секунд, со свёрнутым окном не
  # стартовал и за пять минут.
  $ЖУРНАЛ_СЕРВЕРА = Join-Path $env:ProgramData "PozhAI\logs\crm-server.log"
  New-Item -ItemType Directory -Force -Path (Split-Path $ЖУРНАЛ_СЕРВЕРА) | Out-Null
  Start-Process -FilePath "node" -ArgumentList "dist/main.js" -WorkingDirectory $СЕРВЕР `
    -WindowStyle Hidden -RedirectStandardOutput $ЖУРНАЛ_СЕРВЕРА `
    -RedirectStandardError "$ЖУРНАЛ_СЕРВЕРА.err"
  Write-Host "запускается, первый старт занимает до минуты"
}

Write-Host ""
Write-Host "Открыть: http://localhost:3000" -ForegroundColor Green
Write-Host "Экран CRM (twenty-front) запускается отдельно: npx vite --port 3001 в packages/twenty-front"
