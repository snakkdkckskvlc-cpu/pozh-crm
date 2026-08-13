import { styled } from '@linaria/react';
import { t } from '@lingui/core/macro';
import { IconSearch } from 'twenty-ui/icon';
import { LightIconButton } from 'twenty-ui/input';
import { MOBILE_VIEWPORT, themeCssVariables } from 'twenty-ui/theme-constants';

import { useOpenRecordsSearchPageInSidePanel } from '@/side-panel/hooks/useOpenRecordsSearchPageInSidePanel';
import { PAGE_BAR_MIN_HEIGHT } from '@/ui/layout/page/constants/PageBarMinHeight';
import { MultiWorkspaceDropdownButton } from '@/ui/navigation/navigation-drawer/components/MultiWorkspaceDropdown/MultiWorkspaceDropdownButton';
import { isNavigationDrawerExpandedState } from '@/ui/navigation/states/isNavigationDrawerExpanded';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { NavigationDrawerCollapseButton } from './NavigationDrawerCollapseButton';

const StyledContainer = styled.div<{ isExpanded: boolean }>`
  align-items: ${({ isExpanded }) => (isExpanded ? 'center' : 'flex-start')};
  display: flex;
  flex-direction: ${({ isExpanded }) => (isExpanded ? 'row' : 'column')};
  flex-shrink: 0;
  gap: ${({ isExpanded }) => (isExpanded ? '0' : themeCssVariables.spacing[4])};
  min-height: ${PAGE_BAR_MIN_HEIGHT}px;
  padding-right: ${themeCssVariables.spacing[2]};
  transition: gap calc(${themeCssVariables.animation.duration.normal} * 1s) ease;
  user-select: none;

  @media (max-width: ${MOBILE_VIEWPORT}px) {
    padding-left: ${themeCssVariables.spacing[5]};
    padding-right: ${themeCssVariables.spacing[5]};
  }
`;

const StyledRightActions = styled.div<{ isExpanded: boolean }>`
  align-items: center;
  align-self: ${({ isExpanded }) => (isExpanded ? 'auto' : 'flex-end')};
  display: flex;
  flex-direction: ${({ isExpanded }) => (isExpanded ? 'row' : 'column')};
  flex-shrink: 0;
  gap: ${({ isExpanded }) =>
    isExpanded ? '2px' : themeCssVariables.spacing[1]};
  margin-left: ${({ isExpanded }) => (isExpanded ? 'auto' : '0')};
  transition: gap calc(${themeCssVariables.animation.duration.normal} * 1s) ease;
`;

const StyledNavigationDrawerCollapseButtonContainer = styled.div`
  > * {
    height: ${themeCssVariables.spacing[6]};
    padding-right: 0;
    width: ${themeCssVariables.spacing[6]};
  }

  @media (max-width: ${MOBILE_VIEWPORT}px) {
    > * {
      height: ${themeCssVariables.spacing[8]};
      padding-right: 0;
      width: ${themeCssVariables.spacing[8]};
    }
  }
`;

const StyledWorkspaceDropdownContainer = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1 auto;
  min-height: ${themeCssVariables.spacing[8]};
  min-width: 0;
`;

type NavigationDrawerHeaderProps = {
  showCollapseButton: boolean;
};

export const NavigationDrawerHeader = ({
  showCollapseButton,
}: NavigationDrawerHeaderProps) => {
  const isMobile = useIsMobile();
  const { openRecordsSearchPage } = useOpenRecordsSearchPageInSidePanel();
  const isNavigationDrawerExpanded = useAtomStateValue(
    isNavigationDrawerExpandedState,
  );

  return (
    <StyledContainer isExpanded={isNavigationDrawerExpanded}>
      <StyledWorkspaceDropdownContainer>
        <MultiWorkspaceDropdownButton />
      </StyledWorkspaceDropdownContainer>
      <StyledRightActions isExpanded={isNavigationDrawerExpanded}>
        {!isMobile && (
          <LightIconButton
            Icon={IconSearch}
            accent="secondary"
            size="small"
            onClick={openRecordsSearchPage}
            aria-label={t`Search`}
          />
        )}
        {/* пожсервис: раньше кнопка сворачивания рисовалась ТОЛЬКО пока панель
            развёрнута — обратную кнопку («развернуть») рисовала соседняя шапка
            страницы (PageHeader), а не сама панель. Но наши 21 экран службы
            документов (/documents/*, PozhScreenPage) — это простая страница
            без PageHeader. Свернул панель на такой странице — и кнопки
            «развернуть» не было НИГДЕ на экране, а состояние «свёрнуто»
            запоминается и переживает перезагрузку: тупик без выхода.
            Найдено живым обходом («кнопка закрывает меню, а открыть
            невозможно»). Теперь кнопка всегда в одном и том же месте самой
            панели, и любая страница, наша или будущая, её не может спрятать. */}
        {showCollapseButton && !isMobile && (
          <StyledNavigationDrawerCollapseButtonContainer>
            <NavigationDrawerCollapseButton
              direction={isNavigationDrawerExpanded ? 'left' : 'right'}
            />
          </StyledNavigationDrawerCollapseButtonContainer>
        )}
      </StyledRightActions>
    </StyledContainer>
  );
};
