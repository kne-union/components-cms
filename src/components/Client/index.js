import { createWithRemoteLoader } from '@kne/remote-loader';
import Fetch from '@kne/react-fetch';
import { useSearchParams, Navigate } from 'react-router-dom';
import { PageOptions } from '@components/Content';

const Client = createWithRemoteLoader({
  modules: [
    'components-core:Layout@TablePage',
    'components-core:Layout@Page',
    'components-core:Layout@Menu',
    'components-core:Global@usePreset',
    'components-core:Filter@getFilterValue'
  ]
})(({ remoteModules, baseUrl = '', apis: apisProps, plugins, groupCode, ...props }) => {
  const [TablePage, Page, Menu, usePreset, getFilterValue] = remoteModules;
  const { apis: presetApis } = usePreset();
  const [searchParams] = useSearchParams();
  const objectCode = searchParams.get('object');
  const apis = Object.assign({}, presetApis?.cms, apisProps);
  return (
    <Fetch
      {...Object.assign({}, apis.object.getList, {
        params: { groupCode, filter: { type: 'outer' } }
      })}
      render={({ data }) => {
        if (!(objectCode && data.find(({ code }) => code === objectCode))) {
          return <Navigate to={`${baseUrl}?object=${data[0].code}`} />;
        }
        return (
          <PageOptions apis={apis} groupCode={groupCode} objectCode={objectCode} plugins={plugins}>
            {({ ref, isSingle, page }) => {
              const menu = (
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
              );
              if (isSingle) {
                const { topOptions, children } = page;
                return (
                  <Page {...props} name={`cms-client-${groupCode}-${objectCode}`} titleExtra={topOptions} menu={menu}>
                    {children}
                  </Page>
                );
              }
              const { filter, columns, topOptions, optionsColumn } = page;
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
                      menu,
                      titleExtra: topOptions
                    },
                    filter.list && filter.list.length > 0 ? { filter } : {}
                  )}
                />
              );
            }}
          </PageOptions>
        );
      }}
    />
  );
});

export default Client;
