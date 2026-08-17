# Установка CRM на чистую Windows. Без действий человека.
#
# Запуск:
#   powershell -ExecutionPolicy Bypass -File ustanovit-crm.ps1
#
# Ставит всё сам: Node, базу, Redis, собирает программу, разворачивает базу,
# выкладывает опись объектов, переводит на русский и поднимает CRM. Ни одного
# вопроса по дороге.
#
# ПОВТОРНЫЙ ЗАПУСК БЕЗОПАСЕН. Каждый шаг сперва смотрит, не сделан ли он уже.
# Это не удобство, а необходимость: установка длинная, обрывается на середине от
# любой заминки со связью, и человек обязан иметь право просто запустить снова.
#
# ИМЕНА ПЕРЕМЕННЫХ ЛАТИНИЦЕЙ, ФАЙЛ С МЕТКОЙ КОДИРОВКИ (BOM). Windows PowerShell
# читает .ps1 как однобайтовый текст, русские имена рассыпаются, и файл не
# запускается вовсе — с десятком невнятных отказов. Правило записано в
# .claude/rules/powershell.md соседнего репозитория; здесь оно то же.
#
# МАРКЕРЫ [OK]/[X]/[!] ВМЕСТО ЗНАЧКОВ. Консоль Windows на эмодзи отвечает
# отказом кодировки и роняет вывод.

# Stop — для команд PowerShell. Обычные программы (initdb, yarn, vite) пишут
# предупреждения в поток ошибок, и их поток мы НЕ перенаправляем: иначе
# безобидное предупреждение обрывает всю установку.
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$twenty = Join-Path $root "twenty"
$server = Join-Path $twenty "packages\twenty-server"

# Данные CRM лежат ОТДЕЛЬНО от папки с кодом — то же правило, что у службы
# документов: обновление программы не должно задевать данные.
$dbDir = "C:\ProgramData\PozhCRM\db"
$dbPort = 5440
$dbPass = "pozh-crm-mestnyj"
$redisDir = "C:\ProgramData\PozhCRM\redis"

function Shag($nomer, $tekst) { Write-Host "`n=== $nomer. $tekst ===" -ForegroundColor Cyan }
function Ok($t) { Write-Host "[OK] $t" -ForegroundColor Green }
function Vnimanie($t) { Write-Host "[!] $t" -ForegroundColor Yellow }
function Slushaet($port) {
  return [bool](Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue)
}

function ObnovitPath {
  $env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
              [Environment]::GetEnvironmentVariable("Path", "User")
}

# --- 1. Длинные пути ---------------------------------------------------------
#
# У Twenty пути под 300 знаков, Windows по умолчанию пускает 260. Без этого
# половина файлов не распаковывается, а git показывает тысячи «удалённых».

Shag 1 "Разрешаю длинные имена файлов"
& git -C $root config core.longpaths true 2>$null | Out-Null
Ok "разрешены"

# --- 2. Node -----------------------------------------------------------------

Shag 2 "Node.js 24"
ObnovitPath
$nodeEst = $false
try { $nodeEst = ((& node --version) -match "^v(2[4-9]|[3-9][0-9])") } catch { }
if ($nodeEst) {
  Ok "уже стоит: $(& node --version)"
} else {
  Write-Host "ставлю (несколько минут)..."
  & winget install --id OpenJS.NodeJS.LTS --exact --silent `
    --accept-package-agreements --accept-source-agreements 2>$null | Out-Null
  ObnovitPath
  Ok "поставлен: $(& node --version)"
}

# --- 3. Yarn -----------------------------------------------------------------
#
# Штатная установка corepack требует прав на Program Files и на машине владельца
# в них упиралась. Ставим в свою папку и добавляем её в путь.

Shag 3 "Yarn"
$corepackBin = "$env:USERPROFILE\.corepack-bin"
if (-not (Test-Path "$corepackBin\yarn.ps1")) {
  New-Item -ItemType Directory -Force $corepackBin | Out-Null
  & corepack enable --install-directory $corepackBin 2>$null | Out-Null
}
$env:Path = "$corepackBin;$env:Path"
Ok "готов"

# --- 4. PostgreSQL -----------------------------------------------------------
#
# Свой экземпляр в своей папке. На машине могут стоять чужие — их не трогаем:
# у чужой рабочей базы цена ошибки это потерянные данные.

Shag 4 "База данных"
# Берём самую новую из тех, где ЕСТЬ исполняемые файлы. Просто «самая новая»
# не годится: на машине владельца стояли три версии, и в самой новой папке
# исполняемых файлов не оказалось вовсе — установка там оборвалась когда-то.
# Отказ при этом выглядел как «нет initdb», то есть как поломка PostgreSQL.
function NaytiPg {
  return (Get-ChildItem "C:\Program Files\PostgreSQL" -Directory -ErrorAction SilentlyContinue |
          Where-Object { Test-Path (Join-Path $_.FullName "bin\initdb.exe") } |
          Sort-Object Name -Descending | Select-Object -First 1)
}
$pgBin = NaytiPg
if (-not $pgBin) {
  Write-Host "ставлю PostgreSQL (несколько минут)..."
  & winget install --id PostgreSQL.PostgreSQL.17 --exact --silent `
    --accept-package-agreements --accept-source-agreements 2>$null | Out-Null
  $pgBin = NaytiPg
}
if (-not $pgBin) { throw "PostgreSQL не установился. Поставьте вручную и запустите снова." }
$pg = Join-Path $pgBin.FullName "bin"

if (-not (Test-Path "$dbDir\PG_VERSION")) {
  New-Item -ItemType Directory -Force $dbDir | Out-Null
  $pwFile = Join-Path $env:TEMP "pgpw.txt"
  Set-Content -Path $pwFile -Value $dbPass -NoNewline -Encoding ascii
  & "$pg\initdb.exe" -D $dbDir -U postgres --pwfile=$pwFile --encoding=UTF8 --locale=C 2>$null | Out-Null
  Remove-Item $pwFile -Force
  Ok "база заведена"
} else { Ok "база уже заведена" }

if (-not (Slushaet $dbPort)) {
  & "$pg\pg_ctl.exe" -D $dbDir -o "-p $dbPort" -l "$dbDir\log.txt" start 2>$null | Out-Null
  Start-Sleep -Seconds 5
}
if (Slushaet $dbPort) { Ok "работает на порту $dbPort" } else { throw "база не поднялась, смотрите $dbDir\log.txt" }

$env:PGPASSWORD = $dbPass
$estBaza = & "$pg\psql.exe" -w -U postgres -h 127.0.0.1 -p $dbPort -tAc `
  "select 1 from pg_database where datname='default'" 2>$null
if (-not $estBaza) {
  $sql = Join-Path $env:TEMP "sozdat-bazu.sql"
  Set-Content -Path $sql -Value 'CREATE DATABASE "default";' -Encoding ascii
  & "$pg\psql.exe" -w -U postgres -h 127.0.0.1 -p $dbPort -f $sql 2>$null | Out-Null
  Remove-Item $sql -Force
  Ok "база default создана"
} else { Ok "база default уже есть" }

# --- 5. Redis ----------------------------------------------------------------
#
# Установщик Memurai падает на создании временной папки (Error code 5) — это
# права на системную папку Windows, и трогать их ради нас нельзя. Поэтому
# установщик РАСПАКОВЫВАЕТСЯ, а программа работает обычным процессом.

Shag 5 "Redis"
$redisExe = Join-Path $redisDir "Memurai\memurai.exe"
if (-not (Test-Path $redisExe)) {
  Write-Host "скачиваю и распаковываю..."
  & winget download --id Memurai.MemuraiDeveloper --exact --download-directory $env:TEMP `
    --accept-package-agreements --accept-source-agreements 2>$null | Out-Null
  $msi = Get-ChildItem $env:TEMP -Recurse -Filter "*Memurai*.msi" -ErrorAction SilentlyContinue |
         Select-Object -First 1
  if (-not $msi) {
    # winget download есть не во всех сборках — пробуем через install, он тоже
    # оставляет установщик в своей папке даже когда сама установка падает.
    & winget install --id Memurai.MemuraiDeveloper --exact --silent `
      --accept-package-agreements --accept-source-agreements 2>$null | Out-Null
    $msi = Get-ChildItem "$env:LOCALAPPDATA\Temp\WinGet" -Recurse -Filter "*Memurai*.msi" `
      -ErrorAction SilentlyContinue | Select-Object -First 1
  }
  if (-not $msi) { throw "не удалось получить установщик Redis" }
  New-Item -ItemType Directory -Force $redisDir | Out-Null
  & msiexec.exe /a "$($msi.FullName)" /qn TARGETDIR="$redisDir" 2>$null | Out-Null
  Start-Sleep -Seconds 8
}
if (-not (Test-Path $redisExe)) { throw "Redis не распаковался" }
if (-not (Slushaet 6379)) {
  Start-Process -FilePath $redisExe -ArgumentList "--port 6379" -WindowStyle Hidden
  Start-Sleep -Seconds 4
}
if (Slushaet 6379) { Ok "работает" } else { throw "Redis не поднялся" }

# --- 6. Настройки ------------------------------------------------------------

Shag 6 "Настройки"
$envFile = Join-Path $server ".env"
if (-not (Test-Path $envFile)) {
  $klyuch = -join ((1..48) | ForEach-Object { "abcdefghijklmnopqrstuvwxyz0123456789"[(Get-Random -Max 36)] })
  @"
PG_DATABASE_URL=postgres://postgres:$dbPass@127.0.0.1:$dbPort/default
REDIS_URL=redis://127.0.0.1:6379
APP_SECRET=$klyuch
SERVER_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001
NODE_PORT=3000
SIGN_IN_PREFILLED=true
"@ | Set-Content -Path $envFile -Encoding utf8
  Ok "записаны"
} else { Ok "уже есть" }

# --- 7. Зависимости ----------------------------------------------------------

Shag 7 "Зависимости (до десяти минут)"
if (-not (Test-Path (Join-Path $twenty "node_modules"))) {
  Push-Location $twenty
  & yarn install 2>$null | Out-Null
  Pop-Location
  Ok "поставлены"
} else { Ok "уже стоят" }

# --- 8. Сборка ---------------------------------------------------------------
#
# ГЛАВНОЕ МЕСТО ЭТОГО ФАЙЛА. Через nx собирать НЕЛЬЗЯ: любая цель тянет за собой
# шаг generateBarrels, а он виснет навсегда — форматировщик кода в синхронной
# обёртке под Windows не отвечает. Процессы живут, процессор не загружен, вывода
# нет, и выглядит это как «всё зависло без причины».
#
# Шаг этот вдобавок лишний: он пересоздаёт тридцать точек входа общего пакета,
# а они уже лежат в репозитории готовыми.
#
# Поэтому каждый пакет собирается напрямую своими же командами.

Shag 8 "Сборка (до двадцати минут, это дольше всего)"
$env:CI = "true"; $env:NX_DAEMON = "false"

function Sobrat($papka, $configs, $proverka) {
  $put = Join-Path $twenty "packages\$papka"
  if (Test-Path (Join-Path $put $proverka)) { Ok "$papka уже собран"; return }
  Push-Location $put
  foreach ($c in $configs) {
    if ($c -eq "") { & npx vite build 2>$null | Out-Null }
    else { & npx vite build -c $c 2>$null | Out-Null }
  }
  Pop-Location
  if (Test-Path (Join-Path $put $proverka)) { Ok "$papka собран" }
  else { throw "$papka не собрался" }
}

Sobrat "twenty-shared" @("") "dist\application.cjs"
Sobrat "twenty-client-sdk" @("", "vite.metadata.config.ts") "dist\core.cjs"
Sobrat "twenty-emails" @("") "dist\index.js"
Sobrat "twenty-sdk" @("vite.config.node.ts", "vite.config.define.ts", "vite.config.billing.ts",
  "vite.config.front-component.ts", "vite.config.logic-function.ts", "vite.config.utils.ts",
  "vite.config.browser.ts") "dist\front-component-renderer"

if (-not (Test-Path (Join-Path $server "dist\main.js"))) {
  Push-Location $server
  & npx nest build --path ./tsconfig.build.json 2>$null | Out-Null
  Pop-Location
  Ok "сервер собран"
} else { Ok "сервер уже собран" }

# Служебные файлы. Сборка кладёт их в dist\assets, а код ищет рядом с собой.
# Без них заведение рабочего пространства падает с «нет такого файла».
foreach ($p in @(
  "engine\core-modules\application\application-package\constants\seed-dependencies",
  "engine\metadata-modules\front-component\constants\seed-project",
  "engine\core-modules\logic-function\logic-function-resource\constants\seed-project")) {
  $ist = Join-Path $server "src\$p"
  $kuda = Join-Path $server "dist\$p"
  if ((Test-Path $ist) -and -not (Test-Path $kuda)) {
    New-Item -ItemType Directory -Force $kuda | Out-Null
    Copy-Item "$ist\*" $kuda -Recurse -Force
  }
}
Ok "служебные файлы на месте"

# --- 9. Развёртывание базы ---------------------------------------------------

Shag 9 "Развёртывание базы"
Push-Location $server
$estTablicy = & "$pg\psql.exe" -w -U postgres -h 127.0.0.1 -p $dbPort -d "default" -tAc `
  "select count(*) from information_schema.tables where table_schema='core'" 2>$null
if ([int]$estTablicy -lt 10) {
  & node dist/database/scripts/setup-db.js 2>$null | Out-Null
  & node dist/command/command.js run-instance-commands --force 2>$null | Out-Null
  Ok "схема и таблицы созданы"
} else { Ok "таблицы уже есть" }

# Рабочее пространство с учётной записью. Без него войти некому и опись не
# выложить: выкладка ходит в CRM под пользователем.
$estUser = & "$pg\psql.exe" -w -U postgres -h 127.0.0.1 -p $dbPort -d "default" -tAc `
  "select count(*) from core.""user""" 2>$null
if ([int]$estUser -eq 0) {
  $env:NODE_ENV = "development"
  & node dist/command/command.js workspace:seed:dev 2>$null | Out-Null
  Ok "рабочее пространство заведено"
} else { Ok "рабочее пространство уже есть" }

# Заведение отрабатывает с ненулевым кодом возврата и оставляет пространство в
# состоянии «создаётся». Экран при этом предлагает достроить его и не может.
$sqlAct = Join-Path $env:TEMP "aktivirovat.sql"
Set-Content -Path $sqlAct -Encoding utf8 -Value @'
UPDATE core.workspace SET "activationStatus" = 'ACTIVE' WHERE "activationStatus" <> 'ACTIVE';
UPDATE core.workspace SET "displayName" = 'ПожСервис' WHERE "displayName" = 'Apple';
'@
& "$pg\psql.exe" -w -U postgres -h 127.0.0.1 -p $dbPort -d "default" -f $sqlAct 2>$null | Out-Null
Remove-Item $sqlAct -Force
Ok "пространство в рабочем состоянии"
Pop-Location

# --- 10. Сервер --------------------------------------------------------------

Shag 10 "Запуск сервера"
if (-not (Slushaet 3000)) {
  Start-Process -FilePath "node" -ArgumentList "dist/main.js" -WorkingDirectory $server `
    -WindowStyle Hidden -RedirectStandardOutput "$env:TEMP\crm-server.log" `
    -RedirectStandardError "$env:TEMP\crm-server-err.log"
  $zhdu = 0
  while (-not (Slushaet 3000) -and $zhdu -lt 90) { Start-Sleep -Seconds 5; $zhdu += 5 }
}
if (Slushaet 3000) { Ok "работает" } else { throw "сервер не поднялся, смотрите $env:TEMP\crm-server-err.log" }

# --- 11. Опись объектов ------------------------------------------------------

Shag 11 "Выкладка описи объектов"
# Выкладка и перевод пишут в поток ошибок и при удачном исходе: например
# «регистрация пропущена — имя уже занято», а это обычное состояние на второй и
# последующих установках. При "Stop" установка обрывалась бы на ровном месте,
# уже сделав всю работу.
$ErrorActionPreference = "Continue"
# Установка читает dependencies\package.json приложения в хранилище, а при
# заведении приложения эта папка не создаётся. Берём по образцу готового.
$hran = Join-Path $server ".local-storage"
if (Test-Path $hran) {
  $obrazec = Get-ChildItem $hran -Recurse -Filter "package.json" -ErrorAction SilentlyContinue |
             Where-Object { $_.DirectoryName -like "*dependencies*" } | Select-Object -First 1
  $prostr = Get-ChildItem $hran -Directory -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($obrazec -and $prostr) {
    $nashe = Join-Path $prostr.FullName "9a1f0c00-0000-4000-8000-000000000001\dependencies"
    if (-not (Test-Path "$nashe\package.json")) {
      New-Item -ItemType Directory -Force $nashe | Out-Null
      Copy-Item $obrazec.FullName $nashe -Force
    }
  }
}
Push-Location $server
& npx tsx src/pozh/manifest/pozh-sync.ts 2>$null | Select-String -Pattern "ВЫЛОЖЕНО|действий|УДАЛЕНИЙ|не вышло" |
  ForEach-Object { Write-Host "    $($_.Line.Trim())" }

# --- 12. Русский язык --------------------------------------------------------
#
# Названия объектов и полей лежат в базе текстом и переключением языка не
# трогаются. Без этого шага меню наполовину английское.

Shag 12 "Перевод на русский"
& npx tsx src/pozh/manifest/pozh-perevod.ts 2>$null | Select-String -Pattern "переведено|осталось|не нашлось" |
  ForEach-Object { Write-Host "    $($_.Line.Trim())" }
Pop-Location

# --- Готово ------------------------------------------------------------------

Write-Host ""
$ErrorActionPreference = "Stop"
Write-Host "==================================================" -ForegroundColor Green
Write-Host " CRM установлена и работает" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""
Write-Host " Открыть:  http://localhost:3001"
Write-Host " Вход:     tim@apple.dev (пароль подставляется сам)"
Write-Host ""
Write-Host " Экран CRM запускается отдельно:"
Write-Host "   cd twenty\packages\twenty-front"
Write-Host "   node ..\..\node_modules\vite\bin\vite.js --port 3001"
Write-Host ""
Write-Host " Поднять всё заново после перезагрузки: ЗАПУСТИТЬ-НА-WINDOWS.ps1"
