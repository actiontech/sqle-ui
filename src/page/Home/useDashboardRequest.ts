import { useRequest } from 'ahooks';
import { ALL_PROJECT_NAME } from '.';
import workflow from '../../api/workflow';
import {
  IGetGlobalWorkflowsV1Params,
  IGetWorkflowsV1Params,
} from '../../api/workflow/index.d';

const isGlobalParams = (value: unknown): value is IGetGlobalWorkflowsV1Params =>
  (value as any).project_name === ALL_PROJECT_NAME;

const useDashboardRequest = (
  params: IGetWorkflowsV1Params | IGetGlobalWorkflowsV1Params,
  refreshDeps: React.DependencyList
) => {
  const request = isGlobalParams(params)
    ? () => workflow.getGlobalWorkflowsV1(params)
    : () => workflow.getWorkflowsV1(params);
  const response = useRequest(request, {
    formatResult(res) {
      return res.data.data;
    },
    refreshDeps,
  });
  return response;
};

export default useDashboardRequest;
