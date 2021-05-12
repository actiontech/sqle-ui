import * as domTestingLib from '@testing-library/dom';

export const getBySelector = (selector: string) => {
  const temp = document.querySelectorAll(selector);
  if (temp.length === 0) {
    throw domTestingLib.queryHelpers.getElementError(
      `Unable to find an element by: selector=${selector}`,
      document.body
    );
  }
  if (temp.length > 1) {
    throw domTestingLib.queryHelpers.getElementError(
      `Found multiple elements with the selector=${selector}`,
      document.body
    );
  }
  return temp[0];
};
