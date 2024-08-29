import { createWithRemoteLoader } from '@kne/remote-loader';
import Fetch from '@kne/react-fetch';
import { useSearchParams } from 'react-router-dom';
import { ListOptions } from '@components/Content';

const Client = createWithRemoteLoader({
  modules: [
    'components-core:Layout@TablePage',
    'components-core:Layout@Menu',
    'components-core:Global@usePreset',
    'components-core:Filter@getFilterValue'
  ]
})(({ remoteModules, baseUrl = '', apis: apisProps, plugins, groupCode, ...props }) => {
  const [TablePage, Menu, usePreset, getFilterValue] = remoteModules;
  const { apis: presetApis } = usePreset();
  const [searchParams] = useSearchParams();
  const currentObject = searchParams.get('object');
  const apis = Object.assign({}, presetApis?.cms, apisProps);
  return (
    <Fetch
      {...Object.assign({}, apis.object.getList, {
        params: { groupCode }
      })}
      render={({ data }) => {
        const defaultObject = data[0];
        const objectCode = currentObject || defaultObject.code;
        return (
          <ListOptions apis={apis} groupCode={groupCode} objectCode={objectCode} plugins={plugins}>
            {({ ref, filter, columns, topOptions, optionsColumn }) => {
              return (
                <TablePage
                  {...Object.assign({}, apis.content.getList, {
                    params: Object.assign({}, { objectCode, groupCode }, { filter: getFilterValue(filter.value) })
                  })}
                  columns={[...columns, optionsColumn]}
                  ref={ref}
                  name={`cms-client-${groupCode}-${objectCode}`}
                  page={Object.assign(
                    {},
                    props,
                    {
                      menu: (
                        <Menu
                          items={data.map(({ name, code }) => {
                            return {
                              label: name,
                              key: code,
                              path: `${baseUrl}?object=${code}`
                            };
                          })}
                          pathMatch={(link, { search }) => {
                            const target = new URLSearchParams(link);
                            const current = new URLSearchParams(search);
                            return !current.get('object') || target.get('object') === current.get('object');
                          }}
                        />
                      ),
                      titleExtra: topOptions
                    },
                    filter.list && filter.list.length > 0 ? { filter } : {}
                  )}
                />
              );
            }}
          </ListOptions>
        );
      }}
    />
  );
});

export default Client;
