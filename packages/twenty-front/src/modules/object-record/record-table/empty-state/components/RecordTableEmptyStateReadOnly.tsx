import { useObjectLabel } from '@/object-metadata/hooks/useObjectLabel';
import { useRecordTableContextOrThrow } from '@/object-record/record-table/contexts/RecordTableContext';
import { RecordTableEmptyStateDisplay } from '@/object-record/record-table/empty-state/components/RecordTableEmptyStateDisplay';
import { t } from '@lingui/core/macro';
import { IconPlus } from 'twenty-ui/icon';

export const RecordTableEmptyStateReadOnly = () => {
  const { objectMetadataItem } = useRecordTableContextOrThrow();

  const objectLabelSingular = useObjectLabel(objectMetadataItem);

  // Пометка перевода стояла в соседнем экране пустого списка, а здесь её
  // забыли — и надпись оставалась английской при полностью русском словаре.
  // Строка `Add a {objectLabelSingular}` в словаре есть и переведена.
  const buttonTitle = t`Add a ${objectLabelSingular}`;

  return (
    <RecordTableEmptyStateDisplay
      title={t`No records found`}
      subTitle={t`You are not allowed to create records for this object`}
      animatedPlaceholderType="noRecord"
      buttonTitle={buttonTitle}
      ButtonIcon={IconPlus}
      buttonIsDisabled={true}
    />
  );
};
