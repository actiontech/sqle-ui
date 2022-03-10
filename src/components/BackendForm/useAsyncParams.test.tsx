import { renderHook } from '@testing-library/react-hooks';
import { BackendFormRequestParams, BackendFormValues, FormItem } from '.';
import { IAuditPlanParamResV1 } from '../../api/common';
import { AuditPlanParamResV1TypeEnum } from '../../api/common.enum';
import useAsyncParams from './useAsyncParams';

describe('useAsyncParams', () => {
  it('should merge form values into async params array', () => {
    const cases: Array<{
      value: BackendFormValues;
      params: FormItem[];
      expected: BackendFormRequestParams[];
    }> = [
      {
        value: {
          boolKey: false,
        },
        params: [
          {
            key: 'boolKey',
            desc: 'boolDesc',
            type: AuditPlanParamResV1TypeEnum.bool,
            value: 'true',
          },
        ],
        expected: [
          {
            key: 'boolKey',
            value: 'false',
          },
        ],
      },
      {
        value: {
          boolKey: true,
          intKey: '123',
          stringKey: 'this is a string',
        },
        params: [
          {
            key: 'boolKey',
            desc: 'boolDesc',
            type: AuditPlanParamResV1TypeEnum.bool,
            value: 'false',
          },
          {
            key: 'intKey',
            desc: 'intDesc',
            type: AuditPlanParamResV1TypeEnum.int,
            value: '1',
          },
          {
            key: 'stringKey',
            desc: 'stringDesc',
            type: AuditPlanParamResV1TypeEnum.string,
            value: 'stringValue',
          },
        ],
        expected: [
          {
            key: 'boolKey',
            value: 'true',
          },
          {
            key: 'intKey',
            value: '123',
          },
          {
            key: 'stringKey',
            value: 'this is a string',
          },
        ],
      },
    ];
    const hook = renderHook(() => useAsyncParams());
    cases.forEach(({ value, params, expected }) => {
      const res = hook.result.current.mergeFromValueIntoParams(value, params);
      expect(res).toEqual(expected);
    });
  });

  it('should generate form values from async params array', () => {
    const cases: Array<{
      params: IAuditPlanParamResV1[];
      expected: BackendFormValues;
    }> = [
      {
        params: [
          {
            key: 'boolKey',
            desc: 'boolDesc',
            type: AuditPlanParamResV1TypeEnum.bool,
            value: 'true',
          },
        ],
        expected: {
          boolKey: true,
        },
      },
      {
        params: [
          {
            key: 'boolKey',
            desc: 'boolDesc',
            type: AuditPlanParamResV1TypeEnum.bool,
            value: 'false',
          },
          {
            key: 'intKey',
            desc: 'intDesc',
            type: AuditPlanParamResV1TypeEnum.int,
            value: '1',
          },
          {
            key: 'stringKey',
            desc: 'stringDesc',
            type: AuditPlanParamResV1TypeEnum.string,
            value: 'stringValue',
          },
        ],
        expected: {
          boolKey: false,
          intKey: '1',
          stringKey: 'stringValue',
        },
      },
    ];
    const hook = renderHook(() => useAsyncParams());
    cases.forEach(({ params, expected }) => {
      const res = hook.result.current.generateFormValueByParams(params);
      expect(res).toEqual(expected);
    });
  });
});
