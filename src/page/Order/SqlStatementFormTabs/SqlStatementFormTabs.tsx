import { Tabs } from 'antd';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { SqlStatementFormTabsProps, SqlStatementFormTabsRefType } from '.';
import SqlStatementForm from './SqlStatementForm';

const SqlStatementFormTabs: React.ForwardRefRenderFunction<
  SqlStatementFormTabsRefType,
  SqlStatementFormTabsProps
> = ({ sqlStatementInfo, tabsChangeHandle: onChange, ...props }, ref) => {
  const [activeKey, setActiveKey] = useState(sqlStatementInfo[0]?.key ?? '');

  const activeIndex = useMemo(() => {
    return sqlStatementInfo.findIndex((v) => v.key === activeKey);
  }, [activeKey, sqlStatementInfo]);

  const tabsChangeHandle = useCallback(
    (tab: string) => {
      onChange?.(tab);
      setActiveKey(tab);
    },
    [onChange]
  );

  useImperativeHandle(
    ref,
    () => ({ activeKey, activeIndex, tabsChangeHandle }),
    [activeIndex, activeKey, tabsChangeHandle]
  );

  useEffect(() => {
    setActiveKey(
      (v) => sqlStatementInfo[sqlStatementInfo.length - 1]?.key ?? v ?? ''
    );
  }, [sqlStatementInfo]);

  return (
    <>
      <Tabs activeKey={activeKey} onChange={tabsChangeHandle}>
        {sqlStatementInfo.map((v) => {
          return (
            <Tabs.TabPane key={v.key} tab={v.instanceName}>
              <SqlStatementForm
                fieldName={v.key}
                sqlStatement={v.sql}
                {...props}
              />
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    </>
  );
};

export default forwardRef(SqlStatementFormTabs);
