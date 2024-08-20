import { createWithRemoteLoader } from '@kne/remote-loader';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import Fetch from '@kne/react-fetch';
import { Space, Button } from 'antd';
import Field from '@components/Field';
import Content from '@components/Content';

const componentMap = {
  object: Field,
  data: Content
};

const ObjectDetail = createWithRemoteLoader({
  modules: [
    'components-core:Layout@StateBarPage',
    'components-core:Global@usePreset',
    'components-view:PageHeader@PageHeaderInner',
    'components-core:Icon'
  ]
})(({ remoteModules, baseUrl = '', plugins }) => {
  const [StateBarPage, usePreset, PageHeader, Icon] = remoteModules;
  const [searchParams, setSearchParams] = useSearchParams();
  const objectCode = searchParams.get('object');
  const groupCode = searchParams.get('group');
  const navigate = useNavigate();
  const { apis, ajax } = usePreset();
  const activeKey = searchParams.get('tab') || 'object';
  if (!(objectCode && groupCode)) {
    return <Navigate to="/404" />;
  }

  const CurrentComponent = componentMap[activeKey] || componentMap['object'];
  return (
    <Fetch
      {...Object.assign({}, apis.cms.object.getDetailByCode, {
        params: {
          code: objectCode,
          groupCode: groupCode
        }
      })}
      render={({ data }) => {
        return (
          <StateBarPage
            stateBar={{
              activeKey,
              onChange: key => {
                searchParams.set('tab', key);
                setSearchParams(searchParams.toString());
              },
              stateOption: [
                { tab: '对象', key: 'object' },
                { tab: '数据', key: 'data' } /*, { tab: '视图', key: 'view' }*/
              ]
            }}
            header={
              <PageHeader
                title={
                  <Space size="large">
                    <Button
                      onClick={() => {
                        navigate(`${baseUrl}/object?group=${data.group.code}`);
                      }}
                      icon={<Icon type="arrow-bold-left" />}
                    />
                    <span>{data.name}</span>
                  </Space>
                }
                info={data.group.name}
              />
            }
          >
            <CurrentComponent baseUrl={baseUrl} objectCode={objectCode} groupCode={groupCode} plugins={plugins} />
          </StateBarPage>
        );
      }}
    />
  );
});

export default ObjectDetail;
