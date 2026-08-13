// пожсервис: живая проверка нашла дыру — лист заводился с номером, но без
// организации и серии, и составной указатель уникальности его не ловил (база
// считает NULL несравнимым). Этот замок проверяет запись до сохранения.

import { CommonQueryRunnerExceptionCode } from 'src/engine/api/common/common-query-runners/errors/common-query-runner.exception';
import { assertWaybillNumberHasOrganizationAndSeries } from 'src/pozh/query-hooks/waybill-number-validation.util';

describe('assertWaybillNumberHasOrganizationAndSeries', () => {
  it('пропускает черновик без номера, даже если организация и серия тоже пусты', () => {
    expect(() =>
      assertWaybillNumberHasOrganizationAndSeries({
        number: undefined,
        organizationId: undefined,
        series: undefined,
      }),
    ).not.toThrow();
  });

  it('пропускает пустую строку в номере как отсутствие номера', () => {
    expect(() =>
      assertWaybillNumberHasOrganizationAndSeries({
        number: '',
        organizationId: null,
        series: null,
      }),
    ).not.toThrow();
  });

  it('пропускает выписанный лист с заполненными организацией и серией', () => {
    expect(() =>
      assertWaybillNumberHasOrganizationAndSeries({
        number: '4417',
        organizationId: 'org-1',
        series: 'АА',
      }),
    ).not.toThrow();
  });

  it('отклоняет номер без организации', () => {
    expect(() =>
      assertWaybillNumberHasOrganizationAndSeries({
        number: '4417',
        organizationId: undefined,
        series: 'АА',
      }),
    ).toThrow();
  });

  it('отклоняет номер без серии', () => {
    expect(() =>
      assertWaybillNumberHasOrganizationAndSeries({
        number: '4417',
        organizationId: 'org-1',
        series: null,
      }),
    ).toThrow();
  });

  it('отклоняет номер без организации и серии кодом BAD_REQUEST', () => {
    try {
      assertWaybillNumberHasOrganizationAndSeries({
        number: '4417',
        organizationId: undefined,
        series: undefined,
      });
      throw new Error('ожидалось исключение');
    } catch (ошибка) {
      expect(ошибка).toMatchObject({
        code: CommonQueryRunnerExceptionCode.BAD_REQUEST,
      });
    }
  });
});
