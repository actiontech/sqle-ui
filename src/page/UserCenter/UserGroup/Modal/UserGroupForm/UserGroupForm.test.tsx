import { render } from '@testing-library/react';
import UserGroupForm from '.';

describe('UserGroupForm', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <UserGroupForm
        roleList={[
          {
            role_name: 'role_name1',
          },
        ]}
        userList={[
          {
            user_name: 'user_name1',
          },
        ]}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
