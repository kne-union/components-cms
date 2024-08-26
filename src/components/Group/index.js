import { useRef } from 'react';
import { createWithRemoteLoader } from '@kne/remote-loader';
import getColumns from './getColumns';
import { Space, Button, App } from 'antd';
import FormInner from './FormInner';
import { useNavigate } from 'react-router-dom';

const Group = createWithRemoteLoader({
  modules: ['components-core:Layout@TablePage', 'components-core:Global@usePreset', 'components-core:FormInfo@useFormModal']
})(({ remoteModules, baseUrl = '' }) => {
  const [TablePage, usePreset, useFormModal] = remoteModules;
  const ref = useRef(null);
  const { ajax, apis } = usePreset();
  const formModal = useFormModal();
  const navigate = useNavigate();
  const { message } = App.useApp();
  return (
    <TablePage
      {...Object.assign({}, apis.cms.group.getList)}
      page={{
        titleExtra: (
          <Space>
            <Button
              type="primary"
              onClick={() => {
                const formModalApi = formModal({
                  title: '添加对象集合',
                  size: 'small',
                  formProps: {
                    onSubmit: async data => {
                      const { data: resData } = await ajax(
                        Object.assign({}, apis.cms.group.add, {
                          data
                        })
                      );
                      if (resData.code !== 0) {
                        return;
                      }
                      message.success('添加对象集合成功');
                      formModalApi.close();
                      ref.current.reload();
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
      ref={ref}
      columns={[
        ...getColumns({
          navigateTo: item => {
            navigate(`${baseUrl}/object?group=${item.code}`);
          }
        }),
        {
          name: 'options',
          type: 'options',
          fixed: 'right',
          valueOf: item => {
            return [
              {
                children: '编辑',
                onClick: () => {
                  const formModalApi = formModal({
                    title: '修改对象集合',
                    size: 'small',
                    formProps: {
                      data: Object.assign({}, item),
                      onSubmit: async data => {
                        const { data: resData } = await ajax(
                          Object.assign({}, apis.cms.group.save, {
                            data: Object.assign({}, data, { id: item.id })
                          })
                        );
                        if (resData.code !== 0) {
                          return;
                        }
                        message.success('修改对象集合成功');
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
                    title: '复制对象集合',
                    size: 'small',
                    formProps: {
                      data: Object.assign({}, item, {
                        name: `${item.name}_copy`,
                        code: `${item.code}_copy`,
                      }),
                      onSubmit: async data => {
                        const { data: resData } = await ajax(
                          Object.assign({}, apis.cms.group.copy, {
                            data: Object.assign({}, data, { copyGroupCode: item.code })
                          })
                        );
                        if (resData.code !== 0) {
                          return;
                        }
                        message.success('复制对象集合成功');
                        formModalApi.close();
                        ref.current.reload();
                      }
                    },
                    children: <FormInner />
                  });
                }
              },
              item.status === 0
                ? {
                    children: '关闭',
                    message: '确定要关闭该对象集合，该操作会导致当前对象集合不再可用',
                    isDelete: false,
                    onClick: async () => {
                      const { data: resData } = await ajax(
                        Object.assign({}, apis.cms.group.close, {
                          data: { id: item.id }
                        })
                      );
                      if (resData.code !== 0) {
                        return;
                      }
                      message.success('关闭对象集合成功');
                      ref.current.reload();
                    }
                  }
                : {
                    children: '开启',
                    onClick: async () => {
                      const { data: resData } = await ajax(
                        Object.assign({}, apis.cms.group.open, {
                          data: { id: item.id }
                        })
                      );
                      if (resData.code !== 0) {
                        return;
                      }
                      message.success('开启对象集合成功');
                      ref.current.reload();
                    }
                  },
              {
                children: '删除',
                message: '确定要删除该对象集合吗？注意包含对象的集合不允许被删除请使用关闭操作',
                onClick: async () => {
                  const { data: resData } = await ajax(
                    Object.assign({}, apis.cms.group.remove, {
                      data: { id: item.id }
                    })
                  );
                  if (resData.code !== 0) {
                    return;
                  }
                  message.success('删除对象集合成功');
                  ref.current.reload();
                }
              }
            ];
          }
        }
      ]}
      name="cms-group"
      pagination={{ paramsType: 'params' }}
    />
  );
});

export default Group;
