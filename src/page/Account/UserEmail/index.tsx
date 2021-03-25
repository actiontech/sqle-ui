import { EditOutlined, EnterOutlined } from '@ant-design/icons';
import { useBoolean } from 'ahooks';
import { Col, Typography, Input, message } from 'antd';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import user from '../../../api/user';
import EmptyBox from '../../../components/EmptyBox';
import { ResponseCode } from '../../../data/common';
import { emailValidate } from '../../../utils/Common';
import { UserEmailProps } from './index.type';

const UserEmail: React.FC<UserEmailProps> = (props) => {
  const { t } = useTranslation();
  const inputRef = useRef<Input | null>(null);
  const [
    editEmail,
    { setTrue: startEditEmail, setFalse: closeEditEmail },
  ] = useBoolean(false);
  const [inputValue, setInputValue] = React.useState(props.userInfo?.email);

  const updateEmail = React.useCallback(
    async (email) => {
      if (email !== '') {
        if (!emailValidate(email)) {
          message.error(t('account.emailErrorMessage.type'));
          return;
        }
        if (email === props.userInfo?.email) {
          message.error(t('account.emailErrorMessage.match'));
          return;
        }
      }
      const res = await user.updateUserV1({
        user_name: props.userInfo?.user_name ?? '',
        email,
      });
      if (res.data.code === ResponseCode.SUCCESS) {
        message.success(t('account.updateEmailSuccess'));
        props.refreshUserInfo();
      }
      closeEditEmail();
    },
    [closeEditEmail, props, t]
  );

  const cancelEdit = React.useCallback(() => {
    closeEditEmail();
  }, [closeEditEmail]);

  const inputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    },
    []
  );

  React.useEffect(() => {
    const closeEdit = (event: KeyboardEvent) => {};
    window.document.addEventListener('keydown', closeEdit);
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
            ref={(ref) => (inputRef.current = ref)}
            suffix={<EnterOutlined />}
            value={inputValue}
            onChange={inputChange}
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
