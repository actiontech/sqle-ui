import { useCallback, useState } from 'react';
import { useBoolean } from 'ahooks';
import { ResponseCode } from '../../data/common';
import { Select, Tag } from 'antd';
import sql_audit_record from '../../api/sql_audit_record';

const useSQLAuditRecordTag = () => {
  const [auditRecordTags, setSQLAuditRecordTags] = useState<string[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateSQLAuditRecordTag = useCallback(
    (projectName: string) => {
      setTrue();
      sql_audit_record
        .GetSQLAuditRecordTagTipsV1({ project_name: projectName })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            setSQLAuditRecordTags(res.data?.data ?? []);
          } else {
            setSQLAuditRecordTags([]);
          }
        })
        .catch(() => {
          setSQLAuditRecordTags([]);
        })
        .finally(() => {
          setFalse();
        });
    },
    [setFalse, setTrue]
  );

  const generateSQLAuditRecordSelectOptions = useCallback(() => {
    return auditRecordTags.map((v) => {
      return (
        <Select.Option key={v} value={v ?? ''}>
          <Tag color="blue">{v}</Tag>
        </Select.Option>
      );
    });
  }, [auditRecordTags]);

  return {
    auditRecordTags,
    loading,
    updateSQLAuditRecordTag,
    generateSQLAuditRecordSelectOptions,
  };
};

export default useSQLAuditRecordTag;
