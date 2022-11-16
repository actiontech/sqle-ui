import { useTheme } from '@material-ui/styles';
import { Row, Col } from 'antd';
import { useMemo } from 'react';
import { Route, useHistory, useParams } from 'react-router-dom';
import { Theme } from '../../../../types/theme.type';
import { useCurrentProjectName } from '../../../ProjectManage/ProjectDetail';
import { PlanDetailUrlParams } from '../index.type';
import PlanAuditRecord from './Record';
import AuditPlanReport from './Report';
import SqlPool from './SqlPool';

const PlanDetail = () => {
  const urlParams = useParams<PlanDetailUrlParams>();
  const theme = useTheme<Theme>();
  const history = useHistory();
  const { projectName } = useCurrentProjectName();
  const hideReportList = useMemo(() => {
    return history.location.pathname.includes('/report');
  }, [history.location.pathname]);

  return (
    <>
      <Row gutter={theme.common.padding} hidden={hideReportList}>
        <Col xxl={16} sm={24} style={{ marginBottom: theme.common.padding }}>
          <SqlPool
            auditPlanName={urlParams.auditPlanName}
            projectName={projectName}
          />
        </Col>
        <Col xxl={8} sm={24}>
          <PlanAuditRecord
            auditPlanName={urlParams.auditPlanName}
            projectName={projectName}
          />
        </Col>
      </Row>
      <Route
        path="/project/:projectName/auditPlan/detail/:auditPlanName/report/:reportId"
        component={AuditPlanReport}
      />
    </>
  );
};

export default PlanDetail;
