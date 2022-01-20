import { IAuditPlanParamResV1 } from '../../api/common';
import { AuditPlanParamResV1TypeEnum } from '../../api/common.enum';
import { Dictionary } from '../../types/common.type';

const useAsyncParams = () => {
  const mergeFromValueIntoParams = (
    value: Dictionary,
    params: IAuditPlanParamResV1[]
  ) => {
    return params.map((item) => {
      const temp = {
        ...item,
      };
      if (item.key && Object.prototype.hasOwnProperty.call(value, item.key)) {
        const tempVal = value[item.key];
        if (typeof tempVal === 'boolean') {
          temp.value = tempVal ? 'true' : 'false';
        } else {
          temp.value = String(tempVal);
        }
      }
      return temp;
    });
  };

  const generateFormValueByParams = (params: IAuditPlanParamResV1[]) => {
    const value: Dictionary = {};
    params.forEach((item) => {
      if (item.key) {
        if (item.type === AuditPlanParamResV1TypeEnum.bool) {
          value[item.key] = item.value === 'true' ? true : false;
        } else {
          value[item.key] = item.value;
        }
      }
    });
    return value;
  };

  return {
    mergeFromValueIntoParams,
    generateFormValueByParams,
  };
};

export default useAsyncParams;
