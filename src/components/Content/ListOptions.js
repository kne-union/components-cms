import { createWithRemoteLoader } from '@kne/remote-loader';
import { useRef, useState } from 'react';
import { Space, Button, App } from 'antd';
import Fetch from '@kne/react-fetch';
import ObjectFormInner from '@components/ObjectFormInner';
import ContentView, { DisplayFieldValue } from '@components/ContentView';
import { useCurrentTypes } from '@components/Field';

const ListOptions = createWithRemoteLoader({
  modules: [
    'components-core:FormInfo@useFormModal',
    'components-core:Global@usePreset',
    'components-core:Filter',
    'components-core:Modal@useModal',
    'components-core:Descriptions',
    'components-core:File@FileLink'
  ]
})(({ remoteModules, apis, groupCode, objectCode, plugins, children }) => {
  const [useFormModal, usePreset, Filter, useModal, Descriptions, FileLink] = remoteModules;
  const ref = useRef(null);
  const [filter, setFilter] = useState([]);
  const { ajax } = usePreset();
  const formModal = useFormModal();
  const modal = useModal();
  const { message } = App.useApp();
  const currentTypes = useCurrentTypes(plugins?.types);
  return (
    <Fetch
      {...Object.assign({}, apis.object.getMetaInfo, {
        params: { groupCode, objectCode }
      })}
      render={({ data: metaInfo }) => {
        const filterList = metaInfo.fields
          .filter(field => {
            const currentType = currentTypes.get(field.type);
            return field.referenceType !== 'inner' && field.isIndexed && !!currentType.filter;
          })
          .map(field => {
            const currentType = currentTypes.get(field.type);
            const filter = (() => {
              if (typeof currentType.filter === 'string') {
                return {
                  name: currentType.filter,
                  props: {}
                };
              }
              return currentType.filter;
            })();
            const FilterItem = Filter.fields[filter.name];

            return (
              <FilterItem
                name={field.code}
                label={field.name}
                {...Object.assign(
                  {},
                  typeof filter.props === 'function'
                    ? filter.props({
                        apis,
                        field
                      })
                    : filter.props
                )}
              />
            );
          });
        return children({
          ref,
          filter: {
            value: filter,
            onChange: setFilter,
            list: filterList.length > 0 ? [filterList] : []
          },
          topOptions: (
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  const formModalApi = formModal({
                    title: `添加${metaInfo.object.name}`,
                    formProps: {
                      onSubmit: async data => {
                        const { data: resData } = await ajax(
                          Object.assign({}, apis.content.add, {
                            data: {
                              data,
                              groupCode,
                              objectCode
                            }
                          })
                        );
                        if (resData.code !== 0) {
                          return;
                        }
                        message.success(`添加${metaInfo.object.name}成功`);
                        ref.current.reload();
                        formModalApi.close();
                      }
                    },
                    children: <ObjectFormInner objectCode={objectCode} groupCode={groupCode} apis={apis} plugins={plugins} />
                  });
                }}
              >
                添加{metaInfo.object.name}
              </Button>
            </Space>
          ),
          metaInfo,
          columns: metaInfo.fields
            .filter(({ isHidden }) => !isHidden)
            .map(field => {
              return {
                name: field.fieldName,
                title: field.name,
                ellipsis: true,
                type: 'other',
                valueOf: (item, { name, data }) => (
                  <DisplayFieldValue
                    value={item[name]}
                    field={field}
                    apis={apis}
                    plugins={plugins}
                    referenceContents={data.referenceContents}
                    isInline
                  />
                )
              };
            }),
          optionsColumn: {
            name: 'options',
            title: '操作',
            type: 'options',
            fixed: 'right',
            valueOf: (item, { data }) => {
              return [
                {
                  children: '查看',
                  onClick: () => {
                    modal({
                      title: metaInfo.object.name,
                      children: (
                        <ContentView
                          data={item}
                          groupCode={groupCode}
                          objectCode={objectCode}
                          referenceContents={data.referenceContents}
                          plugins={plugins}
                        />
                      )
                    });
                  }
                },
                {
                  children: '编辑',
                  onClick: () => {
                    const formModalApi = formModal({
                      title: `编辑${metaInfo.object.name}`,
                      formProps: {
                        data: Object.assign({}, item),
                        onSubmit: async data => {
                          const { data: resData } = await ajax(
                            Object.assign({}, apis.content.save, {
                              data: { data: Object.assign({}, data, { id: item.id }) }
                            })
                          );
                          if (resData.code !== 0) {
                            return;
                          }
                          message.success(`保存${metaInfo.object.name}成功`);
                          ref.current.reload();
                          formModalApi.close();
                        }
                      },
                      children: <ObjectFormInner objectCode={objectCode} groupCode={groupCode} apis={apis} plugins={plugins} />
                    });
                  }
                },
                {
                  children: '删除',
                  confirm: true,
                  onClick: async () => {
                    const { data: resData } = await ajax(
                      Object.assign({}, apis.content.remove, {
                        data: { id: item.id }
                      })
                    );
                    if (resData.code !== 0) {
                      return;
                    }

                    message.success(`删除${metaInfo.object.name}成功`);
                    ref.current.reload();
                  }
                }
              ];
            }
          }
        });
      }}
    />
  );
});

export default ListOptions;
