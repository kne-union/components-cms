import { createWithRemoteLoader } from '@kne/remote-loader';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import Fetch from '@kne/react-fetch';
import { Space, Button } from 'antd';

const ModelDetail = createWithRemoteLoader({
  modules: [
    'components-core:Layout@StateBarPage',
    'components-core:Global@usePreset',
    'components-view:PageHeader@PageHeaderInner',
    'components-core:Icon'
  ]
})(({ remoteModules, baseUrl = '' }) => {
  const [StateBarPage, usePreset, PageHeader, Icon] = remoteModules;
  const [searchParams, setSearchParams] = useSearchParams();
  const modelCode = searchParams.get('model');
  const navigate = useNavigate();
  const { apis, ajax } = usePreset();
  const activeKey = searchParams.get('tab') || 'model';
  if (!modelCode) {
    return <Navigate to="/404" />;
  }
  return (
    <StateBarPage
      stateBar={{
        activeKey,
        onChange: key => {
          searchParams.set('tab', key);
          setSearchParams(searchParams.toString());
        },
        stateOption: [
          { tab: '对象', key: 'model' },
          { tab: '数据', key: 'data' },
          { tab: '视图', key: 'view' }
        ]
      }}
      header={
        <Fetch
          {...Object.assign({}, apis.cms.model.getDetailByCode, { params: { code: modelCode } })}
          render={({ data }) => {
            return (
              <PageHeader
                title={
                  <Space size="large">
                    <Button
                      onClick={() => {
                        navigate(`${baseUrl}/models?group=${data.objectGroup.code}`);
                      }}
                      icon={<Icon type="arrow-bold-left" />}
                    />
                    <span>{data.name}</span>
                  </Space>
                }
                info={data.objectGroup.name}
              />
            );
          }}
        />
      }
    />
  );
});

export default ModelDetail;
