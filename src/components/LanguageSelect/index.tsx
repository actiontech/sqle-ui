import { Select } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { languageData } from '../../hooks/useLanguage';
import { SupportLanguage } from '../../locale';
import { IReduxState } from '../../store';
import { updateLanguage } from '../../store/locale';
import Icon from '@ant-design/icons';

const LanguageSelect: React.FC<{}> = () => {
  const language = useSelector<IReduxState, string>(
    (state) => state.locale.language
  );
  const dispatch = useDispatch();

  const changeLanguage = React.useCallback(
    (value: string) => {
      dispatch(updateLanguage({ language: value as SupportLanguage }));
    },
    [dispatch]
  );
  return (
    <Select
      value={language}
      onChange={changeLanguage}
      dropdownMatchSelectWidth={false}
      popupClassName="login-page-language"
      size="small"
      className="font-size-small"
    >
      {Object.keys(languageData).map((key) => {
        const lng = languageData[key as SupportLanguage];
        return (
          <Select.Option key={key} value={key} className="font-size-small">
            <Icon component={lng.icon} />
            &nbsp;
            {lng.label}
          </Select.Option>
        );
      })}
    </Select>
  );
};

export default LanguageSelect;
