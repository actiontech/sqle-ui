import { Button, Divider, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { ModalSize } from '../../../../../data/common';
import OrderSteps from '../../OrderSteps';
import { OrderHistoryProps } from './index.type';

const OrderHistory: React.FC<OrderHistoryProps> = (props) => {
  const { t } = useTranslation();

  return (
    <Modal
      visible={props.visible}
      width={ModalSize.mid}
      title={t('order.history.title')}
      footer={
        <Button type="primary" onClick={props.close}>
          确定
        </Button>
      }
      onCancel={props.close}
    >
      {props.history.map((step, index) => {
        return (
          <>
            <OrderSteps
              stepList={step.workflow_step_list ?? []}
              currentStep={step.current_step_number}
              currentOrderStatus={step.status}
              pass={() => Promise.resolve()}
              reject={() => Promise.resolve()}
              modifySql={() => void 0}
              readonly={true}
            />
            {index < props.history.length - 1 && (
              <Divider className="clear-margin-top" />
            )}
          </>
        );
      })}
    </Modal>
  );
};

export default OrderHistory;
