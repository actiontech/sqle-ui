import { render } from '@testing-library/react';
import ProjectInfoBox from '../ProjectInfoBox';

describe('test ProjectInfoBox', () => {
  test('should match snapshot', async () => {
    const { container, rerender } = render(<ProjectInfoBox />);
    expect(container).toMatchSnapshot();

    rerender(
      <ProjectInfoBox
        projectInfo={{
          create_time: '2022-11-21',
          create_user_name: 'admin',
          desc: 'test desc',
          name: 'default',
        }}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
