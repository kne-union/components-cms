import { createWithRemoteLoader } from '@kne/remote-loader';
import PageOptions from './PageOptions';
import { Flex } from 'antd';
import style from './style.module.scss';

const Content = createWithRemoteLoader({
  modules: ['components-core:Table@TablePage', 'components-core:Filter']
})(({ remoteModules, apis, groupCode, objectCode, plugins = {} }) => {
  const [TablePage, Filter] = remoteModules;
  const { getFilterValue } = Filter;
  return (
    <PageOptions apis={apis} groupCode={groupCode} objectCode={objectCode} plugins={plugins} topOptionsSize="small">
      {({ ref, isSingle, page }) => {
        if (isSingle) {
          const { topOptions, children } = page;
          return (
            <Flex vertical gap={8} flex={1}>
              <Flex justify="space-between">
                <div></div>
                {topOptions}
              </Flex>
              <div>{children}</div>
            </Flex>
          );
        }
        const { filter, topOptions, columns, optionsColumn } = page;
        return (
          <Flex vertical gap={8} flex={1}>
            {filter.list && filter.list.length > 0 ? (
              <Filter {...filter} extra={topOptions} className={style['page-filter']} />
            ) : (
              <Flex justify="space-between">
                <div></div>
                {topOptions}
              </Flex>
            )}
            <TablePage
              {...Object.assign({}, apis.content.getList, {
                params: Object.assign({}, { objectCode, groupCode }, { filter: getFilterValue(filter.value) })
              })}
              columns={[...columns, optionsColumn]}
              ref={ref}
              name="cms-field-content"
              pagination={{ paramsType: 'params' }}
            />
          </Flex>
        );
      }}
    </PageOptions>
  );
});

export default Content;
export { PageOptions };
