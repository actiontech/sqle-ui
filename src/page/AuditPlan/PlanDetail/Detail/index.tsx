import { useTheme } from '@mui/styles';
import { Row, Col } from 'antd';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { IReduxState } from '../../../../store';
import { useCurrentProjectName } from '../../../ProjectManage/ProjectDetail';
import { PlanDetailUrlParams } from '../index.type';
import PlanAuditRecord from './Record';
import SqlPool from './SqlPool';

const PlanDetail = () => {
  const urlParams = useParams<PlanDetailUrlParams>();
  const theme = useTheme();
  const { projectName } = useCurrentProjectName();
  const projectIsArchive = useSelector(
    (state: IReduxState) => state.projectManage.archived
  );
  const location = useLocation();
  const hideReportList = useMemo(() => {
    return location.pathname.includes('/report');
  }, [location.pathname]);

  return (
    <>
      <Row hidden={hideReportList}>
        <Col xxl={16} sm={24} style={{ marginBottom: theme.common.padding }}>
          <SqlPool
            auditPlanName={urlParams.auditPlanName ?? ''}
            projectName={projectName}
            projectIsArchive={projectIsArchive}
          />
        </Col>
        <Col xxl={8} sm={24}>
          <PlanAuditRecord
            auditPlanName={urlParams.auditPlanName ?? ''}
            projectName={projectName}
          />
        </Col>
      </Row>
      <Outlet />
    </>
  );
};

export default PlanDetail;
