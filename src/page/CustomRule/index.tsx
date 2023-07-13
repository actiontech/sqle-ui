import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const CustomRuleList = lazy(() => import('./CustomRuleList'));
const UpdateCustomRule = lazy(() => import('./UpdateCustomRule'));
const CreateCustomRule = lazy(() => import('./CreateCustomRule'));

const CustomRule: React.FC = () => {
  return (
    <Routes>
      <Route path="custom" element={<CustomRuleList />} />
      <Route path="custom/create" element={<CreateCustomRule />} />
      <Route path="custom/update/:ruleID" element={<UpdateCustomRule />} />
    </Routes>
  );
};

export default CustomRule;
