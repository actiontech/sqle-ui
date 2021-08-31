import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { useBoolean } from 'ahooks';
import { Row, Tooltip, Typography } from 'antd';

const TokenText: React.FC<{ token: string }> = (props) => {
  const [tokenVisible, { setTrue: showToken, setFalse: hideToken }] =
    useBoolean();

  return (
    <Row align="middle" onClick={(e) => e.stopPropagation()}>
      <Tooltip overlay={tokenVisible ? props.token : ''} placement="bottom">
        <Typography.Text
          copyable={{ text: props.token }}
          style={{
            width: 135,
            lineHeight: '22px',
          }}
          ellipsis
        >
          {tokenVisible ? props.token : '****************'}
        </Typography.Text>
      </Tooltip>

      {tokenVisible ? (
        <EyeOutlined
          className="text-blue cursor-pointer"
          onClick={hideToken}
          wrap="div"
        />
      ) : (
        <EyeInvisibleOutlined
          className="text-blue cursor-pointer"
          onClick={showToken}
        />
      )}
    </Row>
  );
};

export default TokenText;
