import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ModalName } from '../../../../data/ModalName';
import { initNavModalStatus } from '../../../../store/nav';
import VersionModal from './VersionModal';

/* IFTRUE_isEE */
import CompanyNoticeModal from './CompanyNoticeModal';
/* FITRUE_isEE */

const InfoModalManager = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      initNavModalStatus({
        modalStatus: {
          [ModalName.SHOW_VERSION]: false,

          /* IFTRUE_isEE */
          [ModalName.Company_Notice]: false,
          /* FITRUE_isEE */
        },
      })
    );
  }, [dispatch]);

  return (
    <>
      <VersionModal />

      {/* IFTRUE_isEE */}
      <CompanyNoticeModal />
      {/* FITRUE_isEE */}
    </>
  );
};

export default InfoModalManager;
