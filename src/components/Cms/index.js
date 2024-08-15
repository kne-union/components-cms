import { Routes, Route } from 'react-router-dom';
import Group from '@components/Group';
import Model from '@components/Model';
import ModelDetail from '@components/ModelDetail';

const Cms = ({ baseUrl = '/cms' }) => {
  return (
    <Routes>
      <Route index element={<Group baseUrl={baseUrl} />} />
      <Route path="models" element={<Model baseUrl={baseUrl} />} />
      <Route path="model-detail" element={<ModelDetail baseUrl={baseUrl} />} />
    </Routes>
  );
};

export default Cms;
