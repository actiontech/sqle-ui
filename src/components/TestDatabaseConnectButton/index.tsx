import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { useBoolean } from 'ahooks';
import { Button, Space, Tooltip, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import EmptyBox from '../EmptyBox';
import { TestDatabaseConnectButtonProps } from './index.type';

const TestDatabaseConnectButton: React.FC<TestDatabaseConnectButtonProps> = (
  props
) => {
  const { t } = useTranslation();
  const [initHide, { setFalse }] = useBoolean(props.initHide ?? true);

  const handleClick = () => {
    if (initHide && props.initHide === undefined) {
      setFalse();
    }
    props.onClickTestButton();
  };

  return (
    <Space>
      <Button onClick={handleClick} loading={props.loading}>
        {t('dataSource.dataSourceForm.testDatabaseConnection')}
      </Button>
      <EmptyBox if={props.initHide !== undefined ? !props.initHide : !initHide}>
        {props.loading && (
          <Typography.Link>
            {t('dataSource.dataSourceForm.testing')}
          </Typography.Link>
        )}
        {!props.loading && props.connectAble && (
          <Typography.Text type="success">
            <CheckCircleFilled />
            {t('dataSource.dataSourceForm.testSuccess')}
          </Typography.Text>
        )}
        {!props.loading && !props.connectAble && (
          <Tooltip overlay={props.connectDisableReason}>
            <Typography.Text type="danger">
              <CloseCircleFilled />
              {t('dataSource.dataSourceForm.testFailed')}
            </Typography.Text>
          </Tooltip>
        )}
      </EmptyBox>
    </Space>
  );
};

export default TestDatabaseConnectButton;
