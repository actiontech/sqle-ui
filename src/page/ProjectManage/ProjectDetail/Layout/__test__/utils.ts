import project from '../../../../../api/project';
import { resolveThreeSecond } from '../../../../../testUtils/mockRequest';

export const mockGetProjectDetail = () => {
  const spy = jest.spyOn(project, 'getProjectDetailV1');
  spy.mockImplementation(() =>
    resolveThreeSecond({
      create_time: '2022-01-01',
      create_user_name: 'admin',
      desc: 'desc',
      name: 'project1',
    })
  );
  return spy;
};
