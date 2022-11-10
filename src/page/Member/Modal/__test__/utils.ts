import user from '../../../../api/user';
import user_group from '../../../../api/user_group';
import { resolveThreeSecond } from '../../../../testUtils/mockRequest';

export const mockAddMember = () => {
  const spy = jest.spyOn(user, 'addMemberV1');
  spy.mockImplementation(() => resolveThreeSecond({}));
  return spy;
};

export const mockUpdateMember = () => {
  const spy = jest.spyOn(user, 'updateMemberV1');
  spy.mockImplementation(() => resolveThreeSecond({}));
  return spy;
};

export const mockAddMemberGroup = () => {
  const spy = jest.spyOn(user_group, 'addMemberGroupV1');
  spy.mockImplementation(() => resolveThreeSecond({}));
  return spy;
};

export const mockUpdateMemberGroup = () => {
  const spy = jest.spyOn(user_group, 'updateMemberGroupV1');
  spy.mockImplementation(() => resolveThreeSecond({}));
  return spy;
};
