import { createWithRemoteLoader } from '@kne/remote-loader';
import { useRef, useState } from 'react';
import { Space, Button, App, Flex } from 'antd';
import Fetch from '@kne/react-fetch';
import ObjectFormInner from '@components/ObjectFormInner';
import get from 'lodash/get';

const ListOptions = createWithRemoteLoader({
  modules: [
    'components-core:FormInfo@useFormModal',
    'components-core:Global@usePreset',
    'components-core:Filter',
    'components-core:Modal@useModal',
    'components-core:Descriptions'
  ]
})(({ remoteModules, apis, groupCode, objectCode, plugins, children }) => {
  const [useFormModal, usePreset, Filter, useModal, Descriptions] = remoteModules;
  const ref = useRef(null);
  const [filter, setFilter] = useState([]);
  const { ajax } = usePreset();
  const formModal = useFormModal();
  const modal = useModal();
  const { message } = App.useApp();

  return (
    <Fetch
      {...Object.assign({}, apis.object.getMetaInfo, {
        params: { groupCode, objectCode }
      })}
      render={({ data: metaInfo }) => {
        return children({
          ref,
          filter: {
            value: filter,
            onChange: setFilter,
            list: []
          },
          topOptions: (
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  const formModalApi = formModal({
                    title: '添加数据',
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
                        message.success('添加数据成功');
                        ref.current.reload();
                        formModalApi.close();
                      }
                    },
                    children: <ObjectFormInner objectCode={objectCode} groupCode={groupCode} apis={apis} plugins={plugins} />
                  });
                }}
              >
                添加数据
              </Button>
            </Space>
          ),
          metaInfo,
          columns: metaInfo.fields.map(field => {
            const getColumnType = field => {
              if (field.type === 'date-range') {
                return 'dateRange';
              }
              if (field.type === 'date') {
                return 'date';
              }

              if (field.type === 'datetime') {
                return 'datetime';
              }

              return 'other';
            };
            const getColumnValueOf = field => {
              const format = ({ value, type }) => {
                if (type === 'boolean') {
                  return value ? '是' : '否';
                }

                return value;
              };
              if (field.isList && field.type === 'reference') {
                return (item, { name }) => (
                  <Button
                    type="link"
                    onClick={() => {
                      const renderValue = (value, index) => {
                        return (
                          <Fetch
                            {...Object.assign({}, apis.field.getList, {
                              params: { groupCode, objectCode: field.referenceObjectCode }
                            })}
                            render={({ data: fields }) => {
                              const dataSource = [];
                              fields
                                .map(({ name, fieldName }) => {
                                  return {
                                    label: name,
                                    content: get(value, fieldName)
                                  };
                                })
                                .forEach((target, index) => {
                                  const currentIndex = Math.floor(index / 2);
                                  if (!dataSource[currentIndex]) {
                                    dataSource[currentIndex] = [];
                                  }
                                  dataSource[currentIndex].push(target);
                                });
                              return (
                                <div>
                                  <Descriptions dataSource={dataSource} key={index} />
                                </div>
                              );
                            }}
                          />
                        );
                      };
                      modal({
                        title: field.name,
                        children: (
                          <Flex vertical gap={8}>
                            {item[name].map(renderValue)}
                          </Flex>
                        )
                      });
                    }}
                  >
                    查看
                  </Button>
                );
              }
              if (field.isList) {
                return (item, { name }) => {
                  const list = item[name];
                  if (!list) {
                    return null;
                  }
                  return list
                    .map(value => {
                      return format({ value, type: field.type });
                    })
                    .join(',');
                };
              }

              return (item, { name }) => {
                return format({ value: item[name], type: field.type });
              };
            };

            return {
              name: field.fieldName,
              title: field.name,
              ellipsis: true,
              type: getColumnType(field),
              valueOf: getColumnValueOf(field)
            };
          }),
          optionsColumn: {
            name: 'options',
            title: '操作',
            type: 'options',
            fixed: 'right',
            valueOf: item => {
              return [
                {
                  children: '编辑',
                  onClick: () => {
                    const formModalApi = formModal({
                      title: '编辑数据',
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
                          message.success('保存数据成功');
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

                    message.success('删除数据成功');
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
