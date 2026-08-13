// пожсервис: разделы меню с экранами службы документов и объектами учёта.
//
// ПОЧЕМУ СПИСОК СПРАШИВАЕТСЯ, А НЕ ВПИСАН СЮДА. Экраны и разделы задаёт служба.
// Рукописный список здесь устаревал бы молча: экран есть, а попасть в него
// неоткуда. Порядок разделов — тоже оттуда: два места, знающие одно и то же,
// расходятся, и потом не понять, какое из них главное.
//
// ПОЧЕМУ РАЗДЕЛЫ РИСУЮТСЯ В ДВУХ МЕСТАХ. Владелец потребовал, чтобы «Ведётся
// разработка» был самым нижним пунктом меню — ниже объектов учёта Twenty.
// Раздел Twenty рисуется между нашими, поэтому наши идут двумя заходами:
// «сверху» и «снизу». Смысл не в красоте: человек ищет нужное сверху вниз и не
// должен натыкаться на недоделку раньше, чем на рабочее.
//
// ПОЧЕМУ ОШИБКА ВИДНА. Если служба не отвечает, разделы не исчезают, а
// показывают строку с объяснением. Пропавшее меню человек читает как «функции
// убрали» и идёт спрашивать; строка отвечает на вопрос до того, как он возник.

import { useEffect, useState } from 'react';
import { IconFileText } from 'twenty-ui/icon';
import { AnimatedExpandableContainer } from 'twenty-ui/layout';

import { tokenPairState } from '@/auth/states/tokenPairState';
import { NavigationDrawerAnimatedCollapseWrapper } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerAnimatedCollapseWrapper';
import { NavigationDrawerItem } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerItem';
import { NavigationDrawerSection } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSection';
import { NavigationDrawerSectionTitle } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSectionTitle';
import { useNavigationSection } from '@/ui/navigation/navigation-drawer/hooks/useNavigationSection';
import { isNavigationSectionOpenFamilyState } from '@/ui/navigation/navigation-drawer/states/isNavigationSectionOpenFamilyState';
import { useAtomFamilyStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilyStateValue';
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

type Раздел = {
  ключ: string;
  название: string;
  место: 'сверху' | 'снизу';
  экраны: Экран[];
};

/**
 * Объекты учёта, которые владелец потребовал показывать вместе с экранами
 * путевых листов, а не в общем разделе Twenty.
 *
 * Причина простая: человеку всё равно, что машины живут в новой программе, а
 * экран «Машины и рейсы» — в старой. Он ищет «где про машины», и это должно
 * быть в одном месте.
 *
 * Список рукописный, и это его слабое место — поэтому рядом стоит проверка,
 * читающая описание объектов с диска: если объект переименуют, она упадёт, а не
 * оставит пункт меню, ведущий в никуда.
 */
const ОБЪЕКТЫ_УЧЁТА_В_РАЗДЕЛЕ: Record<string, { имя: string; название: string }[]> = {
  waybills: [
    { имя: 'pozhWaybills', название: 'Путевые листы (учёт)' },
    { имя: 'pozhTrips', название: 'Рейсы' },
    { имя: 'pozhVehicles', название: 'Машины' },
    { имя: 'pozhDrivers', название: 'Водители' },
    { имя: 'pozhTrailers', название: 'Прицепы' },
    { имя: 'pozhPoints', название: 'Точки' },
  ],
};

const РазделМеню = ({ раздел }: { раздел: Раздел }) => {
  const { toggleNavigationSection } = useNavigationSection(раздел.ключ);
  const открыт = useAtomFamilyStateValue(isNavigationSectionOpenFamilyState, раздел.ключ);

  const объекты = ОБЪЕКТЫ_УЧЁТА_В_РАЗДЕЛЕ[раздел.ключ] ?? [];

  return (
    <NavigationDrawerSection>
      <NavigationDrawerAnimatedCollapseWrapper>
        <NavigationDrawerSectionTitle
          label={раздел.название}
          onClick={toggleNavigationSection}
          isOpen={открыт}
        />
      </NavigationDrawerAnimatedCollapseWrapper>
      <AnimatedExpandableContainer
        isExpanded={открыт}
        dimension="height"
        mode="fit-content"
        containAnimation
        initial={false}
      >
        {раздел.экраны.map((э) => (
          <NavigationDrawerItem
            key={э.ключ}
            label={э.название}
            to={`/documents/${э.ключ}`}
            Icon={IconFileText}
          />
        ))}
        {объекты.map((о) => (
          <NavigationDrawerItem
            key={о.имя}
            label={о.название}
            to={`/objects/${о.имя}`}
            Icon={IconFileText}
          />
        ))}
      </AnimatedExpandableContainer>
    </NavigationDrawerSection>
  );
};

export const PozhNavigationSection = ({ место }: { место: 'сверху' | 'снизу' }) => {
  const токен = useТокен();
  const [разделы, setРазделы] = useState<Раздел[]>([]);
  const [ошибка, setОшибка] = useState<string | null>(null);

  useEffect(() => {
    let отменено = false;

    const загрузить = async () => {
      try {
        const ответ = await fetch('/pozh/screens', { headers: заголовки(токен) });
        const тело = await ответ.json();

        if (отменено) return;

        if (тело.ошибка !== undefined) {
          setОшибка(тело.ошибка);
          return;
        }

        setРазделы(тело.разделы ?? []);
      } catch {
        if (!отменено) {
          setОшибка('Служба проверки документов не отвечает.');
        }
      }
    };

    void загрузить();

    return () => {
      отменено = true;
    };
  }, [токен]);

  // Об ошибке говорит только верхний заход: одно и то же сообщение дважды на
  // одном экране выглядит как две разные поломки.
  if (ошибка !== null) {
    return место === 'сверху' ? (
      <NavigationDrawerSection>
        <NavigationDrawerItem label={ошибка} Icon={IconFileText} />
      </NavigationDrawerSection>
    ) : null;
  }

  return (
    <>
      {разделы
        .filter((р) => р.место === место)
        .map((р) => (
          <РазделМеню key={р.ключ} раздел={р} />
        ))}
    </>
  );
};
