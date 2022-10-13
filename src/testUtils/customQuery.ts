import * as domTestingLib from '@testing-library/dom';
import { fireEvent, screen } from '@testing-library/react';

export const getBySelector = (selector: string, baseElement?: Element) => {
  let temp;
  if (baseElement !== undefined) {
    temp = baseElement.querySelectorAll(selector);
  } else {
    temp = document.querySelectorAll(selector);
  }
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

export const getAllBySelector = (selector: string, baseElement?: Element) => {
  let temp;
  if (baseElement !== undefined) {
    temp = baseElement.querySelectorAll(selector);
  } else {
    temp = document.querySelectorAll(selector);
  }
  if (temp.length === 0) {
    throw domTestingLib.queryHelpers.getElementError(
      `Unable to find an element by: selector=${selector}`,
      document.body
    );
  }
  return temp;
};

export const getSelectContentByFormLabel = (label: string) => {
  return getBySelector(
    '.ant-select-selection-item-content',
    screen.getByText(label).parentNode?.parentNode as HTMLDivElement
  );
};

export const getSelectValueByFormLabel = (label: string) => {
  return getBySelector(
    '.ant-select-selection-item',
    screen.getByLabelText(label).parentNode?.parentNode as HTMLDivElement
  );
};

export const selectOptionByIndex = (
  label: string,
  optionText: string,
  index = 1
) => {
  fireEvent.mouseDown(screen.getByLabelText(label));
  const options = screen.getAllByText(optionText);
  let realIndex = index;
  if (index < 0) {
    realIndex = options.length + index;
  }
  const option = options[realIndex];
  expect(option).toHaveClass('ant-select-item-option-content');
  fireEvent.click(option);
};
