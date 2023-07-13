import { useRequest } from 'ahooks';
import FilterFormAndCreateButton from './FilterFormAndCreateButton';
import ruleTemplate from '../../../api/rule_template';
import RuleList from '../../../components/RuleList';
import { Button, Popconfirm, message } from 'antd';
import { useTranslation } from 'react-i18next';
import useSyncRuleListTab from '../../../components/RuleList/useSyncRuleListTab';
import { ICustomRuleResV1 } from '../../../api/common';
import { ResponseCode } from '../../../data/common';
import { RuleResV1LevelEnum } from '../../../api/common.enum';
import { useState } from 'react';
import { Link } from '../../../components/Link';

const CustomRuleList: React.FC = () => {
  const { t } = useTranslation();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const {
    data: ruleList,
    run: getCustomRuleList,
    loading,
    refresh,
  } = useRequest((dbType: string, desc: string) =>
    ruleTemplate
      .getCustomRulesV1({
        filter_db_type: dbType,
        filter_desc: desc,
      })
      .then(
        (res) =>
          res.data.data?.map((v) => ({
            ...v,
            level: v.level as RuleResV1LevelEnum | undefined,
          })) ?? []
      )
  );

  const { tabKey, allTypes, tabChange } = useSyncRuleListTab(ruleList);

  const deleteRule = (item: ICustomRuleResV1) => {
    setDeleteLoading(true);
    ruleTemplate
      .deleteCustomRuleV1({
        rule_id: item.rule_id ?? '',
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(
            t('customRule.deleteSuccessTips', { desc: item.desc })
          );
          refresh();
        }
      })
      .finally(() => {
        setDeleteLoading(false);
      });
  };

  return (
    <>
      <FilterFormAndCreateButton getCustomRuleList={getCustomRuleList} />

      <RuleList
        list={ruleList ?? []}
        listProps={{ loading }}
        allRuleTabs={allTypes}
        tabChange={tabChange}
        currentTab={tabKey}
        actions={(item) => {
          return [
            <Button
              disabled={deleteLoading}
              key={`${item.rule_name}-edit-item`}
              type="link"
            >
              <Link
                to={`rule/custom/update/${(item as ICustomRuleResV1).rule_id}`}
              >
                {t('customRule.editRule')}
              </Link>
            </Button>,

            <Popconfirm
              disabled={deleteLoading}
              placement="topLeft"
              title={t('customRule.deleteConfirm')}
              onConfirm={deleteRule.bind(null, item as ICustomRuleResV1)}
              okText={t('common.ok')}
            >
              <Button
                disabled={deleteLoading}
                key={`${item.rule_name}-disable-item`}
                type="link"
                danger
              >
                {t('customRule.deleteRule')}
              </Button>
            </Popconfirm>,
          ];
        }}
      />
    </>
  );
};

export default CustomRuleList;
