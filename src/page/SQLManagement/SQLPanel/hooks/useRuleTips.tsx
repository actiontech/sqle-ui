import { useBoolean } from 'ahooks';
import { Select, Typography } from 'antd';
import React from 'react';
import SqlManage from '../../../../api/SqlManage';
import { IRuleTips } from '../../../../api/common';
import { ResponseCode } from '../../../../data/common';
import DatabaseTypeLogo from '../../../../components/DatabaseTypeLogo';

export const DB_TYPE_RULE_NAME_SEPARATOR = '_DB_TYPE_RULE_NAME_SEPARATOR_';

const useRuleTips = () => {
  const [ruleTips, setRuleTips] = React.useState<IRuleTips[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateRuleTips = React.useCallback(
    (projectName: string) => {
      setTrue();
      SqlManage.GetSqlManageRuleTips({
        project_name: projectName,
      })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            setRuleTips(res.data?.data ?? []);
          } else {
            setRuleTips([]);
          }
        })
        .catch(() => {
          setRuleTips([]);
        })
        .finally(() => {
          setFalse();
        });
    },
    [setFalse, setTrue]
  );

  const generateRuleTipsSelectOptions = React.useCallback(() => {
    return ruleTips.map((v) => {
      return (
        <Select.OptGroup
          label={<DatabaseTypeLogo dbType={v.db_type ?? ''} />}
          key={v.db_type}
        >
          {v.rule?.map((rule) => {
            return (
              <Select.Option
                value={`${v.db_type}${DB_TYPE_RULE_NAME_SEPARATOR}${rule.rule_name}`}
                label={rule.desc}
                key={rule.rule_name}
              >
                <Typography.Paragraph
                  className="clear-margin-bottom"
                  ellipsis={{
                    tooltip: {
                      overlay: rule.desc,
                    },
                    rows: 1,
                  }}
                >
                  {rule.desc}
                </Typography.Paragraph>
              </Select.Option>
            );
          })}
        </Select.OptGroup>
      );
    });
  }, [ruleTips]);

  return {
    ruleTips,
    loading,
    updateRuleTips,
    generateRuleTipsSelectOptions,
  };
};

export default useRuleTips;
