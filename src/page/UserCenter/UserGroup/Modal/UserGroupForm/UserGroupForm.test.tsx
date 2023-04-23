import { render } from '@testing-library/react';
import UserGroupForm from '.';

describe('UserGroupForm', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <UserGroupForm
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
