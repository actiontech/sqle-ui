import {
  Button,
  Card,
  Col,
  PageHeader,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { Theme } from '@mui/material/styles';
import { useTheme } from '@mui/styles';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';
import AuditResult from '../../Order/AuditResult';
import { useParams } from 'react-router-dom';
import task from '../../../api/task';
import { Link } from '../../../components/Link';
import { useRequest } from 'ahooks';
import sql_audit_record from '../../../api/sql_audit_record';
import { floatRound, floatToPercent } from '../../../utils/Math';

const SQLAuditDetail: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();
  const { projectName } = useCurrentProjectName();
  const { id } = useParams<{ id: string }>();

  const downloadReport = () => {
    task.downloadAuditTaskSQLReportV1({
      task_id: `${auditRecord?.task?.task_id}`,
      no_duplicate: false,
    });
  };

  const { data: auditRecord } = useRequest(() =>
    sql_audit_record
      .getSQLAuditRecordV1({
        project_name: projectName,
        sql_audit_record_id: id ?? '',
      })
      .then((res) => res.data.data)
  );

  return (
    <>
      <PageHeader title={t('sqlAudit.detail.title')} ghost={false}>
        {t('sqlAudit.detail.pageDesc')}
      </PageHeader>

      <section className="padding-content">
        <Space
          size={theme.common.padding}
          className="full-width-element"
          direction="vertical"
        >
          <Card>
            <div
              className="full-width-element flex-space-between"
              style={{
                alignItems: 'flex-start',
              }}
            >
              <Space
                direction="vertical"
                style={{
                  flexBasis: '80%',
                }}
              >
                <Row>
                  <Col span={4}>
                    <Typography.Text>
                      {t('sqlAudit.detail.auditID')}
                    </Typography.Text>
                  </Col>

                  <Col span={16}>
                    <Space>
                      <Typography.Text strong>
                        {auditRecord?.sql_audit_record_id}
                      </Typography.Text>
                      {auditRecord?.tags?.map(
                        (v) =>
                          v && (
                            <Tag color="blue" key={v}>
                              {v}
                            </Tag>
                          )
                      )}
                    </Space>
                  </Col>
                </Row>
                <Row>
                  <Col span={4}>
                    <Typography.Text>
                      {t('sqlAudit.detail.auditPassRate')}
                    </Typography.Text>
                  </Col>

                  <Col span={16}>
                    {floatToPercent(auditRecord?.task?.pass_rate ?? 0)}%
                  </Col>
                </Row>
                <Row>
                  <Col span={4}>
                    <Typography.Text>
                      {t('sqlAudit.detail.auditRating')}
                    </Typography.Text>
                  </Col>
                  <Col span={16}>
                    {floatRound(auditRecord?.task?.score ?? 0)}
                  </Col>
                </Row>
              </Space>

              <Space>
                <Button onClick={downloadReport}>{t('common.download')}</Button>

                <Link to={`project/${projectName}/sqlAudit`}>
                  <Button type="primary">{t('common.back')}</Button>
                </Link>
              </Space>
            </div>
          </Card>
          <Card>
            <AuditResult
              mode="auditRecordDetail"
              taskId={auditRecord?.task?.task_id}
              projectName={projectName}
            />
          </Card>
        </Space>
      </section>
    </>
  );
};

export default SQLAuditDetail;
