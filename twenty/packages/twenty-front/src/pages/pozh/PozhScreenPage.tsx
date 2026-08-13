// пожсервис: страница-рамка для экранов службы документов.
//
// ЗАЧЕМ ИМЕННО РАМКА. Двадцать один экран (сверка таблиц, проверка счёта,
// реквизиты, путевые листы и остальные) остаётся в службе на Python. Переписывать
// их на React значило бы выбросить не код, а примерно шестьсот проверок,
// написанных на настоящих реквизитах компании. Здесь только рамка и меню.
//
// ПОЧЕМУ АДРЕС ЗАПРАШИВАЕТСЯ КАЖДЫЙ РАЗ. В адресе лежит разовый пропуск, он
// живёт пять минут. Взять его один раз и запомнить — значит через полчаса
// показать человеку пустую страницу без объяснения.

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { tokenPairState } from '@/auth/states/tokenPairState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

// Обычный fetch токен не прикладывает — его подставляет только слой запросов
// Twenty, а он умеет ходить лишь в GraphQL. Проверено в браузере: без заголовка
// ручка отвечает «нет доступа», причём молча — раздел просто оставался пустым.
//
// Возвращается СТРОКА, а не готовые заголовки: заголовки — новый объект на
// каждой отрисовке, и в списке зависимостей они дали бы бесконечную череду
// запросов. Строка сравнивается по значению.
const useТокен = (): string | undefined => {
  const пара = useAtomStateValue(tokenPairState);

  return пара?.accessOrWorkspaceAgnosticToken?.token;
};

const заголовки = (токен: string | undefined) =>
  токен === undefined ? undefined : { authorization: `Bearer ${токен}` };

type Экран = { ключ: string; название: string };

// Цвета и отступы берутся из переменных стилей, а не из объекта темы.
// Сначала было через тему — страница падала с «theme.spacing is not a function»
// и показывала «что-то пошло не так». В этой версии Twenty тема живёт в
// переменных стилей во время работы, и это же место, куда встаёт наша красная
// раскраска: одно правило вместо двух.
// `height: 100%` здесь не работает: место странице выделяет гибкая раскладка
// родителя, а не проценты. Первая попытка дала рамку нулевой ширины — экран
// открывался, но человек видел пустоту. Значения взяты с окна чата: там та же
// задача, «занять всё оставшееся место».
const Обёртка = styled.div`
  background: ${themeCssVariables.background.primary};
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
`;

const Рамка = styled.iframe`
  border: none;
  flex: 1;
  width: 100%;
`;

const Сообщение = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.md};
  padding: ${themeCssVariables.spacing[8]};
`;

const Плитки = styled.div`
  display: grid;
  gap: ${themeCssVariables.spacing[3]};
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  padding: ${themeCssVariables.spacing[6]};
`;

const Плитка = styled.a`
  background: ${themeCssVariables.background.secondary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  padding: ${themeCssVariables.spacing[4]};
  text-decoration: none;

  &:hover {
    border-color: ${themeCssVariables.color.red};
  }
`;

export const PozhScreenPage = () => {
  const токен = useТокен();
  const { screen } = useParams<{ screen?: string }>();

  const [экраны, setЭкраны] = useState<Экран[]>([]);
  const [адрес, setАдрес] = useState<string | null>(null);
  const [ошибка, setОшибка] = useState<string | null>(null);

  useEffect(() => {
    let отменено = false;

    const загрузить = async () => {
      setОшибка(null);
      setАдрес(null);

      try {
        if (screen === undefined) {
          const ответ = await fetch('/pozh/screens', { headers: заголовки(токен) });
          const тело = await ответ.json();

          if (отменено) return;

          if (тело.ошибка !== undefined) {
            setОшибка(тело.ошибка);
            return;
          }

          setЭкраны(тело.экраны ?? []);
          return;
        }

        const ответ = await fetch(`/pozh/screen/${encodeURIComponent(screen)}`, {
          headers: заголовки(токен),
        });
        const тело = await ответ.json();

        if (отменено) return;

        if (тело.ошибка !== undefined || тело.адрес === undefined) {
          // Молчаливая пустая рамка — худший исход: человек решит, что программа
          // сломалась, и пойдёт спрашивать. Текст сюда приходит уже пригодный
          // для показа, его писали для секретаря, а не для программиста.
          setОшибка(тело.ошибка ?? 'Экран не открылся, причина неизвестна.');
          return;
        }

        setАдрес(тело.адрес);
      } catch {
        if (!отменено) {
          setОшибка(
            'Служба проверки документов не отвечает. Скажите ИТ-администратору.',
          );
        }
      }
    };

    void загрузить();

    return () => {
      отменено = true;
    };
  }, [screen, токен]);

  if (ошибка !== null) {
    return (
      <Обёртка>
        <Сообщение>{ошибка}</Сообщение>
      </Обёртка>
    );
  }

  if (screen === undefined) {
    return (
      <Обёртка>
        <Плитки>
          {экраны.map((э) => (
            <Плитка key={э.ключ} href={`/documents/${э.ключ}`}>
              {э.название}
            </Плитка>
          ))}
        </Плитки>
      </Обёртка>
    );
  }

  if (адрес === null) {
    return (
      <Обёртка>
        <Сообщение>Открываю…</Сообщение>
      </Обёртка>
    );
  }

  return (
    <Обёртка>
      <Рамка src={адрес} title="Работа с документами" />
    </Обёртка>
  );
};
