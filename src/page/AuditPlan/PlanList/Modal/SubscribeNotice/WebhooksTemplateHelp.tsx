import { Alert, Table, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { variableData } from './index.data';

const WebhooksTemplateHelp: React.FC<{ resetTemplate: () => void }> = (
  props
) => {
  const { t } = useTranslation();

  return (
    <Alert
      type="warning"
      message={
        <Typography.Text>
          {t('auditPlan.subscribeNotice.form.webhooksTemplateHelp.title')}
          <ul className="clear-margin-bottom">
            <li>
              {t('auditPlan.subscribeNotice.form.webhooksTemplateHelp.rule1')}
            </li>
            <li>
              {t('auditPlan.subscribeNotice.form.webhooksTemplateHelp.rule2')}
            </li>
            <li>
              <Typography.Link onClick={props.resetTemplate}>
                {t('auditPlan.subscribeNotice.form.webhooksTemplateHelp.reset')}
              </Typography.Link>
            </li>
          </ul>
          {t(
            'auditPlan.subscribeNotice.form.webhooksTemplateHelp.supportVariable'
          )}
          <Table
            size="small"
            rowKey="name"
            pagination={false}
            columns={[
              {
                dataIndex: 'name',
                title: () =>
                  t(
                    'auditPlan.subscribeNotice.form.webhooksTemplateHelp.table.desc'
                  ),
              },
              {
                dataIndex: 'variable',
                title: () =>
                  t(
                    'auditPlan.subscribeNotice.form.webhooksTemplateHelp.table.variable'
                  ),
              },
            ]}
            dataSource={variableData}
          />
        </Typography.Text>
      }
    />
  );
};

export default WebhooksTemplateHelp;
