import { HistoryOutlined } from '@ant-design/icons';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import useNavigate from '../../../../hooks/useNavigate';
import EmptyBox from '../../../EmptyBox';

const OperationRecordNavigation: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useCurrentUser();

  return (
    <EmptyBox if={isAdmin}>
      <HistoryOutlined
        onClick={() => {
          navigate('operationRecord');
        }}
        className="header-operation-record-icon"
      />
    </EmptyBox>
  );
};

export default OperationRecordNavigation;
