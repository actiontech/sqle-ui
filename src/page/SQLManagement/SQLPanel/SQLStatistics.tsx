import { Card, Col, Row, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { SQLStatisticsProps } from './index.type';
import { CopyOutlined, RiseOutlined, WarningOutlined } from '@ant-design/icons';

const ColWrapperLayout = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 12,
  xl: 8,
  xxl: 6,
};

const ColContentTitleLayout = {
  xs: 14,
  sm: 10,
  md: 14,
  lg: 16,
  xl: 10,
  xxl: 10,
};

const ColContentValueLayout = {
  xs: 10,
  sm: 14,
  md: 10,
  lg: 8,
  xl: 14,
  xxl: 14,
};

const SQLStatistics: React.FC<SQLStatisticsProps> = ({
  SQLTotalNum,
  optimizedSQLNum,
  problemSQlNum,
}) => {
  const { t } = useTranslation();
  return (
    <Row gutter={30} className="sql-panel-statistics-wrapper">
      <Col {...ColWrapperLayout}>
        <Card>
          <Row align="middle">
            <Col {...ColContentTitleLayout} style={{ textAlign: 'center' }}>
              <CopyOutlined
                style={{ fontSize: 30 }}
                className="icon text-blue"
              />
            </Col>
            <Col {...ColContentValueLayout}>
              <Space direction="vertical" className="flex-all-center" size={0}>
                <Typography.Text style={{ fontSize: 18 }}>
                  {SQLTotalNum}
                </Typography.Text>
                <Typography.Text strong style={{ fontSize: 16 }}>
                  {t('sqlManagement.statistics.SQLTotalNum')}
                </Typography.Text>
              </Space>
            </Col>
          </Row>
        </Card>
      </Col>

      <Col {...ColWrapperLayout}>
        <Card>
          <Row align="middle">
            <Col {...ColContentTitleLayout} style={{ textAlign: 'center' }}>
              <WarningOutlined
                style={{ fontSize: 30 }}
                className="icon text-orange"
              />
            </Col>
            <Col {...ColContentValueLayout}>
              <Space direction="vertical" className="flex-all-center" size={0}>
                <Typography.Text style={{ fontSize: 18 }}>
                  {problemSQlNum}
                </Typography.Text>
                <Typography.Text strong style={{ fontSize: 16 }}>
                  {t('sqlManagement.statistics.problemSQlNum')}
                </Typography.Text>
              </Space>
            </Col>
          </Row>
        </Card>
      </Col>

      <Col {...ColWrapperLayout}>
        <Card>
          <Row align="middle">
            <Col {...ColContentTitleLayout} style={{ textAlign: 'center' }}>
              <RiseOutlined
                style={{ fontSize: 30 }}
                className="icon text-green"
              />
            </Col>
            <Col {...ColContentValueLayout}>
              <Space direction="vertical" className="flex-all-center" size={0}>
                <Typography.Text style={{ fontSize: 18 }}>
                  {optimizedSQLNum}
                </Typography.Text>
                <Typography.Text strong style={{ fontSize: 16 }}>
                  {t('sqlManagement.statistics.optimizedSQLNum')}
                </Typography.Text>
              </Space>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default SQLStatistics;
