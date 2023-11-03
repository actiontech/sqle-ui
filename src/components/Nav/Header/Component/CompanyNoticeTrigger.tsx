import { useDispatch } from 'react-redux';
import { NotificationOutlined } from '@ant-design/icons';
import { updateNavModalStatus } from '../../../../store/nav';
import { ModalName } from '../../../../data/ModalName';
import { useRequest } from 'ahooks';
import companyNotice from '../../../../api/companyNotice';
import StorageKey from '../../../../data/StorageKey';
import {
  ResponseCode,
  CompanyNoticeDisplayStatusEnum,
} from '../../../../data/common';
import LocalStorageWrapper from '../../../../utils/LocalStorageWrapper';

const CompanyNoticeTrigger: React.FC = () => {
  const dispatch = useDispatch();

  useRequest(
    () =>
      companyNotice.getCompanyNotice().then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          if (res.data.data?.notice_str) {
            dispatch(
              updateNavModalStatus({
                modalName: ModalName.Company_Notice,
                status: true,
              })
            );
          }
        }
      }),
    {
      ready:
        LocalStorageWrapper.get(StorageKey.SHOW_COMPANY_NOTICE) ===
        CompanyNoticeDisplayStatusEnum.NotDisplayed,
    }
  );

  return (
    <NotificationOutlined
      className="header-notification-icon"
      onClick={() => {
        dispatch(
          updateNavModalStatus({
            modalName: ModalName.Company_Notice,
            status: true,
          })
        );
      }}
    />
  );
};

export default CompanyNoticeTrigger;
