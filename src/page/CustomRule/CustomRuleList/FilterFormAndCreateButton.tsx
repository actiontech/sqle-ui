import { Button, Col, Form, Input, Row, Select } from 'antd';
import {
  FilterFormColLayout,
  FilterFormRowLayout,
  filterFormButtonLayoutFactory,
} from '../../../data/common';
import useDatabaseType from '../../../hooks/useDatabaseType';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '../../../components/Link';
import { FilterFormAndCreateButtonProps } from '.';

const FilterFormAndCreateButton: React.FC<FilterFormAndCreateButtonProps> = ({
  getCustomRuleList,
}) => {
  const { t } = useTranslation();
  const { updateDriverNameList, generateDriverSelectOptions } =
    useDatabaseType();

  const [dbType, setDbType] = useState('');
  const [ruleName, setRuleName] = useState('');

  const changeDbType = (type: string) => {
    setDbType(type);
    getCustomRuleList(type, ruleName);
  };
  const ruleNameSearch = (name: string) => {
    setRuleName(name);
    getCustomRuleList(dbType, name);
  };

  useEffect(() => {
    updateDriverNameList();
  }, [updateDriverNameList]);
  return (
    <Form>
      <Row {...FilterFormRowLayout}>
        <Col {...FilterFormColLayout}>
          <Form.Item
            name="dbType"
            label={t('customRule.filterForm.databaseType')}
          >
            <Select allowClear value={dbType} onChange={changeDbType}>
              {generateDriverSelectOptions()}
            </Select>
          </Form.Item>
        </Col>

        <Col {...FilterFormColLayout}>
          <Form.Item
            name="ruleName"
            label={t('customRule.filterForm.ruleName')}
          >
            <Input.Search
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              onSearch={ruleNameSearch}
              placeholder={t('common.form.placeholder.searchInput', {
                name: t('customRule.filterForm.ruleName'),
              })}
            />
          </Form.Item>
        </Col>

        <Col
          {...filterFormButtonLayoutFactory(12, 0, 6)}
          className="text-align-right"
        >
          <Form.Item wrapperCol={{ span: 24 }}>
            <Button type="primary">
              <Link to="rule/custom/create">
                {t('customRule.filterForm.add')}
              </Link>
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default FilterFormAndCreateButton;
