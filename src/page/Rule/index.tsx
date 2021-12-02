import useRequest from '@ahooksjs/use-request';
import { useTheme } from '@material-ui/styles';
import {
  Card,
  Col,
  Descriptions,
  Divider,
  PageHeader,
  Row,
  Select,
  Space,
  Form,
} from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import instance from '../../api/instance';
import ruleTemplate from '../../api/rule_template';
import EmptyBox from '../../components/EmptyBox';
import RuleList from '../../components/RuleList';
import useSyncRuleListTab from '../../components/RuleList/useSyncRuleListTab';
import {
  ResponseCode,
  FilterFormColLayout,
  FilterFormRowLayout,
  FilterFormLayout,
} from '../../data/common';
import useDatabaseType from '../../hooks/useDatabaseType';
import useInstance from '../../hooks/useInstance';
import { Theme } from '../../types/theme.type';

const Rule = () => {
  const { updateInstanceList, generateInstanceSelectOption } = useInstance();
  const { updateDriverNameList, driverNameList, generateDriverSelectOptions } =
    useDatabaseType();
  const { t } = useTranslation();
  const [instanceName, setInstanceName] = useState<string | undefined>(
    undefined
  );
  const [dbType, setDbType] = useState<string | undefined>(undefined);

  const theme = useTheme<Theme>();
  const { data: instanceRules, run: getInstanceRules } = useRequest(
    () =>
      instance.getInstanceRuleListV1({
        instance_name: instanceName ?? '',
      }),
    {
      manual: true,
      formatResult(res) {
        return res.data?.data ?? [];
      },
    }
  );

  const { data: allRules, loading: getRulesLoading } = useRequest(
    () =>
      ruleTemplate.getRuleListV1({
        filter_db_type: dbType,
      }),
    {
      ready: !!dbType,
      refreshDeps: [dbType],
      formatResult(res) {
        return res.data?.data ?? [];
      },
    }
  );

  const disableRules = React.useMemo(() => {
    if (!instanceRules) {
      return allRules ?? [];
    }
    const all = allRules ?? [];
    return all.filter(
      (e) => !instanceRules.find((item) => item.rule_name === e.rule_name)
    );
  }, [allRules, instanceRules]);

  React.useEffect(() => {
    if (instanceName !== undefined) {
      instance
        .getInstanceV1({ instance_name: instanceName ?? '' })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            setDbType(res.data.data?.db_type);
            getInstanceRules();
          }
        });
    }
  }, [getInstanceRules, instanceName]);

  React.useEffect(() => {
    updateInstanceList();
    updateDriverNameList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (driverNameList.length > 0 && !dbType) {
      setDbType(driverNameList[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driverNameList]);

  const { tabKey, allTypes, tabChange } = useSyncRuleListTab(allRules);

  return (
    <>
      <PageHeader title={t('rule.pageTitle')} ghost={false}>
        {t('rule.pageDesc')}
      </PageHeader>
      <section className="padding-content">
        <Space
          size={theme.common.padding}
          direction="vertical"
          className="full-width-element"
        >
          <Card>
            <Form {...FilterFormLayout}>
              <Row align="middle" {...FilterFormRowLayout}>
                <Col {...FilterFormColLayout}>
                  <Form.Item label={t('rule.form.instance')}>
                    <Select
                      data-testid="instance-name"
                      value={instanceName}
                      onChange={setInstanceName}
                      placeholder={t('common.form.placeholder.select')}
                      className="middle-select"
                      allowClear
                    >
                      {generateInstanceSelectOption()}
                    </Select>
                  </Form.Item>
                </Col>
                <Col {...FilterFormColLayout}>
                  <Form.Item label={t('rule.form.dbType')}>
                    <Select
                      data-testid="database-type"
                      value={dbType}
                      onChange={setDbType}
                      placeholder={t('common.form.placeholder.select')}
                      className="middle-select"
                      disabled={!!instanceName}
                    >
                      {generateDriverSelectOptions()}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <EmptyBox if={!instanceName}>
            <Card title={t('rule.allRules')}>
              <RuleList
                list={allRules ?? []}
                listProps={{ loading: getRulesLoading }}
              />
            </Card>
          </EmptyBox>
          <EmptyBox if={!!instanceName}>
            <Card title={t('rule.instanceRuleList')}>
              <Descriptions
                title={t('rule.activeRules', { name: instanceName })}
              />
              <RuleList
                list={instanceRules ?? []}
                allRuleTabs={allTypes}
                currentTab={tabKey}
                tabChange={tabChange}
                listProps={{ loading: getRulesLoading }}
              />
              <Divider dashed />
              <Descriptions
                title={t('rule.disableRules', { name: instanceName })}
              />
              <RuleList
                list={disableRules ?? []}
                allRuleTabs={allTypes}
                currentTab={tabKey}
                tabChange={tabChange}
                listProps={{ loading: getRulesLoading }}
              />
            </Card>
          </EmptyBox>
        </Space>
      </section>
    </>
  );
};

export default Rule;
