import { Route, Routes } from 'react-router-dom';
import { lazy } from 'react';

const GlobalRuleTemplateList = lazy(() => import('./RuleTemplateList'));
const GlobalImportRuleTemplate = lazy(() => import('./ImportRuleTemplate'));
const GlobalUpdateRuleTemplate = lazy(() => import('./UpdateRuleTemplate'));
const GlobalCreateRuleTemplate = lazy(() => import('./CreateRuleTemplate'));

const GlobalRuleTemplate = () => {
  return (
    <Routes>
      <Route path="template" element={<GlobalRuleTemplateList />} />
      <Route path="template/create" element={<GlobalCreateRuleTemplate />} />
      <Route path="template/import" element={<GlobalImportRuleTemplate />} />
      <Route
        path="template/update/:templateName"
        element={<GlobalUpdateRuleTemplate />}
      />
    </Routes>
  );
};

export default GlobalRuleTemplate;
