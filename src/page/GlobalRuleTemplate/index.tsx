import { Route, Routes } from 'react-router-dom';
import { lazy } from 'react';

const GlobalRuleTemplateList = lazy(() => import('./RuleTemplateList'));
const GlobalImportRuleTemplate = lazy(() => import('./ImportRuleTemplate'));
const GlobalUpdateRuleTemplate = lazy(() => import('./UpdateRuleTemplate'));
const GlobalCreateRuleTemplate = lazy(() => import('./CreateRuleTemplate'));

const GlobalRuleTemplate = () => {
  return (
    <Routes>
      <Route index element={<GlobalRuleTemplateList />} />
      <Route path="create" element={<GlobalCreateRuleTemplate />} />
      <Route path="import" element={<GlobalImportRuleTemplate />} />
      <Route
        path="update/:templateName"
        element={<GlobalUpdateRuleTemplate />}
      />
    </Routes>
  );
};

export default GlobalRuleTemplate;
