// пожсервис: замок на битую картинку, которую не видно как отказ.
//
// Логотип по умолчанию указывал на файл, которого нет. Сборщик страниц на такой
// адрес отдаёт саму страницу с ответом «200» — то есть в журналах чисто, ошибок
// нет, а человек видит пустой прямоугольник вместо логотипа конторы.
//
// Проверка читает файл с диска, а не сверяется со списком: список устарел бы
// ровно так же молча.

import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { DEFAULT_WORKSPACE_LOGO } from '../DefaultWorkspaceLogo';

describe('логотип по умолчанию', () => {
  it('лежит у нас, а не на чужом сервере', () => {
    // Раньше он тянулся с twentyhq.github.io на каждой странице, включая вход:
    // владельцу того сервера был виден адрес конторы и время работы.
    expect(DEFAULT_WORKSPACE_LOGO.startsWith('/')).toBe(true);
    expect(DEFAULT_WORKSPACE_LOGO).not.toMatch(/^https?:/);
  });

  it('такой файл есть на диске', () => {
    const путь = join(__dirname, '../../../../../../..', 'public', DEFAULT_WORKSPACE_LOGO);

    expect(existsSync(путь)).toBe(true);
  });
});
