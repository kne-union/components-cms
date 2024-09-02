const getColumns = ({ navigateTo }) => {
  return [
    {
      name: 'name',
      title: '名称',
      type: 'mainInfo',
      onClick: ({ colItem }) => navigateTo(colItem)
    },
    {
      name: 'type',
      title: '类型',
      type: 'tag',
      valueOf: (item, { name }) => {
        if (item[name] === 'inner') {
          return { type: 'info', text: '内部' };
        }
        return { type: 'success', text: '外部' };
      }
    },
    {
      name: 'code',
      title: 'code',
      type: 'mainInfo',
      onClick: ({ colItem }) => navigateTo(colItem)
    },
    {
      name: 'tag',
      title: '标签',
      type: 'tag',
      valueOf: (item, { name }) => {
        return item[name] && { text: item[name] };
      }
    },
    {
      name: 'isSingle',
      title: '是否单例',
      type: 'tag',
      valueOf: (item, { name }) => {
        if (item[name]) {
          return { type: 'success', text: '是' };
        }
        return { type: 'info', text: '否' };
      }
    },
    {
      name: 'status',
      title: '状态',
      type: 'tag',
      valueOf: (item, { name }) => {
        if (item[name] === 0) {
          return { type: 'success', text: '正常' };
        }
        if (item[name] === 10) {
          return { type: 'danger', text: '已关闭' };
        }
        return { text: '其他' };
      }
    },
    {
      name: 'description',
      title: '描述',
      type: 'description'
    }
  ];
};

export default getColumns;
