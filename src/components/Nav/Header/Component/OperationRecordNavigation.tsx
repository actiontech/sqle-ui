import { HistoryOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import EmptyBox from '../../../EmptyBox';

const OperationRecordNavigation: React.FC = () => {
  const history = useHistory();
  const { isAdmin } = useCurrentUser();

  return (
    <EmptyBox if={isAdmin}>
      <HistoryOutlined
        onClick={() => {
          history.push('/operationRecord');
        }}
        className="header-operation-record-icon"
      />
    </EmptyBox>
  );
};

export default OperationRecordNavigation;
