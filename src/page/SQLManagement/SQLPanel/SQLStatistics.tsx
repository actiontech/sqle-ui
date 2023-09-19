import { Card, Col, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { SQLStatisticsProps } from './index.type';

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
        <Row>
          <Col {...ColContentTitleLayout}>
            <Card.Grid
              hoverable={false}
              className="text-align-center full-width-element"
            >
              <Typography.Text strong>
                {t('sqlManagement.statistics.SQLTotalNum')}
              </Typography.Text>
            </Card.Grid>
          </Col>
          <Col {...ColContentValueLayout}>
            <Card.Grid
              hoverable={false}
              className="text-align-center full-width-element"
            >
              <Typography.Text>{SQLTotalNum}</Typography.Text>
            </Card.Grid>
          </Col>
        </Row>
      </Col>

      <Col {...ColWrapperLayout}>
        <Row>
          <Col {...ColContentTitleLayout}>
            <Card.Grid
              hoverable={false}
              className="text-align-center full-width-element"
            >
              <Typography.Text strong>
                {t('sqlManagement.statistics.problemSQlNum')}
              </Typography.Text>
            </Card.Grid>
          </Col>
          <Col {...ColContentValueLayout}>
            <Card.Grid
              hoverable={false}
              className="text-align-center full-width-element"
            >
              <Typography.Text>{problemSQlNum}</Typography.Text>
            </Card.Grid>
          </Col>
        </Row>
      </Col>

      <Col {...ColWrapperLayout}>
        <Row>
          <Col {...ColContentTitleLayout}>
            <Card.Grid
              hoverable={false}
              className="text-align-center full-width-element"
            >
              <Typography.Text strong>
                {t('sqlManagement.statistics.optimizedSQLNum')}
              </Typography.Text>
            </Card.Grid>
          </Col>
          <Col {...ColContentValueLayout}>
            <Card.Grid
              hoverable={false}
              className="text-align-center full-width-element"
            >
              <Typography.Text>{optimizedSQLNum}</Typography.Text>
            </Card.Grid>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default SQLStatistics;
