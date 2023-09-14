import { Card, Divider, Space, Table } from 'antd';
import SQLStatistics from './SQLStatistics';

import './index.less';
import FilterForm from './FilterForm';
import { SQLPanelFilterFormFields } from './index.type';
import useTable from '../../../hooks/useTable';
import { SQLPanelColumns } from './column';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';

const SQLPanel: React.FC = () => {
  const {
    pagination,
    filterForm,
    filterInfo,
    resetFilter,
    submitFilter,
    tableChange,
  } = useTable<SQLPanelFilterFormFields>();
  const { projectName } = useCurrentProjectName();

  return (
    <section className="padding-content">
      <Card>
        <Space direction="vertical" size={16} className="full-width-element">
          <SQLStatistics />

          <FilterForm
            form={filterForm}
            reset={resetFilter}
            submit={submitFilter}
            projectName={projectName}
          />
        </Space>

        <Divider style={{ margin: '16px 0' }} />

        <Table
          columns={SQLPanelColumns()}
          pagination={{
            showSizeChanger: true,
          }}
        />
      </Card>
    </section>
  );
};

export default SQLPanel;
