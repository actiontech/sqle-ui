import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ModalName } from '../../../../data/ModalName';
import { initNavModalStatus } from '../../../../store/nav';
import VersionModal from './VersionModal';

const InfoModalManager = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      initNavModalStatus({
        modalStatus: {
          [ModalName.SHOW_VERSION]: false,
        },
      })
    );
  }, [dispatch]);

  return (
    <>
      <VersionModal />
    </>
  );
};

export default InfoModalManager;
