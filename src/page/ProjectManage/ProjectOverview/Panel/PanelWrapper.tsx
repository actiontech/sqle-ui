import { Card } from 'antd';
import { PanelWrapperProps } from './index';

const PanelWrapper: React.FC<PanelWrapperProps> = ({
  children,
  title,
  subTitle,
  loading,
  error,
  bodyStyle,
}) => {
  return (
    <Card
      title={title}
      extra={subTitle}
      hoverable={true}
      loading={loading}
      type="inner"
      bordered
      bodyStyle={bodyStyle}
      style={{
        height: '100%',
      }}
    >
      {error ? error : children}
    </Card>
  );
};

export default PanelWrapper;
