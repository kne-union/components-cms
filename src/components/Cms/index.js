import { Routes, Route } from 'react-router-dom';
import Group from '@components/Group';
import Object from '@components/Object';
import ObjectDetail from '@components/ObjectDetail';

const Cms = ({ baseUrl = '/cms', plugins }) => {
  return (
    <Routes>
      <Route index element={<Group baseUrl={baseUrl} plugins={plugins} />} />
      <Route path="object" element={<Object baseUrl={baseUrl} plugins={plugins} />} />
      <Route path="object-detail" element={<ObjectDetail baseUrl={baseUrl} plugins={plugins} />} />
    </Routes>
  );
};

export default Cms;
