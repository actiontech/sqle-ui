import { useBoolean } from 'ahooks';
import { Button } from 'antd';
import { IQuickLinkProps } from './index.type';

import './index.less';

const QuickLink: React.FC<IQuickLinkProps> = ({ handleClick, text, icon }) => {
  const [isHover, { setFalse: leaveBtn, setTrue: enterBtn }] =
    useBoolean(false);

  return (
    <Button
      className="fixed-widgets-dashboard-namespace"
      onClick={handleClick}
      type="primary"
      shape={isHover ? 'round' : 'circle'}
      onMouseEnter={() => {
        enterBtn();
      }}
      onMouseLeave={() => {
        leaveBtn();
      }}
    >
      {isHover ? (
        <>
          {icon} {text}
        </>
      ) : (
        icon
      )}
    </Button>
  );
};

export default QuickLink;
