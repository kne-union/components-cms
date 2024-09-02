import { createWithRemoteLoader } from '@kne/remote-loader';
import { useRef, useState } from 'react';
import { Space, Flex, Button, App } from 'antd';
import FormInner from './FormInner';
import Fetch from '@kne/react-fetch';
import ObjectFormInner from '@components/ObjectFormInner';

const ListOptions = createWithRemoteLoader({
  modules: ['components-core:FormInfo@useFormModal', 'components-core:Global@usePreset', 'components-core:Filter']
})(({ remoteModules, groupCode, objectCode, apis, plugins, topOptionsSize, topOptionsChildren, children }) => {
  const [useFormModal, usePreset, Filter] = remoteModules;
  const { ajax } = usePreset();
  const ref = useRef(null);
  const [filter, setFilter] = useState([]);
  const { message } = App.useApp();
  const formModal = useFormModal();
  return (
    <Fetch
      {...Object.assign({}, apis.object.getDetailByCode, {
        params: { groupCode, code: objectCode }
      })}
      render={({ data }) => {
        return children({
          ref,
          filter: {
            value: filter,
            onChange: setFilter,
            list: []
          },
          topOptions: (
            <Space>
              {topOptionsChildren ? topOptionsChildren({ ref }) : null}
              <Button
                type="primary"
                size={topOptionsSize}
                onClick={() => {
                  const formModalApi = formModal({
                    title: '添加字段',
                    formProps: {
                      onSubmit: async formData => {
                        const { data: resData } = await ajax(
                          Object.assign({}, apis.field.add, {
                            data: Object.assign({}, formData, {
                              objectCode,
                              groupCode
                            })
                          })
                        );
                        if (resData.code !== 0) {
                          return;
                        }
                        message.success('添加字段成功');
                        formModalApi.close();
                        ref.current.reload();
                      }
                    },
                    children: <FormInner groupCode={data.group.code} modelCode={data.code} apis={apis} plugins={plugins} />
                  });
                }}
              >
                添加字段
              </Button>
              <Button
                size={topOptionsSize}
                onClick={() => {
                  formModal({
                    title: '表单预览',
                    children: <ObjectFormInner objectCode={objectCode} groupCode={groupCode} apis={apis} plugins={plugins} />,
                    formProps: {
                      onSubmit: (formData) => {
                        console.log(formData);
                      }
                    }
                  });
                }}
              >
                表单预览
              </Button>
            </Space>
          ),
          optionsColumn: {
            name: 'options',
            title: '操作',
            type: 'options',
            fixed: 'right',
            valueOf: item => {
              return [
                {
                  children: '复制',
                  onClick: () => {
                    const formModalApi = formModal({
                      title: '复制',
                      formProps: {
                        data: Object.assign({}, item),
                        onSubmit: async formData => {
                          const { data: resData } = await ajax(
                            Object.assign({}, apis.field.add, {
                              data: Object.assign({}, formData, {
                                objectCode,
                                groupCode
                              })
                            })
                          );
                          if (resData.code !== 0) {
                            return;
                          }
                          message.success('复制字段成功');
                          formModalApi.close();
                          ref.current.reload();
                        }
                      },
                      children: <FormInner groupCode={data.group.code} modelCode={data.code} apis={apis} plugins={plugins} />
                    });
                  }
                },
                {
                  children: '编辑',
                  onClick: () => {
                    const formModalApi = formModal({
                      title: '编辑字段',
                      formProps: {
                        data: Object.assign({}, item),
                        onSubmit: async formData => {
                          const { data: resData } = await ajax(
                            Object.assign({}, apis.field.save, {
                              data: Object.assign({}, formData, {
                                id: item.id
                              })
                            })
                          );
                          if (resData.code !== 0) {
                            return;
                          }
                          message.success('字段保存成功');
                          formModalApi.close();
                          ref.current.reload();
                        }
                      },
                      children: <FormInner groupCode={data.group.code} modelCode={data.code} apis={apis} isEdit plugins={plugins} />
                    });
                  }
                },
                {
                  children: '上移',
                  onClick: async () => {
                    const { data: resData } = await ajax(
                      Object.assign({}, apis.field.moveUp, {
                        data: { id: item.id }
                      })
                    );
                    if (resData.code !== 0) {
                      return;
                    }
                    ref.current.reload();
                  }
                },
                {
                  children: '下移',
                  onClick: async () => {
                    const { data: resData } = await ajax(
                      Object.assign({}, apis.field.moveDown, {
                        data: { id: item.id }
                      })
                    );
                    if (resData.code !== 0) {
                      return;
                    }
                    ref.current.reload();
                  }
                },
                item.status === 0
                  ? {
                      children: '关闭',
                      message: '确定要关闭该对象吗？',
                      isDelete: false,
                      onClick: async () => {
                        const { data: resData } = await ajax(Object.assign({}, apis.field.close, { data: { id: item.id } }));
                        if (resData.code !== 0) {
                          return;
                        }
                        message.success('关闭字段成功');
                        ref.current.reload();
                      }
                    }
                  : {
                      children: '开启',
                      onClick: async () => {
                        const { data: resData } = await ajax(Object.assign({}, apis.field.open, { data: { id: item.id } }));
                        if (resData.code !== 0) {
                          return;
                        }
                        message.success('开启字段成功');
                        ref.current.reload();
                      }
                    },
                {
                  children: '删除',
                  isDelete: true,
                  confirm: true,
                  onClick: async () => {
                    const { data: resData } = await ajax(
                      Object.assign({}, apis.field.remove, {
                        data: { id: item.id }
                      })
                    );
                    if (resData.code !== 0) {
                      return;
                    }
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
