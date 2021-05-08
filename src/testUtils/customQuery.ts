import * as domTestingLib from '@testing-library/dom';

export const getByClassName = (className: string) => {
  const temp = document.querySelectorAll(className);
  if (temp.length === 0) {
    throw domTestingLib.queryHelpers.getElementError(
      `Unable to find an element by: classname=${className}`,
      document.body
    );
  }
  if (temp.length > 1) {
    throw domTestingLib.queryHelpers.getElementError(
      `Found multiple elements with the classname=${className}`,
      document.body
    );
  }
  return temp[0];
};
