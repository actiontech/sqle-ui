import { IGetProjectStatisticsResDataV1 } from '../../../api/common';
import project from '../../../api/project';
import statistic from '../../../api/statistic';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';

export const mockGetProjectList = () => {
  const spy = jest.spyOn(project, 'getProjectListV1');
  spy.mockImplementation(() =>
    resolveThreeSecond(
      Array.from({ length: 11 }, (_, i) => ({
        name: `project${i + 1}`,
        desc: 'desc1',
        create_time: '2022-11-01',
        create_user_name: 'admin',
        archived: i < 1,
      })),
      { otherData: { total_nums: 11 } }
    )
  );
  return spy;
};

export const mockDeleteProject = () => {
  const spy = jest.spyOn(project, 'deleteProjectV1');
  spy.mockImplementation(() => resolveThreeSecond({}));
  return spy;
};

export const mockCreateProject = () => {
  const spy = jest.spyOn(project, 'createProjectV1');
  spy.mockImplementation(() => resolveThreeSecond({}));
  return spy;
};

export const mockUpdateProject = () => {
  const spy = jest.spyOn(project, 'updateProjectV1');
  spy.mockImplementation(() => resolveThreeSecond({}));
  return spy;
};

export const mockGetProjectDetail = () => {
  const spy = jest.spyOn(project, 'getProjectDetailV1');
  spy.mockImplementation(() =>
    resolveThreeSecond({
      create_time: '2022-01-01',
      create_user_name: 'admin',
      desc: 'desc',
      name: 'project1',
      archived: false,
    })
  );
  return spy;
};

export const projectStatisticsData: IGetProjectStatisticsResDataV1 = {
  workflow_total: 12,
  audit_plan_total: 10,
  instance_total: 3,
  member_total: 22,
  rule_template_total: 12,
  whitelist_total: 3,
};

export const mockGetProjectStatistics = () => {
  const spy = jest.spyOn(statistic, 'getProjectStatisticsV1');
  spy.mockImplementation(() => resolveThreeSecond(projectStatisticsData));
  return spy;
};

export const mockArchiveProject = () => {
  const spy = jest.spyOn(project, 'archiveProjectV1');
  spy.mockImplementation(() => resolveThreeSecond({}));
  return spy;
};

export const mockUnarchiveProject = () => {
  const spy = jest.spyOn(project, 'unarchiveProjectV1');
  spy.mockImplementation(() => resolveThreeSecond({}));
  return spy;
};
