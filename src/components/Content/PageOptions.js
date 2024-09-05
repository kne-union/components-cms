import { createWithRemoteLoader } from '@kne/remote-loader';
import { useRef, useState } from 'react';
import { Space, Button, App, Empty } from 'antd';
import Fetch from '@kne/react-fetch';
import { ObjectFormInner } from '@components/ObjectFormInner';
import ContentView, { DisplayFieldValue } from '@components/ContentView';
import { useCurrentTypes } from '@components/Field';
import style from './style.module.scss';

const PageOptions = createWithRemoteLoader({
  modules: [
    'components-core:FormInfo@useFormModal',
    'components-core:Global@usePreset',
    'components-core:Filter',
    'components-core:Modal@useModal',
    'components-core:ButtonGroup'
  ]
})(({ remoteModules, apis, groupCode, objectCode, plugins, topOptionsSize, children }) => {
  const [useFormModal, usePreset, Filter, useModal, ButtonGroup] = remoteModules;
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
        const addContentHandler = () => {
          const formModalApi = formModal({
            title: `添加${metaInfo.object.name}`,
            formProps: {
              onSubmit: async data => {
                const { data: resData } = await ajax(
                  Object.assign({}, metaInfo.object.isSingle ? apis.content.saveSingle : apis.content.add, {
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
        };

        const createContentOptions = ({ data, referenceContents, options = {} }) => {
          const detail = {
            ...options,
            children: '查看',
            onClick: () => {
              modal({
                title: metaInfo.object.name,
                children: (
                  <ContentView data={data} groupCode={groupCode} objectCode={objectCode} referenceContents={referenceContents} plugins={plugins} />
                )
              });
            }
          };

          const edit = {
            ...options,
            children: '编辑',
            onClick: () => {
              const formModalApi = formModal({
                title: `编辑${metaInfo.object.name}`,
                formProps: {
                  data: Object.assign({}, data),
                  onSubmit: async data => {
                    const { data: resData } = await ajax(
                      metaInfo.object.isSingle
                        ? Object.assign({}, apis.content.saveSingle, {
                            data: {
                              data,
                              groupCode,
                              objectCode
                            }
                          })
                        : Object.assign({}, apis.content.save, {
                            data: { data: Object.assign({}, data, { id: data.id }) }
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
          };

          const remove = {
            ...options,
            children: '删除',
            confirm: true,
            onClick: async () => {
              const { data: resData } = await ajax(
                Object.assign({}, apis.content.remove, {
                  data: { id: data.id }
                })
              );
              if (resData.code !== 0) {
                return;
              }

              message.success(`删除${metaInfo.object.name}成功`);
              ref.current.reload();
            }
          };

          return metaInfo.object.isSingle ? [edit] : [detail, edit, remove];
        };
        if (metaInfo.object.isSingle) {
          return (
            <Fetch
              {...Object.assign({}, apis.content.getDetailSingle, {
                params: { groupCode, objectCode }
              })}
              ref={ref}
              render={({ data: detail }) => {
                const { data } = detail;
                return children({
                  isSingle: true,
                  page: {
                    topOptions: (
                      <ButtonGroup
                        list={createContentOptions({
                          data,
                          options: { type: 'primary', size: topOptionsSize }
                        })}
                      />
                    ),
                    children: !data ? (
                      <Empty>
                        <Button type="primary" onClick={addContentHandler}>
                          添加{metaInfo.object.name}
                        </Button>
                      </Empty>
                    ) : (
                      <ContentView
                        className={style['single-detail-view']}
                        data={data}
                        groupCode={groupCode}
                        objectCode={objectCode}
                        plugins={plugins}
                      />
                    )
                  }
                });
              }}
            />
          );
        }
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
          isSingle: false,
          page: {
            filter: {
              value: filter,
              onChange: setFilter,
              list: filterList.length > 0 ? [filterList] : []
            },
            topOptions: (
              <Space>
                <Button size={topOptionsSize} type="primary" onClick={addContentHandler}>
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
                return createContentOptions({ data: item, referenceContents: data.referenceContents });
              }
            }
          }
        });
      }}
    />
  );
});

export default PageOptions;
