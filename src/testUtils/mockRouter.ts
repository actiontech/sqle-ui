import * as reactRouter from 'react-router';

export const mockUseHistory = () => {
  const spy = jest.spyOn(reactRouter, 'useHistory');
  return spy;
};
