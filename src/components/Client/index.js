import { createWithRemoteLoader } from '@kne/remote-loader';
import Fetch from '@kne/react-fetch';
import { useSearchParams } from 'react-router-dom';
import { ListOptions } from '@components/Content';

const Client = createWithRemoteLoader({
  modules: ['components-core:Layout@TablePage', 'components-core:Layout@Menu', 'components-core:Global@usePreset']
})(({ remoteModules, baseUrl = '', plugins, groupCode, ...props }) => {
  const [TablePage, Menu, usePreset] = remoteModules;
  const { apis } = usePreset();
  const [searchParams] = useSearchParams();
  const currentObject = searchParams.get('object');
  return (
    <Fetch
      {...Object.assign({}, apis.cms.object.getList, {
        params: { groupCode }
      })}
      render={({ data }) => {
        const defaultObject = data[0];
        const objectCode = currentObject || defaultObject.code;
        return (
          <ListOptions apis={apis.cms} groupCode={groupCode} objectCode={objectCode} plugins={plugins}>
            {({ ref, columns, topOptions, optionsColumn }) => {
              return (
                <TablePage
                  {...Object.assign({}, apis.cms.content.getList, {
                    params: { objectCode, groupCode }
                  })}
                  columns={[...columns, optionsColumn]}
                  ref={ref}
                  name={`cms-client-${groupCode}`}
                  page={{
                    ...props,
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
                  }}
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
