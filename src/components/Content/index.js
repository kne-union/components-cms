import { createWithRemoteLoader } from '@kne/remote-loader';
import Fetch from '@kne/react-fetch';
import ListOptions from './ListOptions';
import { Button, Flex } from 'antd';

const Content = createWithRemoteLoader({
  modules: ['components-core:Table@TablePage', 'components-core:Global@usePreset']
})(({ remoteModules, groupCode, objectCode, plugins = {} }) => {
  const [TablePage, usePreset] = remoteModules;
  const { apis } = usePreset();
  return (
    <ListOptions apis={apis.cms} groupCode={groupCode} objectCode={objectCode} plugins={plugins} topOptionsSize="small">
      {({ ref, topOptions, columns, optionsColumn }) => {
        return (
          <Flex vertical gap={8} flex={1}>
            <Flex justify="space-between">
              <div></div>
              {topOptions}
            </Flex>
            <TablePage
              {...Object.assign({}, apis.cms.content.getList, {
                params: { objectCode, groupCode }
              })}
              columns={[...columns, optionsColumn]}
              ref={ref}
              name="cms-field-content"
              pagination={{ paramsType: 'params' }}
            />
          </Flex>
        );
      }}
    </ListOptions>
  );
});

export default Content;
export { ListOptions };
