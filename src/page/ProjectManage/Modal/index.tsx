import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ModalName } from '../../../data/ModalName';
import { initProjectManageModalStatus } from '../../../store/projectManage';
import CreateProject from './CreateProject';
import UpdateProject from './UpdateProject';

const ProjectManageModal: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      initProjectManageModalStatus({
        modalStatus: {
          [ModalName.Create_Project]: false,
          [ModalName.Update_Project]: false,
        },
      })
    );
  }, [dispatch]);

  return (
    <>
      <CreateProject />
      <UpdateProject />
    </>
  );
};

export default ProjectManageModal;
