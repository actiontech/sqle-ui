import useRequest from '@ahooksjs/use-request';
import { Card, Col, PageHeader, Row, Select, Space } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ruleTemplate from '../../api/rule_template';
import RuleList from '../../components/RuleList';
import useInstance from '../../hooks/useInstance';

const Rule = () => {
  const { updateInstanceList, generateInstanceSelectOption } = useInstance();
  const { t } = useTranslation();

  const { data: allRules } = useRequest(
    ruleTemplate.getRuleListV1.bind(ruleTemplate),
    {
      formatResult(res) {
        return res.data?.data ?? [];
      },
    }
  );

  React.useEffect(() => {
    updateInstanceList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PageHeader title={t('rule.pageTitle')} ghost={false}>
        {t('rule.pageDesc')}
      </PageHeader>
      <section className="padding-content">
        <Space size={24} direction="vertical" className="full-width-element">
          <Card>
            <Row align="middle">
              <Col span={3}>{t('rule.form.instance')}</Col>
              <Col span={5}>
                <Select
                  placeholder={t('common.form.placeholder.select')}
                  className="full-width-element"
                  allowClear
                >
                  {generateInstanceSelectOption()}
                </Select>
              </Col>
            </Row>
          </Card>
          <Card title={t('rule.allRules')}>
            <RuleList list={allRules ?? []} />
          </Card>
        </Space>
      </section>
    </>
  );
};

export default Rule;
