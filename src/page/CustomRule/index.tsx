import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const CustomRuleList = lazy(() => import('./CustomRuleList'));
const CreateCustomRule = lazy(() => import('./CreateCustomRule'));

const CustomRule: React.FC = () => {
  return (
    <Routes>
      <Route index element={<CustomRuleList />} />
      <Route path="add" element={<CreateCustomRule />} />
    </Routes>
  );
};

export default CustomRule;
