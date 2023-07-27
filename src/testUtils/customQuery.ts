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

/**
 * 模拟选择 Select 组件中下拉框中的某项数据
 * @param 表单中 Select 组件外部 Form.Item 的label, 注意该 Form.Item 必须有 name
 * @param optionText 需要选中的下拉项
 * @param index 通过文本获取所有的节点会有两个(具体信息可以在网页上查看Select 组件中下拉的节点信息), 正常来说其中第二个是需要来需要用户点击的,
 * 所以这里的 index 默认值为 1. 并且这个节点拥有类名 ant-select-item-option-content, 所以在点击前需要使用 expect 来判断是否为正确的节点.
 */
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

/**
 * 具体功能同 selectOptionByIndex, 不过该函数主要针对下拉框选项为一个节点的情况
 * @param label 表单中 Select 组件外部 Form.Item 的label, 注意该 Form.Item 必须有 name
 * @param optionCls 下拉项节点最外层的 class
 * @param index  这里不同于 selectOptionByIndex 的 index, 其代表的就是真实需要选择的下拉项的序号, 从 0 开始.
 */
export const selectCustomOptionByClassName = (
  label: string,
  optionCls: string,
  index: number
) => {
  fireEvent.mouseDown(screen.getByLabelText(label));
  const options = getAllBySelector(`.${optionCls}`);
  let realIndex = index;
  if (index < 0) {
    realIndex = options.length + index;
  }

  const option = options[realIndex];
  expect(option.parentNode).toHaveClass('ant-select-item-option-content');
  fireEvent.click(option);
};

export const getHrefByText = (name: string) => {
  return screen.getByText(name).getAttribute('href');
};

export const getAllHrefByText = (name: string) => {
  return screen.getAllByText(name).map((v) => v.getAttribute('href'));
};
