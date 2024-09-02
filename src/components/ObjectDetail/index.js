import { createWithRemoteLoader } from '@kne/remote-loader';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import Fetch from '@kne/react-fetch';
import { Button, Flex } from 'antd';
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
    'components-view:PageHeader',
    'components-core:Icon',
    'components-core:StateTag'
  ]
})(({ remoteModules, baseUrl = '', plugins }) => {
  const [StateBarPage, usePreset, PageHeader, Icon, StateTag] = remoteModules;
  const [searchParams, setSearchParams] = useSearchParams();
  const objectCode = searchParams.get('object');
  const groupCode = searchParams.get('group');
  const navigate = useNavigate();
  const { apis } = usePreset();
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
        const { code, status, isSingle, tag, type } = data;
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
                {
                  tab: '数据',
                  key: 'data'
                }
              ]
            }}
            header={
              <PageHeader
                addonBefore={
                  <Button
                    onClick={() => {
                      navigate(`${baseUrl}/object?group=${data.group.code}`);
                    }}
                    icon={<Icon type="arrow-bold-left" />}
                  />
                }
                title={data.name}
                info={`${code} (${data.group.name})`}
                tags={[
                  <StateTag
                    {...(() => {
                      if (status === 0) {
                        return { type: 'success', text: '正常' };
                      }
                      if (status === 10) {
                        return { type: 'danger', text: '已关闭' };
                      }
                      return { text: '其他' };
                    })()}
                  />,
                  <StateTag
                    {...(() => {
                      if (isSingle) {
                        return { type: 'success', text: '单例' };
                      }
                      return { type: 'info', text: '列表' };
                    })()}
                  />,
                  <StateTag
                    {...(() => {
                      if (type === 'inner') {
                        return { type: 'info', text: '内部' };
                      }
                      return { type: 'success', text: '外部' };
                    })()}
                  />,
                  ...(tag ? [<StateTag text={tag} />] : [])
                ]}
              />
            }
          >
            <CurrentComponent baseUrl={baseUrl} objectCode={objectCode} groupCode={groupCode} plugins={plugins} apis={apis.cms} />
          </StateBarPage>
        );
      }}
    />
  );
});

export default ObjectDetail;
