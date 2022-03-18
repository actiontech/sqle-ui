import { EditOutlined, EnterOutlined } from '@ant-design/icons';
import { useBoolean } from 'ahooks';
import { Col, Typography, Input } from 'antd';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyBox from '../../../components/EmptyBox';
import { UserEmailProps } from './index.type';
import useInputChange from './hooks/useInputChange';

const UserEmail: React.FC<UserEmailProps> = (props) => {
  const { t } = useTranslation();
  const inputRef = useRef<Input | null>(null);
  const [editEmail, { setTrue: startEditEmail, setFalse: closeEditEmail }] =
    useBoolean(false);

  const [inputValue, setInputValue] = React.useState(props.userInfo?.email);

  const { inputChange, cancelEdit } = useInputChange({
    ...props,
    closeEditEmail,
    setInputValue,
  });

  React.useEffect(() => {
    if (editEmail) {
      inputRef.current?.focus();
    }
  }, [editEmail]);

  return (
    <>
      <Col sm={3} xs={24}>
        <Typography.Title level={5}>
          {t('user.userForm.email')}
        </Typography.Title>
      </Col>
      <Col sm={10} xs={24}>
        <div hidden={editEmail}>
          <Typography.Text>
            <EmptyBox if={!!props.userInfo?.email} defaultNode="--">
              {props.userInfo?.email}
            </EmptyBox>
            <Typography.Link onClick={startEditEmail}>
              <EditOutlined />
            </Typography.Link>
          </Typography.Text>
        </div>
        <div hidden={!editEmail}>
          <Input
            id="emailInput"
            ref={(ref) => (inputRef.current = ref)}
            suffix={<EnterOutlined />}
            value={inputValue}
            onChange={inputChange}
            onBlur={cancelEdit}
            placeholder={t('common.form.placeholder.input', {
              name: t('user.userForm.email'),
            })}
          />
        </div>
      </Col>
    </>
  );
};

export default UserEmail;
