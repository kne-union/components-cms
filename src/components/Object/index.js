import { useRef } from 'react';
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import { createWithRemoteLoader } from '@kne/remote-loader';
import getColumns from './getColumns';
import { Space, Button, App } from 'antd';
import Fetch from '@kne/react-fetch';
import FormInner from './FormInner';

const Model = createWithRemoteLoader({
  modules: ['components-core:Layout@TablePage', 'components-core:Global@usePreset', 'components-core:FormInfo@useFormModal']
})(({ remoteModules, baseUrl = '' }) => {
  const [TablePage, usePreset, useFormModal] = remoteModules;
  const { ajax, apis } = usePreset();
  const [searchParams] = useSearchParams();
  const groupCode = searchParams.get('group');
  const ref = useRef(null);
  const formModal = useFormModal();
  const navigate = useNavigate();
  const { message } = App.useApp();
  if (!groupCode) {
    return <Navigate to="/404" />;
  }

  return (
    <Fetch
      {...Object.assign({}, apis.cms.group.getDetailByCode, { params: { code: groupCode } })}
      render={({ data }) => {
        return (
          <TablePage
            {...Object.assign({}, apis.cms.object.getList, {
              params: { groupCode }
            })}
            ref={ref}
            page={{
              backUrl: baseUrl,
              title: data.name,
              titleExtra: (
                <Space>
                  <Button
                    type="primary"
                    onClick={() => {
                      const formModalApi = formModal({
                        title: '添加对象',
                        size: 'small',
                        formProps: {
                          onSubmit: async data => {
                            const { data: resData } = await ajax(
                              Object.assign({}, apis.cms.object.add, {
                                data: Object.assign({}, data, {
                                  groupCode
                                })
                              })
                            );

                            if (resData.code !== 0) {
                              return;
                            }
                            message.success('添加对象成功');
                            ref.current.reload();
                            formModalApi.close();
                          }
                        },
                        children: <FormInner />
                      });
                    }}
                  >
                    添加
                  </Button>
                </Space>
              )
            }}
            columns={[
              ...getColumns({
                navigateTo: item => {
                  navigate(`${baseUrl}/object-detail?group=${groupCode}&object=${item.code}`);
                }
              }),
              {
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
                          title: '编辑对象',
                          size: 'small',
                          formProps: {
                            data: Object.assign({}, item),
                            onSubmit: async data => {
                              const { data: resData } = await ajax(
                                Object.assign({}, apis.cms.object.save, {
                                  data: Object.assign({}, data, { id: item.id })
                                })
                              );

                              if (resData.code !== 0) {
                                return;
                              }
                              message.success('对象修改成功');
                              formModalApi.close();
                              ref.current.reload();
                            }
                          },
                          children: <FormInner isEdit />
                        });
                      }
                    },
                    {
                      children: '复制',
                      onClick: () => {
                        const formModalApi = formModal({
                          title: '复制对象',
                          size: 'small',
                          formProps: {
                            data: Object.assign({}, item, {
                              name: `${item.name}_copy`,
                              code: `${item.code}_copy`,
                            }),
                            onSubmit: async data => {
                              const { data: resData } = await ajax(
                                Object.assign({}, apis.cms.object.copy, {
                                  data: Object.assign({}, data, { id: item.id })
                                })
                              );

                              if (resData.code !== 0) {
                                return;
                              }
                              message.success('对象修改成功');
                              formModalApi.close();
                              ref.current.reload();
                            }
                          },
                          children: <FormInner isCopy />
                        });
                      }
                    },
                    item.status === 0
                      ? {
                          children: '关闭',
                          message: '确定要关闭该对象吗？',
                          isDelete: false,
                          onClick: async () => {
                            const { data: resData } = await ajax(Object.assign({}, apis.cms.object.close, { data: { id: item.id } }));
                            if (resData.code !== 0) {
                              return;
                            }
                            message.success('关闭对象成功');
                            ref.current.reload();
                          }
                        }
                      : {
                          children: '开启',
                          onClick: async () => {
                            const { data: resData } = await ajax(Object.assign({}, apis.cms.object.open, { data: { id: item.id } }));
                            if (resData.code !== 0) {
                              return;
                            }
                            message.success('开启对象成功');
                            ref.current.reload();
                          }
                        },
                    {
                      children: '删除',
                      message: '确定要删除该对象吗？请勿删除已经使用的对象',
                      onClick: async () => {
                        const { data: resData } = await ajax(Object.assign({}, apis.cms.object.remove, { data: { id: item.id } }));
                        if (resData.code !== 0) {
                          return;
                        }
                        message.success('删除对象成功');
                        ref.current.reload();
                      }
                    }
                  ];
                }
              }
            ]}
            dataFormat={data => {
              return { list: data };
            }}
            name="cms-model"
            pagination={{ open: false }}
          />
        );
      }}
    />
  );
});

export default Model;
