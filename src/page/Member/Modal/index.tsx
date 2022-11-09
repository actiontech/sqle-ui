import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ModalName } from '../../../data/ModalName';
import { initMemberModalStatus } from '../../../store/member';
import AddMember from './AddMember';
import UpdateMember from './UpdateMember';

const MemberModal: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      initMemberModalStatus({
        modalStatus: {
          [ModalName.Add_Member]: false,
          [ModalName.Update_Member]: false,
          [ModalName.Add_Member_Group]: false,
          [ModalName.Update_Member_Group]: false,
        },
      })
    );
  }, [dispatch]);

  return (
    <>
      <AddMember />
      <UpdateMember />
    </>
  );
};

export default MemberModal;
