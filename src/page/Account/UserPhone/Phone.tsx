import { EditOutlined, EnterOutlined } from '@ant-design/icons';
import { useBoolean, useKeyPress } from 'ahooks';
import { Col, Typography, Input, Row, message, InputRef } from 'antd';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyBox from '../../../components/EmptyBox';
import { UserPhoneProps } from '.';
import user from '../../../api/user';
import { ResponseCode } from '../../../data/common';

const UserPhone: React.FC<UserPhoneProps> = (props) => {
  const { t } = useTranslation();
  const inputRef = useRef<InputRef | null>(null);
  const [editPhone, { setTrue: startEditPhone, setFalse: closeEditPhone }] =
    useBoolean(false);

  const [inputValue, setInputValue] = React.useState(props.userInfo?.phone);

  const updatePhone = async (event: KeyboardEvent) => {
    const phone = (event.target as HTMLInputElement).value;
    if (phone !== '') {
      const reg = /^1\d{10}$/;
      if (!reg.test(phone)) {
        message.error(t('account.phoneErrorMessage.type'));
        return;
      }

      if (phone === props.userInfo?.phone) {
        message.error(t('account.phoneErrorMessage.match'));
        return;
      }
    }

    const res = await user.updateCurrentUserV1({
      phone,
    });
    if (res.data.code === ResponseCode.SUCCESS) {
      message.success(t('account.updatePhoneSuccess'));
      props.refreshUserInfo();
    }
    closeEditPhone();
  };

  const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  useKeyPress('esc', closeEditPhone, {
    target: () => document.getElementById('phoneInput'),
  });

  useKeyPress('enter', updatePhone, {
    target: () => document.getElementById('phoneInput'),
  });
  React.useEffect(() => {
    if (editPhone) {
      inputRef.current?.focus();
    }
  }, [editPhone]);

  return (
    <Row>
      <Col sm={3} xs={24}>
        <Typography.Title level={5}>
          {t('user.userForm.phone')}
        </Typography.Title>
      </Col>
      <Col sm={10} xs={24}>
        <div hidden={editPhone}>
          <Typography.Text>
            <EmptyBox if={!!props.userInfo?.phone} defaultNode="--">
              {props.userInfo?.phone}
            </EmptyBox>
            <Typography.Link>
              <EditOutlined onClick={startEditPhone} />
            </Typography.Link>
          </Typography.Text>
        </div>
        <div hidden={!editPhone}>
          <Input
            id="phoneInput"
            ref={(ref) => (inputRef.current = ref)}
            suffix={<EnterOutlined />}
            value={inputValue}
            onChange={inputChange}
            onBlur={closeEditPhone}
            placeholder={t('common.form.placeholder.input')}
          />
        </div>
      </Col>
    </Row>
  );
};

export default UserPhone;
