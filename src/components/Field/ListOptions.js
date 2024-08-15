import { createWithRemoteLoader } from '@kne/remote-loader';
import { useRef, useState } from 'react';
import { Space, Flex, Button, App } from 'antd';
import FormInner from './FormInner';

const ListOptions = createWithRemoteLoader({
  modules: ['components-core:FormInfo@useFormModal', 'components-core:Global@usePreset', 'components-core:Filter']
})(({ remoteModules, apis, topOptionsSize, topOptionsChildren, children }) => {
  const [useFormModal, usePreset, Filter] = remoteModules;
  const { ajax } = usePreset();
  const ref = useRef(null);
  const [filter, setFilter] = useState([]);
  const { message } = App.useApp();
  const formModal = useFormModal();
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
          size={topOptionsSize}
          onClick={() => {
            const formModalApi = formModal({
              title: '添加字段',
              formProps: {
                onSubmit: async data => {
                  const { data: resData } = await ajax(
                    Object.assign({}, apis.cms.field.add, {
                      data
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
              children: <FormInner />
            });
          }}
        >
          添加字段
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
            children: '编辑'
          },
          {
            children: '上移'
          },
          {
            children: '下移'
          },
          {
            children: '删除',
            isDelete: true
          }
        ];
      }
    }
  });
});

export default ListOptions;
