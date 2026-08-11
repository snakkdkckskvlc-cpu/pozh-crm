// пожсервис: раздел меню со списком экранов службы документов.
//
// ПОЧЕМУ СПИСОК СПРАШИВАЕТСЯ, А НЕ ВПИСАН СЮДА. Экранов двадцать один, и они
// добавляются на стороне службы. Рукописный список здесь устаревал бы молча:
// экран есть, а попасть в него неоткуда. Служба отдаёт свой список сама, и это
// единственное место, где он существует.
//
// ПОЧЕМУ ОШИБКА ВИДНА. Если служба не отвечает, раздел не исчезает, а
// показывает строку с объяснением. Пропавший раздел человек читает как «функции
// убрали» и идёт спрашивать; строка отвечает на вопрос до того, как он возник.

import { useEffect, useState } from 'react';
import { IconFileText } from 'twenty-ui/icon';
import { AnimatedExpandableContainer } from 'twenty-ui/layout';

import { NavigationDrawerAnimatedCollapseWrapper } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerAnimatedCollapseWrapper';
import { NavigationDrawerItem } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerItem';
import { NavigationDrawerSection } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSection';
import { NavigationDrawerSectionTitle } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSectionTitle';
import { useNavigationSection } from '@/ui/navigation/navigation-drawer/hooks/useNavigationSection';
import { isNavigationSectionOpenFamilyState } from '@/ui/navigation/navigation-drawer/states/isNavigationSectionOpenFamilyState';
import { useAtomFamilyStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilyStateValue';
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

export const PozhNavigationSection = () => {
  const токен = useТокен();
  const [экраны, setЭкраны] = useState<Экран[]>([]);
  const [ошибка, setОшибка] = useState<string | null>(null);

  const { toggleNavigationSection } = useNavigationSection('Pozh');
  const isNavigationSectionOpen = useAtomFamilyStateValue(
    isNavigationSectionOpenFamilyState,
    'Pozh',
  );

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

        setЭкраны(тело.экраны ?? []);
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

  return (
    <NavigationDrawerSection>
      <NavigationDrawerAnimatedCollapseWrapper>
        <NavigationDrawerSectionTitle
          label="Работа с документами"
          onClick={toggleNavigationSection}
          isOpen={isNavigationSectionOpen}
        />
      </NavigationDrawerAnimatedCollapseWrapper>
      <AnimatedExpandableContainer
        isExpanded={isNavigationSectionOpen}
        dimension="height"
        mode="fit-content"
        containAnimation
        initial={false}
      >
        {ошибка !== null ? (
          <NavigationDrawerItem label={ошибка} Icon={IconFileText} />
        ) : (
          экраны.map((э) => (
            <NavigationDrawerItem
              key={э.ключ}
              label={э.название}
              to={`/documents/${э.ключ}`}
              Icon={IconFileText}
            />
          ))
        )}
      </AnimatedExpandableContainer>
    </NavigationDrawerSection>
  );
};
