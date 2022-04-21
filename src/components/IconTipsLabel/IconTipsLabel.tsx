import { InfoCircleOutlined } from '@ant-design/icons';
import { Space, Tooltip } from 'antd';
import { IIconTipsLabelProps } from '.';

const IconTipsLabel: React.FC<IIconTipsLabelProps> = (props) => {
  const { tips, children } = props;

  return (
    <Space>
      <Tooltip overlay={tips}>
        <InfoCircleOutlined className="text-orange" />
      </Tooltip>
      {children}
    </Space>
  );
};

export default IconTipsLabel;
