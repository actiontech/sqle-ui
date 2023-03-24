import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { useBoolean } from 'ahooks';
import { Col, Row, Space, Typography, Upload, UploadProps } from 'antd';
import { useTranslation } from 'react-i18next';
import configuration from '../../../api/configuration';
import { ResponseCode } from '../../../data/common';
import logo from '../../../assets/img/logo.png';

const UploadLogo: React.FC<{ url?: string; refresh: () => void }> = ({
  url,
  refresh,
}) => {
  const { t } = useTranslation();
  const [loading, { setFalse: finishUpload, setTrue: startUpload }] =
    useBoolean(false);

  const customRequest: UploadProps['customRequest'] = (options) => {
    startUpload();
    configuration
      .uploadLogo(
        {
          logo: options.file,
        },
        {
          headers: {
            'content-type': 'multipart/form-data',
          },
        }
      )
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          window.location.reload();
          refresh();
        }
      })
      .finally(() => {
        finishUpload();
      });
  };

  return (
    <Row>
      <Col sm={3} xl={2} xs={24}>
        <Typography.Text>{t('system.personalize.logo')} : </Typography.Text>
      </Col>
      <Col sm={10} xs={24}>
        <Space align="end">
          <Upload
            data-testid="upload-logo"
            name="logo"
            listType="picture-card"
            showUploadList={false}
            customRequest={customRequest}
            disabled={loading}
          >
            {loading ? (
              <LoadingOutlined />
            ) : (
              <Space direction="vertical">
                <img
                  style={{
                    width: '50%',
                  }}
                  src={url ? url : logo}
                  alt="logo"
                />
                <Typography.Text type="secondary">
                  <UploadOutlined />
                  {t('system.personalize.uploadAndUpdate')}
                </Typography.Text>
              </Space>
            )}
          </Upload>
          <Typography.Text type="secondary">
            {t('system.personalize.uploadTips')}
          </Typography.Text>
        </Space>
      </Col>
    </Row>
  );
};

export default UploadLogo;
