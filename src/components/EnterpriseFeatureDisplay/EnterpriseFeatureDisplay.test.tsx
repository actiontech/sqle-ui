import { render } from '@testing-library/react';
import EnterpriseFeatureDisplay from './EnterpriseFeatureDisplay';
import { Space } from 'antd';

const children = <>ee version display</>;

describe('test EnterpriseFeatureDisplay', () => {
  test('should match snapshot', () => {
    const { container, rerender } = render(
      <EnterpriseFeatureDisplay
        featureName="featureName"
        eeFeatureDescription="eeFeatureDescription"
      >
        {children}
      </EnterpriseFeatureDisplay>
    );

    expect(container).toMatchSnapshot();

    rerender(
      <EnterpriseFeatureDisplay
        clearCEWrapperPadding
        featureName="featureName"
        eeFeatureDescription={
          <Space>
            <span>test\ntest\n</span>
            <span>test\n</span>
          </Space>
        }
      >
        {children}
      </EnterpriseFeatureDisplay>
    );

    expect(container).toMatchSnapshot();
  });
});
