/**
 * ЗАПРЕТ ВЫХОДА В ИНТЕРНЕТ. Правка форка ПожСервиса, в исходном Twenty её нет.
 *
 * ЗАЧЕМ. В договорах ООО «ПожСервис» с ПАО НЛМК есть раздел о конфиденциальности
 * со штрафом. В нынешнем офлайн-приложении компании запрет выхода наружу — не
 * пожелание, а свойство кода: любой сетевой вызов, кроме обращения к своей же
 * машине, отвергается. Twenty про это ничего не знает и по умолчанию,
 * наоборот, шлёт события о работе на twenty-telemetry.com.
 *
 * ЧЕМ ЭТО ОТЛИЧАЕТСЯ ОТ ВЫКЛЮЧЕНИЯ НАСТРОЕК. Выключить телеметрию переменной
 * окружения можно, и это надо сделать. Но настройка — обещание, а не гарантия:
 * её забудут перенести на новый сервер, её вернёт обновление, её включит новая
 * возможность, о которой никто не подумал. Запрет в коде переживает всё это и
 * позволяет сказать заказчику не «мы выключили», а «оно не может».
 *
 * ЧЕМ ЭТО ОТЛИЧАЕТСЯ ОТ ЗАЩИТЫ, КОТОРАЯ УЖЕ ЕСТЬ В TWENTY. В Twenty есть
 * secure-http-client: он бережёт от обращений к ВНУТРЕННИМ адресам, потому что
 * рассчитан на облако, где внутренняя сеть — чужая тайна. У нас ровно обратная
 * задача: внутреннее разрешено, наружу нельзя. Поэтому это отдельный слой, а не
 * правка существующего.
 *
 * КАК РАБОТАЕТ. Подменяются низкоуровневые функции создания соединения (http,
 * https и сам сокет). Проверяется адрес назначения: свой компьютер, частные сети
 * предприятия и явно разрешённые имена проходят, всё остальное отвергается с
 * понятной ошибкой. Подмена делается ДО загрузки приложения — иначе библиотека,
 * успевшая захватить ссылку на исходную функцию, обойдёт запрет.
 *
 * ЧЕГО ЭТОТ СЛОЙ НЕ ДЕЛАЕТ, И ЭТО НАДО ЗНАТЬ. Он закрывает только серверную
 * половину. Браузер ходит по сети сам: чужой шрифт, картинка или счётчик на
 * странице этим запретом не ловятся. Для внешней половины нужен отдельный
 * запрет (политика содержимого страницы), и он делается не здесь.
 */

import dns from 'node:dns';
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';

/** Выключатель на случай наладки. По умолчанию запрет ВКЛЮЧЁН. */
const ВЫКЛЮЧЕН = process.env.POZH_ALLOW_INTERNET === '1';

/**
 * Имена, к которым обращаться можно. Пусто по умолчанию: разрешение выдаётся
 * поимённо и осознанно, а не «всё, кроме плохого». Список наоборот — «запретить
 * вот эти» — не работает: завтра появится новый адрес, о котором никто не знал.
 */
const РАЗРЕШЁННЫЕ_ИМЕНА = (process.env.POZH_ALLOWED_HOSTS ?? '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

const СВОИ_ИМЕНА = new Set(['localhost', 'localhost.localdomain', '::1', '0.0.0.0']);

/** Частные диапазоны: сеть предприятия — это не «наружу». */
const частныйАдрес = (адрес: string): boolean => {
  const a = адрес.replace(/^\[|\]$/g, '');
  if (net.isIPv6(a)) {
    const н = a.toLowerCase();
    // ::1 — свой компьютер; fc00::/7 — частные; fe80::/10 — канальные;
    // ::ffff:x.x.x.x — обёрнутый адрес четвёртой версии, разворачиваем.
    if (н === '::1') return true;
    if (н.startsWith('fc') || н.startsWith('fd') || н.startsWith('fe8')) return true;
    const обёрнут = н.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (обёрнут) return частныйАдрес(обёрнут[1]);
    return false;
  }
  if (!net.isIPv4(a)) return false;
  const [п, в] = a.split('.').map(Number);
  if (п === 127 || п === 10) return true;
  if (п === 172 && в >= 16 && в <= 31) return true;
  if (п === 192 && в === 168) return true;
  if (п === 169 && в === 254) return true; // самоназначенные
  return false;
};

export const адресРазрешён = (хост: string | undefined): boolean => {
  if (!хост) return true; // без имени — это обращение внутри процесса
  const н = хост.toLowerCase().replace(/^\[|\]$/g, '');
  if (СВОИ_ИМЕНА.has(н)) return true;
  if (частныйАдрес(н)) return true;
  if (РАЗРЕШЁННЫЕ_ИМЕНА.includes(н)) return true;
  // Разрешение по имени распространяется на поддомены: «пример.рф» разрешает
  // «почта.пример.рф», иначе список пришлось бы вести бесконечно.
  return РАЗРЕШЁННЫЕ_ИМЕНА.some((р) => н.endsWith(`.${р}`));
};

export class ВыходНаружуЗапрещён extends Error {
  constructor(хост: string) {
    super(
      `Программа попыталась обратиться в интернет: ${хост}. ` +
        `Это запрещено: в договоре с заказчиком есть раздел о конфиденциальности. ` +
        `Если обращение нужно по делу — внесите адрес в POZH_ALLOWED_HOSTS и объясните, зачем.`,
    );
    this.name = 'ВыходНаружуЗапрещён';
  }
};

const извлечьХост = (аргументы: unknown[]): string | undefined => {
  const [первый, второй] = аргументы;
  if (typeof первый === 'string') {
    try {
      return new URL(первый).hostname;
    } catch {
      return undefined;
    }
  }
  if (первый instanceof URL) return первый.hostname;
  const o = (первый ?? {}) as Record<string, unknown>;
  const o2 = (второй ?? {}) as Record<string, unknown>;
  const хост = o.hostname ?? o.host ?? o2.hostname ?? o2.host;
  return typeof хост === 'string' ? хост.split(':')[0] : undefined;
};

let установлен = false;

export const установитьЗапретСети = (): void => {
  if (установлен || ВЫКЛЮЧЕН) return;
  установлен = true;

  for (const модуль of [http, https] as const) {
    for (const имя of ['request', 'get'] as const) {
      const исходная = модуль[имя];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (модуль as any)[имя] = function (...аргументы: unknown[]) {
        const хост = извлечьХост(аргументы);
        if (!адресРазрешён(хост)) throw new ВыходНаружуЗапрещён(хост as string);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (исходная as any).apply(this, аргументы);
      };
    }
  }

  // Второй слой: соединение напрямую сокетом, минуя http-клиенты. Так ходят
  // драйверы баз, очереди и часть библиотек.
  const исходноеСоединение = net.Socket.prototype.connect;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (net.Socket.prototype as any).connect = function (...аргументы: unknown[]) {
    const первый = аргументы[0] as Record<string, unknown> | number | string;
    let хост: string | undefined;
    if (typeof первый === 'object' && первый !== null) хост = первый.host as string;
    else if (typeof аргументы[1] === 'string') хост = аргументы[1] as string;
    if (!адресРазрешён(хост)) throw new ВыходНаружуЗапрещён(хост as string);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (исходноеСоединение as any).apply(this, аргументы);
  };

  // Третий слой: запрос имени. Ловит попытку ДО соединения и даёт понятную
  // ошибку вместо невнятного отказа сети. Плюс не даёт узнать, существует ли
  // чужое имя, — сам запрос имени тоже уходит наружу.
  const исходныйПоиск = dns.lookup;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (dns as any).lookup = function (имя: string, ...остальное: unknown[]) {
    if (!адресРазрешён(имя)) {
      const обратный = остальное.find((а) => typeof а === 'function') as
        | ((e: Error) => void)
        | undefined;
      const ошибка = new ВыходНаружуЗапрещён(имя);
      if (обратный) return обратный(ошибка);
      throw ошибка;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (исходныйПоиск as any).call(dns, имя, ...остальное);
  };
};
