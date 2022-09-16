import { Tabs } from 'antd';
import { DifferenceSqlModeProps } from './index.type';
import SameSqlMode from './SameSqlMode';

const genKey = (name: string, index: number) => `${name}-${index}`;

const DifferenceSqlMode: React.FC<DifferenceSqlModeProps> = ({
  instanceNameList,
  submitLoading,
  submit,
}) => {
  return (
    <Tabs>
      {instanceNameList.map((v, index) => {
        if (!v) {
          return null;
        }
        return (
          <Tabs.TabPane tab={v} key={genKey(v, index)}>
            <SameSqlMode
              submit={submit}
              submitLoading={submitLoading}
              currentTabIndex={index}
            />
          </Tabs.TabPane>
        );
      })}
    </Tabs>
  );
};
export default DifferenceSqlMode;
